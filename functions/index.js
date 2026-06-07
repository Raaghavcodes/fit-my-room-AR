const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");
const FormData = require("form-data");
const { applyPhysicalScale } = require("./utils/geometry");

const TRIPO_API_KEY = process.env.TRIPO_API_KEY || '';
const TRIPO_BASE_URL = "https://api.tripo3d.ai/v2/openapi";

/**
 * startGeneration: Uploads image to Tripo3D and creates a task.
 * Returns the taskId immediately (fast, ~3-5 seconds).
 * 
 * Request: { imageBase64: string, imageFormat: string }
 * Response: { taskId: string }
 */
exports.startGeneration = onRequest(
  { cors: true, timeoutSeconds: 30, memory: "512MiB" },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      let imagesParam = req.body.images;
      const legacyImage = req.body.imageBase64;
      
      if (!imagesParam && !legacyImage) {
        return res.status(400).json({ error: "images array or imageBase64 is required" });
      }

      // Convert legacy to new array format for uniform processing
      if (!imagesParam && legacyImage) {
        imagesParam = [{ type: "front", base64: legacyImage, format: req.body.imageFormat || "png" }];
      }

      console.log(`Processing ${imagesParam.length} images for upload...`);

      // Upload all images in parallel
      const uploadPromises = imagesParam.map(async (img) => {
        const format = img.format || "png";
        const imageBuffer = Buffer.from(img.base64, "base64");
        const form = new FormData();
        form.append("file", imageBuffer, {
          filename: `furniture_${img.type}.${format}`,
          contentType: `image/${format}`,
        });

        const uploadResponse = await axios.post(
          `${TRIPO_BASE_URL}/upload`,
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: `Bearer ${TRIPO_API_KEY}`,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        const token = uploadResponse.data?.data?.image_token;
        if (!token) throw new Error("Failed to upload an image to Tripo");
        
        return {
          type: img.type,
          file: {
            type: "image",
            file_token: token
          }
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      console.log(`Successfully uploaded ${uploadedFiles.length} images.`);

      // Step 2: Create the generation task
      // NOTE: multiview_to_model requires a paid Tripo plan.
      // For now, always use image_to_model with the "front" image.
      const frontFile = uploadedFiles.find(f => f.type === "front") || uploadedFiles[0];
      const taskPayload = {
        type: "image_to_model",
        file: frontFile.file
      };

      console.log(`Creating ${taskPayload.type} task with payload:`, JSON.stringify(taskPayload));
      const taskResponse = await axios.post(
        `${TRIPO_BASE_URL}/task`,
        taskPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TRIPO_API_KEY}`,
          },
        }
      );

      const taskId = taskResponse.data?.data?.task_id;
      if (!taskId) {
        console.error("Task response:", JSON.stringify(taskResponse.data));
        return res.status(500).json({ error: "Failed to create task" });
      }

      console.log("Task created:", taskId);
      // Return immediately — client will poll checkStatus separately
      return res.status(200).json({ taskId });
    } catch (error) {
      console.error("Error in startGeneration:", error?.response?.data || error.message);
      return res.status(500).json({
        error: "Internal server error",
        details: error?.response?.data || error.message,
      });
    }
  }
);

/**
 * checkStatus: Checks the status of a Tripo3D generation task.
 * Returns immediately with the current status (fast, <1 second).
 * 
 * Request: { taskId: string }
 * Response: { status: string, modelUrl?: string }
 */
exports.checkStatus = onRequest(
  { cors: true, timeoutSeconds: 15 },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { taskId } = req.body;
      if (!taskId) {
        return res.status(400).json({ error: "taskId is required" });
      }

      const statusResponse = await axios.get(
        `${TRIPO_BASE_URL}/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${TRIPO_API_KEY}`,
          },
        }
      );

      const status = statusResponse.data?.data?.status;
      const output = statusResponse.data?.data?.output;
      console.log(`Task ${taskId}: status = ${status}, output =`, JSON.stringify(output));

      // Tripo3D may return the model URL under different field names
      let modelUrl = null;
      if (status === "success" && output) {
        modelUrl = output.model || output.pbr_model || output.base_model || output.rendered_image || null;
        // If none of the known fields work, grab the first URL-like value
        if (!modelUrl) {
          for (const key of Object.keys(output)) {
            if (typeof output[key] === 'string' && output[key].startsWith('http')) {
              modelUrl = output[key];
              console.log(`Found model URL under field: ${key}`);
              break;
            }
          }
        }
      }

      return res.status(200).json({
        status,
        modelUrl,
      });
    } catch (error) {
      console.error("Error in checkStatus:", error?.response?.data || error.message);
      return res.status(500).json({
        error: "Failed to check status",
        details: error?.response?.data || error.message,
      });
    }
  }
);

/**
 * proxyModel: Downloads a GLB model from Tripo3D's CDN and re-serves it
 * with proper CORS headers so model-viewer can load it in a WebView.
 * Optionally applies a physical scale transform directly to the binary
 * geometry to ensure AR Quick Look displays accurate real-world sizes.
 * 
 * Usage: GET /proxyModel?url=<encoded_tripo_url>&w=<val>&h=<val>&d=<val>
 */
exports.proxyModel = onRequest(
  { cors: true, timeoutSeconds: 30, memory: "512MiB" },
  async (req, res) => {
    try {
      const modelUrl = req.query.url;
      if (!modelUrl) {
        return res.status(400).json({ error: "url query param is required" });
      }

      console.log("Proxying model from:", String(modelUrl).substring(0, 80) + "...");

      const response = await axios.get(String(modelUrl), {
        responseType: "arraybuffer",
        timeout: 20000,
      });
      
      let glbBuffer = Buffer.from(response.data);
      
      // Parse dimensions in inches and calculate scale if provided
      const w = parseFloat(req.query.w) || 0;
      const h = parseFloat(req.query.h) || 0;
      const d = parseFloat(req.query.d) || 0;
      
      if (w > 0 || h > 0 || d > 0) {
        console.log(`Physically scaling GLB binary to match requested dimensions: ${w}x${h}x${d} inches`);
        try {
          glbBuffer = await applyPhysicalScale(glbBuffer, w, h, d);
        } catch (geomError) {
          console.error("Failed to alter GLB geometry scale:", geomError);
        }
      }

      res.set("Content-Type", "model/gltf-binary");
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cache-Control", "public, max-age=3600");
      return res.status(200).send(glbBuffer);
    } catch (error) {
      console.error("Proxy error:", error.message);
      return res.status(500).json({ error: "Failed to proxy model" });
    }
  }
);

/**
 * arViewer: Serves an HTML page with model-viewer for AR viewing in Safari.
 * Safari supports AR Quick Look natively via model-viewer's built-in AR button.
 * 
 * Usage: GET /arViewer?url=<encoded_tripo_url>
 */
exports.arViewer = onRequest(
  { cors: true, timeoutSeconds: 10 },
  async (req, res) => {
    const modelUrl = req.query.url || '';
    const fixedScale = req.query.fixed === '1';
    
    const w = parseFloat(req.query.w) || 0;
    const h = parseFloat(req.query.h) || 0;
    const d = parseFloat(req.query.d) || 0;
    
    // Pass the dimensions downstream to proxyModel so the binary gets modified!
    const PROXY_MODEL_URL = process.env.PROXY_MODEL_URL || '';
    let proxyUrl = `${PROXY_MODEL_URL}?url=${encodeURIComponent(modelUrl)}`;
    if (fixedScale && (w > 0 || h > 0 || d > 0)) {
      proxyUrl += `&w=${w}&h=${h}&d=${d}`;
    }
    
    const arScale = fixedScale ? 'fixed' : 'auto';
    
    // Calculate scale if dimensions are provided (fallback for web browser view)
    let scaleAttr = '';
    if (fixedScale && (w > 0 || h > 0 || d > 0)) {
      const wMeters = w * 0.0254;
      const hMeters = h * 0.0254;
      const dMeters = d * 0.0254;
      const scaleFactor = Math.max(wMeters, hMeters, dMeters); 
      scaleAttr = `scale="${scaleFactor} ${scaleFactor} ${scaleFactor}"`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AR Furniture Viewer</title>
  <style>
    body{margin:0;padding:0;background:#111;height:100vh;display:flex;flex-direction:column;}
    model-viewer{flex:1;width:100%;}
    .ar-btn{background:#3B82F6;color:#fff;border:none;padding:16px 24px;border-radius:12px;font-size:18px;font-weight:bold;position:absolute;bottom:32px;left:50%;transform:translateX(-50%);box-shadow:0 4px 12px rgba(0,0,0,0.3);}
  </style>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
</head>
<body>
  <model-viewer src="${proxyUrl}" ${scaleAttr} ar ar-modes="scene-viewer webxr quick-look" camera-controls auto-rotate shadow-intensity="1" tone-mapping="neutral" ar-scale="${arScale}">
    <button slot="ar-button" class="ar-btn">👆 View in your space</button>
  </model-viewer>
</body>
</html>`;
    
    res.set("Content-Type", "text/html");
    return res.status(200).send(html);
  }
);

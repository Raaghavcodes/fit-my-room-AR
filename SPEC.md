# Technical Specification (SPEC.md)

This document outlines the architecture, technology stack, and step-by-step technical roadmap for the **Furniture-AI AR Visualizer**.

## 1. Architecture Overview
The application follows a client-serverless architecture designed for rapid development and scalability.

- **Frontend**: React Native (Expo Router) for cross-platform iOS and Android mobile development.
- **Backend Infrastructure**: Firebase (Auth, Storage, Cloud Functions).
- **AR Viewer component**: Google's `<model-viewer>` component injected via React Native WebView to handle Quick Look (iOS) and Scene Viewer (Android) natively.
- **3D AI Generation**: Tripo3D API (Image-to-3D). Chosen specifically for its <15s generation speeds.

## 2. System Components

### A. React Native App (Client)
- **`app/index.tsx`**: Uses `expo-image-picker` to capture or select a 2D image.
- **`app/dimensions.tsx`**: Captures optional `Width`, `Height`, and `Depth` (in inches) to define the model scale.
- **`app/viewer.tsx`**: Generates a WebView containing `<model-viewer>`. Evaluates the dimensions and attaches `ar-scale="fixed"` if exact dimensions exist.

### B. Firebase (Backend & Bridge)
- **Storage bucket**: Holds the original 2D image and the returned `.glb`/`.usdz` 3D model files.
- **Cloud Functions (Node.js)**: Acts as a secure proxy to the Tripo3D API. The mobile app invokes an HTTPS Callable Function with an image URL. The function authenticates with Tripo3D, awaits the mesh generation, saves the file to Firebase Storage, and returns the final signed URL to the mobile app.

### C. AR and Scaling Logic
When dimensions (W x H x D) are provided by the user, the 3D model needs to be bounded by that exact physical box. `<model-viewer>` with the AR module natively supports fixed scaling, but if the AI returns an arbitrarily sized local origin, the client/backend may need to apply a mathematical scaling matrix to the resulting `.glb` file geometry before presenting it.

---

## 3. Implementation Roadmap (Step-by-Step)

### Phase 1: Environment & UI Prototyping (Completed)
1. Initialize Expo React Native project (`npx create-expo-app`).
2. Scaffold Firebase Client configuration (`firebase/app`, `firebase/auth`).
3. Build the Image Capture Screen (`expo-image-picker`).
4. Build the Dimension Input Screen.
5. Create the AR Viewer WebView scaffold.

### Phase 2: Backend API Proxy (Current/Next)
1. Initialize Firebase Cloud Functions in the repository.
2. Install `axios` or equivalent fetch library in functions.
3. Write an HTTPS function: `generateModel(imageUrl)`
   - Send HTTP POST to Tripo3D API endpoint with the image.
   - Poll Tripo3D task status until SUCCESS.
   - Download the generated `.glb` file.
   - Upload the `.glb` file into the Firebase Storage bucket.
   - Return the secure Firebase Storage URL to the mobile client.

### Phase 3: Client Integration
1. Replace the mock 5-second `setTimeout` loading state in `dimensions.tsx` with a real call to the Firebase Cloud Function (`generateModel`).
2. Pass the resulting `modelUrl` down to the `viewer.tsx` WebView.
3. Handle API errors, timeout failures, and empty states robustly.

### Phase 4: AR Scaling Calibration
1. Implement a dimension normalization layer. If Tripo3D outputs models on a 1x1x1 unit scale, multiply the unit scale by the user's provided Height/Width/Depth metrics.
2. Test scaling limits on iOS Quick Look using a known physical object (e.g., standard 12-inch ruler) via Expo Go.

### Phase 5: Polish & Deployment
1. Set up Expo Application Services (EAS) for cloud building `eas build --profile preview`.
2. Clean up UI states, add loading skeletons, improve error alerts.
3. Submit to TestFlight/Google Play Console internal testing.

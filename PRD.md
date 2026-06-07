# Product Requirements Document (PRD)

## 1. Product Objective
The **Furniture-AI AR Visualizer** allows users to visualize how secondhand marketplace furniture (from platforms like Facebook Marketplace, Craigslist, or OfferUp) will look and fit inside their own space using Augmented Reality (AR). 

The goal is to eliminate buyer hesitation regarding size, scale, and aesthetic fit without requiring the user to physically see the item first.

## 2. Target Audience
- Buyers shopping for secondhand furniture online who struggle to visualize the item in their current living space.
- Sellers looking to provide AR-ready assets of their listings to increase buyer confidence.

## 3. Core Features (MVP)
1. **Photo Upload Interface**: Users can upload 2D photos of furniture from their gallery or take a picture via their camera.
2. **Dimension Configuration & Auto-Scraping**: Users can optionally input the true physical dimensions of the item (Width, Height, Depth) if listed by the seller. If dimensions are unknown, the app will perform a reverse image search (via Google Shopping/Vision API) to find the original retailer listing (e.g., IKEA, Target) and automatically extract the physical dimensions for precise AR scaling.
3. **High-Speed 3D Generation**: Utilizing an AI pipeline that turns the 2D image into a clean 3D model (mesh/texture) in under 45 seconds to reduce friction.
4. **AR Room Viewer**: Users view the generated 3D model through their smartphone camera. If dimensions were provided, the object accurately scales to its physical size in the room using AR anchors.

## 4. User Flow
1. **Launch App** -> User is prompted to select/take a photo of a furniture piece.
2. **Input Screen** -> User provides known dimension measurements (optional).
3. **Processing Screen** -> The image is uploaded, and the AI converts it to a 3D model. A loading state details the expected time (15-45s).
4. **AR View** -> The user scans their floor with their camera, and the 3D model is projected into the physical space. The user can walk around it and verify the fit.

## 5. Non-Functional Requirements
- **Cross-Platform**: Must run natively on iOS and Android.
- **Speed**: Time-to-AR needs to be fast (<45s) to retain user engagement. Long generation times (minutes) will cause high drop-off rates on mobile app sessions.

## 6. Future Considerations
- Support for video capture for higher-quality 3D mesh generation (e.g., Gaussian Splatting).
- Integration directly into browser extensions (WebAR) so users don't have to leave the marketplace website to view the AR model.
- Saving a local library of user's generated AR items.

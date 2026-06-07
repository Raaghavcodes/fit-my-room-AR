# Fit My Room AR (Furniture-AI Visualizer)

> [!NOTE]
> **Portfolio Showcase Version:** This repository is a public showcase copy of the *Fit My Room AR* application, intended for review and portfolio demonstration purposes. To protect active 3rd-party API budgets, prevent infrastructure abuse, and protect intellectual property, all proprietary GLB binary scale transformations and API keys have been stubbed or externalized. Consequently, this repository is **not runnable out-of-the-box** without configuring your own private API keys and backend infrastructure.

*Fit My Room AR* is a mobile application built with React Native (Expo) that brings 2D furniture images to life in 3D Augmented Reality. It allows users to instantly visualize how a piece of furniture will look and fit in their actual physical space—before making a purchase.

## 🌟 Key Features

*   **Photo to 3D Generation:** Upload a single image of any furniture item, and our AI (powered by Tripo3D) automatically generates a high-quality 3D mesh and texture in minutes.
*   **True-to-Life Scaling:** Input the physical dimensions (width, height, depth) of the item. The app automatically scales the generated 3D model to its exact real-world size.
*   **Native AR Integration:** View the scaled 3D model in your physical room using iOS AR Quick Look or Android Scene Viewer. Walk around the item, visualize its footprint, and check if it matches your decor!

## 🛋️ Common Use Cases

Furniture-AI bridges the gap between online shopping and physical retail by letting you completely visualize a product in your space. 

1. **Facebook Marketplace & Craigslist Buyers:** See a couch on Facebook Marketplace? Save the picture, plug in the seller's listed dimensions, and project the 3D model right into your living room to ensure it fits perfectly before renting a truck.
2. **E-Commerce & Online Retail Platforms:** Shopping on Wayfair, IKEA, or a generic furniture site that lacks a native AR feature? Simply grab the product image and dimensions from the description page to visualize it in your home before placing the order.
3. **Interior Designers & Planners:** Snap photos of furniture items in a retail showroom and generate 3D models on the fly to mock up a client's room without needing heavy CAD software.
4. **Antique Enthusiasts:** Found an antique piece without an official 3D file? Take a straight-on photo and generate your own AR model to see if it complements your modern layout.

## 🚀 Technical Stack

*   **Frontend:** React Native (Expo SDK 51)
*   **Backend:** Firebase Cloud Functions (Node 20, 2nd Gen)
*   **AI Engine:** Tripo3D API for advanced Image-to-3D generation.
*   **State Management:** Zustand
*   **Navigation:** Expo Router (File-based routing)

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory by copying the template:
   ```bash
   cp .env.example .env
   ```
   Fill in your own Firebase project configuration, Google client IDs, and backend endpoint URLs.

3. **Start the development server:**
   ```bash
   npx expo start --dev-client --clear
   ```

4. **Set up Backend (Cloud Functions):**
   If you want to run the backend functions locally or deploy them:
   ```bash
   cd functions
   npm install
   ```
   Deploy them to your own Firebase project:
   ```bash
   firebase deploy --only functions
   ```

## 📝 License

This project is licensed under the MIT License.

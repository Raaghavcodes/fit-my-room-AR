# Fit My Room AR — Portfolio Showcase

> [!NOTE]
> **Portfolio Showcase Version:** This repository is a public showcase copy of the *Fit My Room AR* application, intended for review and portfolio demonstration purposes. To protect active 3rd-party API budgets, prevent infrastructure abuse, and protect intellectual property, all proprietary GLB binary scale transformations and API keys have been stubbed or externalized. Consequently, this repository is **not runnable out-of-the-box** without configuring your own private API keys and backend infrastructure.

*Fit My Room AR* is a mobile application built with React Native (Expo) that brings 2D furniture images to life in 3D Augmented Reality. It allows users to instantly visualize how a piece of furniture will look and fit in their actual physical space—before making a purchase.

---

## 🛋️ Core Value Proposition

Furniture-AI bridges the gap between online shopping and physical retail by letting you completely visualize a product in your space. 

1. **Smart E-Commerce Visualization:** Shopping on Wayfair, IKEA, or a generic furniture site that lacks a native AR feature? Users can simply grab the product image and dimensions from the description page to visualize it in their home before placing the order.
2. **Peer-to-Peer Marketplace Helper:** Looking at a couch on Facebook Marketplace or Craigslist? Users can save the picture, plug in the seller's listed dimensions, and project the 3D model right into their living room to ensure it fits perfectly before renting a truck.
3. **Interior Design & Planning:** Designers can snap photos of furniture items in a retail showroom and generate 3D models on the fly to mock up a client's room without needing complex CAD software.
4. **Antique & Custom Creations:** Found a custom or antique piece without an official 3D model? Take a straight-on photo and generate an AR model to see if it complements the modern layout.

---

## 🌟 Key Features

* **Photo to 3D Generation:** Upload a single image of any furniture item. The system utilizes advanced machine learning APIs to automatically generate a high-quality 3D mesh and texture.
* **True-to-Life Scaling:** Calculates the required real-world scale based on input dimensions (width, height, depth). The backend dynamically transforms the generated GLB binary so the AR representation matches real-world sizes exactly.
* **Native AR Integration:** Integrates directly with native device viewers. Utilizes iOS AR Quick Look and Android Scene Viewer, allowing users to physically walk around the item, visualize its footprint, and check if it matches their decor.

---

## 🚀 Technical Stack

* **Frontend:** React Native (Expo SDK 51) using TypeScript
* **State Management:** Zustand for lightweight and fast application state management
* **Navigation:** Expo Router (file-based routing system)
* **Backend:** Firebase Cloud Functions (Node 20, 2nd Gen HTTPS Triggers)
* **AI Engine:** Tripo3D API for Image-to-3D mesh generation
* **AR Rendering:** Native Quick Look integration (iOS) & Scene Viewer fallback (Android)

---

## 📝 License

This project is licensed under the MIT License.

# Furniture-AI: UI Design Specification

This document outlines the core screens, states, and UI components required for the Furniture-AI mobile application. It is designed to be used as a reference when building out the visual interface in design tools like Google Stitch or Figma. 

---

## 1. Global Navigation (Bottom Tab Bar)
Since this is a mobile app, a persistent bottom navigation bar is the best user experience. It should have **3 distinct tabs**:

1.  **Account / Settings (Left):** A user profile icon. Good for managing future login states, settings, or API credits.
2.  **Create / Upload (Center):** Often represented by a prominent "+" or Camera icon. This is the main "Action" tab that routes to the photo capture screen.
3.  **Library / History (Right):** A bookshelf or clock icon. Routes to the grid of previously generated 3D models.

---

## 2. Home / Photo Capture Screen (The "Create" Tab)
**Purpose:** Allow the user to input images of their furniture piece from multiple angles.

*   **Header:** 
    *   App Logo / Brand Title.
    *   **Library/History Button:** An icon (e.g., a clock or book) placed in the top corner to access the user's past generations.
*   **Main Content Area (Photo Inputs):**
    *   A 2x2 Image Grid or Carousel for capturing up to 4 angles:
        *   **Front View (Required):** Highlighted or marked as mandatory.
        *   **Back View (Optional)** 
        *   **Left View (Optional)**
        *   **Right View (Optional)**
    *   **Empty State:** Each slot should have an "Add Photo" / "+" icon placeholder.
    *   **Filled State:** When an image is added, the slot should show the thumbnail and an "X" or "Edit" overlay button to remove/change it.
*   **Action Area (Bottom):**
    *   A prominent **"Next" / "Continue"** button (visually disabled/grayed out until the Front View is provided).

---

## 2. Dimensions & Generation Screen
**Purpose:** Collect physical scaling data and trigger the AI generation pipeline.

*   **Header / Navigation:** 
    *   "Back" button to return to the Photo Capture screen.
*   **Main Content Area:**
    *   **Image Gallery:** A horizontal scrolling list showing the thumbnails of the images collected in the previous step.
    *   **Dimensions Form:** 
        *   Three clean numeric input fields: **Width**, **Height**, and **Depth**.
        *   A toggle button or dropdown for **Units** (Inches vs. Centimeters).
*   **Action Area (Bottom):**
    *   A prominent **"Generate 3D Model"** call-to-action button.
*   **Loading State Overlay (Crucial UI):**
    *   When the "Generate" button is pressed, the UI must transition to a **Loading/Waiting Screen**.
    *   Needs an animated Spinner, Progress Bar, or pulsing 3D cube.
    *   Needs reassuring text (e.g., *"Generating your 3D model... This typically takes 2-3 minutes. Please don't close the app."*)

---

## 3. 3D Model Viewer & AR Screen
**Purpose:** Display the generated 3D object and allow the user to project it into the real world.

*   **Header / Navigation:**
    *   "Home" button to start completely over.
*   **Main Content Area:**
    *   A large **3D Viewport**: An interactive canvas area where the user can pan, zoom, and rotate the generated 3D model with their fingers.
*   **Action Area (Floating Bottom):**
    *   A highly visible, premium-looking **"View in your Space"** (AR) button floating over the 3D canvas. Tapping this triggers the native phone AR camera.

---

## 4. Local Library & History Screen
**Purpose:** A gallery of previously generated models that the user has saved locally to their device, allowing instant AR access without repeating the 3-minute generation wait time.

*   **Header / Navigation:**
    *   "Back" button to return to the Home screen.
    *   Screen Title: "My Library" or "History".
*   **Main Content Area (The Grid):**
    *   A scrolling list or 2-column grid of **"Furniture Cards"**.
    *   **Empty State:** If the library is empty, show a nice illustration and text like *"You haven't generated any furniture yet! Head home to get started."*
*   **Furniture Card Component:**
    *   **Thumbnail:** The "Front View" image originally uploaded for that generation.
    *   **Metadata Tags:** 
        *   The physical dimensions (e.g., *"30 x 40 x 20 in"*).
        *   The timestamp (e.g., *"Today at 2:00 PM"*).
    *   **Interaction:** Tapping the entire card instantly routes the user to the **3D Model Viewer & AR Screen** using the cached 3D file. 
    *   **Options:** A small "Delete" or "Trash" icon in the corner to remove the item from local history.

---

## 5. Account / Settings Screen
**Purpose:** Manage user profile information and app preferences.

*   **Header:**
    *   Screen Title: "Account" or "Settings".
*   **Profile Section:**
    *   Circular Avatar / Profile Picture placeholder.
    *   Display Name.
    *   Email Address or Phone Number.
*   **Preferences Section:**
    *   **Default Units:** A row allowing the user to select their preferred measurement system (Inches vs. Centimeters) so they don't have to select it every time they generate a model.
*   **Support & Info System:**
    *   "Contact Support" or "Send Feedback" button.
    *   "Privacy Policy" & "Terms of Service" links.
    *   "Log out" button  
    *   App Version number displayed lightly at the very bottom.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface": "#f8f9ff",
        "surface-variant": "#d3e4fe",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-tint": "#565e74",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#45464d",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        
        "primary": "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        "primary-fixed": "#dae2fd",
        "on-primary-fixed": "#131b2e",
        "primary-fixed-dim": "#bec6e0",
        "on-primary-fixed-variant": "#3f465c",
        "inverse-primary": "#bec6e0",
        
        "secondary": "#006c49",
        "on-secondary": "#ffffff",
        "secondary-container": "#6cf8bb",
        "on-secondary-container": "#00714d",
        "secondary-fixed": "#6ffbbe",
        "on-secondary-fixed": "#002113",
        "secondary-fixed-dim": "#4edea3",
        "on-secondary-fixed-variant": "#005236",

        "tertiary": "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#191c1e",
        "on-tertiary-container": "#818486",
        "tertiary-fixed": "#e0e3e5",
        "on-tertiary-fixed": "#191c1e",
        "tertiary-fixed-dim": "#c4c7c9",
        "on-tertiary-fixed-variant": "#444749",

        "outline": "#76777d",
        "outline-variant": "#c6c6cd",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      spacing: {
        "container-margin": "20px",
        "stack-gap-lg": "24px",
        "stack-gap-md": "16px",
        "stack-gap-sm": "8px",
        "section-padding": "40px"
      },
      fontFamily: {
        "display-lg": ["System"],
        "headline-md": ["System"],
        "title-sm": ["System"],
        "body-lg": ["System"],
        "body-md": ["System"],
        "label-caps": ["System"]
      }
    }
  },
  plugins: [],
}

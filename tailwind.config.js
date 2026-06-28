/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        onviza: {
          purple: "#9333EA",
          "purple-light": "#A855F7",
          "purple-dark": "#7C3AED",
          bg: "#0A0A0F",
          elevated: "#14141C",
          card: "#1A1A24",
          border: "#2A2A38",
        },
        spotify: {
          green: "#9333EA",
          "green-bright": "#A855F7",
          black: "#000000",
          base: "#0A0A0F",
          elevated: "#14141C",
          highlight: "#1A1A24",
          "text-primary": "#FFFFFF",
          "text-secondary": "#9CA3AF",
          "text-muted": "#6B7280",
        },
      },
    },
  },
  plugins: [],
};

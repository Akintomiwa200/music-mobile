/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1DB954",
          "green-bright": "#1ed760",
          black: "#000000",
          base: "#121212",
          elevated: "#181818",
          highlight: "#282828",
          "text-primary": "#FFFFFF",
          "text-secondary": "#B3B3B3",
          "text-muted": "#727272",
        },
      },
    },
  },
  plugins: [],
};

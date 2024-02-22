/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionProperty: {
        height: "height",
      },
      backgroundImage: {
        "login-background": "url('src/assets/login-bg.jpg')",
      },
      colors: {
        "navy-blue": "#1b1b4a",
        "light-blue": "#2e2e6b",
        "delete-red": "#c42346",
        "light-red": "#cc6a7f",
        "light-grey": "#f5f5f5",
        grey: "#d8d8d8",
        "dark-grey": "#959595",

        text: "#C0C0C0",
        background: "#747272",
        primary: "#7CD3F8",
        secondary: "#0D080C",
        accent: "#0E474E",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

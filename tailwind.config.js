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
      backgroundImage: {
        "login-background": "url('src/assets/login-bg.jpg')",
      },
      colors: {
        "navy-blue": "#1b1b4a",
        "light-blue": "#2e2e6b",
        "delete-red": "#c42346",
        "light-red": "#cc6a7f",
        "light-grey": "#f5f5f5",
        "dark-grey": "#959595",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

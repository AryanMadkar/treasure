/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [    require('daisyui'),
],
  corePlugins:{
    preflight: true, // Disable Tailwind's base styles
  }
};

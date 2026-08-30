/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B64F2",
          hover: "#1451C9",
          light: "#EFF6FF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#1B64F2",
          600: "#1451C9",
          700: "#1E40AF",
        },
        secondary: "#64748B",
        background: "#F4F7FC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        base: "#0F172A",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

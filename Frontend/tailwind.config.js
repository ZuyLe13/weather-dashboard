/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "340px",
      md: "540px",
      lg: "840px",
      xl: "1180px"
    },
    extend: {},
    keyframes: {
      move: {
        "50%": { transform: "translateY(-0.5rem)" }
      },
    },
    animation: {
      movingY: "move 3s linear infinite"
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
        md: '24px'
      }
    }
  },
  plugins: [],
}


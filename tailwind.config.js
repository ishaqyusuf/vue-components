module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // blueGray: colors.blueGray,
        // cyan: colors.cyan,
        // violet: colors.violet,
        // emerald: colors.emerald,
        // primary: colors.purple[700],
        // secondary: "#212223",
        black: {
          100: "#cdd0d6",
          200: "#9ba2ae",
          300: "#687385",
          400: "#36455d",
          500: "#041634",
          600: "#03122a",
          700: "#020d1f",
          800: "#020915",
          900: "#01040a",
        },
      },
    },
  },
  plugins: [],
};

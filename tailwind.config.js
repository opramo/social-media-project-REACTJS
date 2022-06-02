module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        merah: "#A90409",
        putih: "#F0EDE7",
        kuning: "#FFA600",
        biru: "#1F609E",
        hijau: "#3A7D44",
      },
      animation: {
        "spin-share": "spin-share 1s linear",
      },
      keyframes: {
        "spin-share": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(300deg)" },
        },
      },
    },
  },
  plugins: [],
};

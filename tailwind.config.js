/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                beige: "#c9b18e",
                dark: "#1a1a1a",
            },
            fontFamily: {
                serif: ["'Playfair Display'", "serif"],
                sans: ["'Inter'", "sans-serif"],
            },
            boxShadow: {
                card: "0 10px 20px rgba(0,0,0,0.08)",
            },
        },
    },
    plugins: [],
};

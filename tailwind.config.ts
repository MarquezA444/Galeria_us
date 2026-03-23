import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        quartz: '#F8C8DC',
        romantic: {
          50: '#fdf8f9',
          100: '#faeff1',
          200: '#f4dce1',
          300: '#ebbdc7',
          400: '#de95a5',
          500: '#cd6e83',
          600: '#b44e64',
          700: '#973c50',
          800: '#7e3445',
          900: '#6b2f3d',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.65)',
          whiteLight: 'rgba(255, 255, 255, 0.4)',
          border: 'rgba(255, 255, 255, 0.45)'
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

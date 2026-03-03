import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#FF6600',
        'gray-light': '#F5F5F5',
        'gray-medium': '#CCCCCC',
        'gray-dark': '#666666',
        green: '#00C853',
        red: '#FF3D00',
        blue: '#2196F3',
        yellow: '#FFC107',
        'bg-dark': '#0a0a0a',
        'bg-medium': '#1a1a1a',
        'bg-card': '#222222',
      },
      borderRadius: {
        'custom': '12px',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
    },
  },
  plugins: [],
};

export default config;

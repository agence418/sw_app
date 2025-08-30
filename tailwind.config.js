/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
 ],
 theme: {
  extend: {
   colors: {
    primary: {
     50: '#eff6ff',
     500: '#3b82f6',
     600: '#2563eb',
     700: '#1d4ed8',
    },
    green: {
     400: '#439642',
     600: '#439642'
    },
    red: {
     600: '#BD2738'
    }
   },
   screens: {
    'xs': '375px',
   }
  },
 },
 plugins: [],
}
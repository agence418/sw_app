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
    blue: {
     600: '#27A8E0'
    },
    green: {
     400: '#50C43C',
     600: '#439642'
    },
    red: {
     600: '#BD2738'
    },
    purple: {
     500: '#4C19AF',
     600: '#4C19AF'
    }
   },
   orange: {
    600: '#EE6F2D',
   },
   screens: {
    'xs': '375px',
   }
  },
 },
 plugins: [],
}
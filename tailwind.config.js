/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Obsidian Dark Color System
        surface: {
          primary: '#0B1426',     // Obsidian black - main background
          secondary: '#1E2328',   // Soft dark grey - card backgrounds
          tertiary: '#2A2D3A',    // Medium grey - elevated elements
          interactive: '#363A47', // Lighter grey - hover states
          overlay: '#424651',     // Modal overlays
        },
        // Border Colors
        border: {
          DEFAULT: '#2A2D3A',     // Main borders
          secondary: '#363A47',   // Subtle borders
          focus: '#4F9CF9',       // Bright blue focus rings
          accent: '#22D3EE',      // Cyan accent borders
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',     // Pure white - primary text
          secondary: '#E2E4E7',   // Off-white - secondary text
          tertiary: '#B8BCC8',    // Light grey - muted text
          placeholder: '#6B7280', // Medium grey - placeholders
          inverse: '#0B1426',     // Obsidian - text on light backgrounds
        },
        // Accent Colors
        accent: {
          primary: '#4F9CF9',     // Bright blue
          secondary: '#22D3EE',   // Cyan
          tertiary: '#A855F7',    // Purple
          warning: '#FBBF24',     // Warm amber
          error: '#F87171',       // Coral red
          success: '#34D399',     // Emerald green
        },
        // Blue Color Scale
        blue: {
          400: '#60A5FA',
          500: '#4F9CF9',
          600: '#3B82F6',
          700: '#2563EB',
        },
        // Interactive States
        interactive: {
          primary: '#4F9CF9',
          'primary-hover': '#3B82F6',
          secondary: '#2A2D3A',
          'secondary-hover': '#363A47',
        },
        // Obsidian Greys
        obsidian: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          850: '#1E2328',
          900: '#0F172A',
          950: '#0B1426',
        },
        // Tailwind defaults mapping
        background: '#0B1426',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#4F9CF9',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#22D3EE',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#F87171',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#B8BCC8',
        },
        'muted-foreground': '#B8BCC8',
        accent: {
          DEFAULT: '#22D3EE',
          foreground: '#FFFFFF',
        },
        input: 'rgba(255, 255, 255, 0.1)',
        ring: '#4F9CF9',
      },
      spacing: {
        // Design system spacing
        '1': '0.5rem',   // 8px
        '2': '1rem',     // 16px
        '3': '1.5rem',   // 24px
        '4': '2rem',     // 32px
        '6': '3rem',     // 48px
        '8': '4rem',     // 64px
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'tooltip': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        blob: "blob 7s infinite",
        'fade-slide-in': 'fadeSlideIn 0.6s ease-out forwards',
        'slide-right-in': 'slideRightIn 0.8s ease-out forwards',
        'testimonial-in': 'testimonialIn 0.8s ease-out forwards',
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        fadeSlideIn: {
          "0%": {
            opacity: 0,
            filter: "blur(4px)",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateY(0px)",
          },
        },
        slideRightIn: {
          "0%": {
            opacity: 0,
            filter: "blur(4px)",
            transform: "translateX(40px)",
          },
          "100%": {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateX(0px)",
          },
        },
        testimonialIn: {
          "0%": {
            opacity: 0,
            filter: "blur(4px)",
            transform: "translateY(20px) scale(0.95)",
          },
          "100%": {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateY(0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
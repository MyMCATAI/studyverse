import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core theme colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        
        // Component colors
        "border-color": "var(--border-color)",
        "border-light": "var(--border-light)",
        "hover-color": "var(--hover-color)",
        "hover-text": "var(--hover-text)",
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-light": "#edf0ff",
        "sidebar-dark": "#081b54",
        "card-bg": "var(--card-bg)",
        "card-accent": "var(--card-accent)",
        
        // Nav/Button colors
        "nav-bg": "var(--nav-bg)",
        "nav-text": "var(--nav-text)",
        "button-bg": "var(--button-bg)",
        "button-text": "var(--button-text)",
        "button-hover-bg": "var(--button-hover-bg)",
        "button-hover-text": "var(--button-hover-text)",
        "button-active-bg": "var(--button-active-bg)",
        "button-active-text": "var(--button-active-text)",
        
        // Text colors
        "text-color": "var(--text-color)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "emphasis-color": "var(--emphasis-color)",
        
        // Theme specific colors
        "theme-leaguecard-color": "var(--theme-leaguecard-color)",
        "theme-leaguecard-accent": "var(--theme-leaguecard-accent)",
        "theme-border-color": "var(--theme-border-color)",
        "theme-hover-color": "var(--theme-hover-color)",
        "theme-hover-text": "var(--theme-hover-text)",
        "theme-text-color": "var(--theme-text-color)",
        "theme-emphasis-color": "var(--theme-emphasis-color)",
        "theme-button-color": "var(--theme-button-color)",
        "theme-mainbox-color": "var(--theme-mainbox-color)",
        "theme-doctorsoffice-accent": "var(--theme-doctorsoffice-accent)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "button": "var(--theme-button-boxShadow)",
        "button-hover": "var(--theme-button-boxShadow-hover)",
        "tutoring": "var(--theme-adaptive-tutoring-boxShadow)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-color)',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h1: {
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '1.5em',
              marginBottom: '0.8em',
            },
            h2: {
              color: 'var(--primary)',
              fontWeight: '600',
              fontSize: '1.75rem',
              marginTop: '1.5em',
              marginBottom: '0.8em',
            },
            h3: {
              color: 'var(--text-color)',
              fontWeight: '600',
              fontSize: '1.4rem',
              marginTop: '1.5em',
              marginBottom: '0.8em',
            },
            strong: {
              color: 'var(--emphasis-color)',
              fontWeight: '600',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: 'var(--primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--accent)',
              },
            },
            code: {
              color: 'var(--accent)',
              backgroundColor: 'var(--card-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.9em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config; 
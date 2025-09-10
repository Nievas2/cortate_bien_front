import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tailwindcss from "@tailwindcss/vite"
import type { VitePWAOptions } from "vite-plugin-pwa"

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  workbox: {
    navigateFallback: "/index.html",
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}"],
    // Cachear más agresivamente
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
          }
        }
      }
    ]
  },
  manifest: {
    name: "Cortate bien",
    short_name: "Cortate bien",
    description: "Sacá turnos sin vueltas, encontrá barberías cerca tuyo y gestioná tu negocio de forma fácil, rápida.",
    lang: "es-AR",
    screenshots: [
      {
        src: "/screenshot/screenshot.png",
        sizes: "1360x768",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshot/mobile-screenshot.png", // Añadir screenshot móvil
        sizes: "390x844",
        type: "image/png", 
        form_factor: "narrow"
      }
    ],
    icons: [
      {
        src: "/192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/512x512.png",
        sizes: "512x512", 
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/180x180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/512x512.png",
        sizes: "512x512",
        type: "image/png", 
        purpose: "maskable"
      }
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    categories: ["business", "lifestyle"],
    shortcuts: [
      {
        name: "Buscar barbería",
        short_name: "Buscar",
        description: "Encuentra barberías cerca tuyo",
        url: "/search",
        icons: [{ src: "/192x192.png", sizes: "192x192" }]
      }
    ]
  },
  devOptions: {
    enabled: true // Habilitar en desarrollo
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(manifestForPlugIn)],
  server: {
    host: '0.0.0.0', // Permitir conexiones externas
    port: 5173
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
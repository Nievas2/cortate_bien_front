import React, { useRef } from "react";

interface BackgroundProps {
  children?: React.ReactNode;
}
export const Background = ({ children }: BackgroundProps) => {
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={mainRef}
      className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden"
      style={{
        background: `
            radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a8a 75%, #0f172a 100%)
          `,
      }}
    >
      {/* Elementos flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Elementos geométricos flotantes */}
        <div
          ref={(el) => (floatingElementsRef.current[0] = el)}
          className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[1] = el)}
          className="absolute top-40 right-20 w-6 h-6 bg-blue-500/20 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute bottom-40 left-20 w-8 h-8 bg-blue-300/25 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[3] = el)}
          className="absolute bottom-20 right-10 w-3 h-3 bg-blue-600/30 rounded-full blur-sm"
        />

        {/* Líneas de conexión */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M100,200 Q300,100 500,300 T900,200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M200,400 Q600,300 800,500"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Grid de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
              linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px)
            `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative w-full h-full">{children}</div>
    </main>
  );
};

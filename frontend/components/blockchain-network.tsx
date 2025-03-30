"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

export default function BlockchainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawNetwork();
    };

    // Draw the network
    const drawNetwork = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;

      // Draw hands in background (simplified)
      drawHands(ctx, canvas.width, canvas.height);

      // Draw dot pattern
      drawDotPattern(ctx, canvas.width, canvas.height);
    };

    const drawHands = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#222";

      // Left hand silhouette (simplified)
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.5);
      ctx.quadraticCurveTo(
        width * 0.2,
        height * 0.3,
        width * 0.4,
        height * 0.4
      );
      ctx.quadraticCurveTo(
        width * 0.5,
        height * 0.5,
        width * 0.4,
        height * 0.7
      );
      ctx.quadraticCurveTo(
        width * 0.2,
        height * 0.8,
        width * 0.1,
        height * 0.6
      );
      ctx.fill();

      // Right hand silhouette (simplified)
      ctx.beginPath();
      ctx.moveTo(width * 0.9, height * 0.5);
      ctx.quadraticCurveTo(
        width * 0.8,
        height * 0.3,
        width * 0.6,
        height * 0.4
      );
      ctx.quadraticCurveTo(
        width * 0.5,
        height * 0.5,
        width * 0.6,
        height * 0.7
      );
      ctx.quadraticCurveTo(
        width * 0.8,
        height * 0.8,
        width * 0.9,
        height * 0.6
      );
      ctx.fill();

      ctx.restore();
    };

    const drawDotPattern = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.1;

      const spacing = 20;
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          // Only draw dots in certain areas to match the pattern
          if ((x + y) % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    };

    // Initial setup
    setCanvasDimensions();

    // Handle resize
    window.addEventListener("resize", setCanvasDimensions);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background canvas for patterns and connecting lines */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Blockchain network */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12 max-w-4xl">
          {/* Top row */}
          <div className="flex justify-center">
            <IsometricBlock icon="medical" />
          </div>
          <div className="flex justify-center">
            <IsometricBlock icon="education" />
          </div>
          <div className="flex justify-center">
            <IsometricBlock icon="paw" />
          </div>

          {/* Center - Explore button */}
          <div className="col-span-3 flex justify-center my-4 md:my-6">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 py-2 flex items-center gap-1 text-white">
              Explore FundChain <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom row */}
          <div className="flex justify-center">
            <IsometricBlock icon="building" />
          </div>
          <div className="flex justify-center">
            <IsometricBlock icon="bell" />
          </div>
          <div className="flex justify-center">
            <IsometricBlock icon="person" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Isometric block component with different icons
function IsometricBlock({
  icon,
}: {
  icon: "medical" | "education" | "paw" | "building" | "bell" | "person";
}) {
  return (
    <div className="relative">
      {/* Isometric cube */}
      <svg width="80" height="80" viewBox="0 0 80 80" className="block">
        {/* Cube */}
        <g transform="translate(10, 10)">
          {/* Top face */}
          <polygon
            points="30,0 60,15 30,30 0,15"
            fill="#333"
            stroke="#444"
            strokeWidth="1"
          />

          {/* Right face */}
          <polygon
            points="60,15 60,45 30,60 30,30"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />

          {/* Left face */}
          <polygon
            points="0,15 0,45 30,60 30,30"
            fill="#1a1a1a"
            stroke="#444"
            strokeWidth="1"
          />

          {/* Connecting lines */}
          <line x1="0" y1="30" x2="-10" y2="35" stroke="#444" strokeWidth="1" />
          <line x1="60" y1="30" x2="70" y2="35" stroke="#444" strokeWidth="1" />
        </g>
      </svg>

      {/* Icon on top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-12 h-12 flex items-center justify-center">
        {icon === "medical" && (
          <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M9 3v6H3v6h6v6h6v-6h6V9h-6V3H9z" fill="#000" />
            </svg>
          </div>
        )}

        {icon === "education" && (
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#fff" />
              <path d="M9 16.5v4.25L12 22l3-1.25V16.5L12 18z" fill="#fff" />
            </svg>
          </div>
        )}

        {icon === "paw" && (
          <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path
                d="M8.5 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                fill="#000"
              />
              <path
                d="M15.5 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                fill="#000"
              />
              <path d="M6 19a2 2 0 100-4 2 2 0 000 4z" fill="#000" />
              <path d="M12 19a2 2 0 100-4 2 2 0 000 4z" fill="#000" />
              <path d="M18 19a2 2 0 100-4 2 2 0 000 4z" fill="#000" />
            </svg>
          </div>
        )}

        {icon === "building" && (
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10">
              <path
                d="M1 21h10V7H1v14zm2-12h2v2H3V9zm0 4h2v2H3v-2zm0 4h2v2H3v-2zm4-8h2v2H7V9zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"
                fill="#fff"
              />
              <path
                d="M13 21h10v-6H13v6zm2-4h2v2h-2v-2zm4 0h2v2h-2v-2z"
                fill="#fff"
              />
              <path
                d="M13 7h10V1H13v6zm2-4h2v2h-2V3zm4 0h2v2h-2V3z"
                fill="#fff"
              />
            </svg>
          </div>
        )}

        {icon === "bell" && (
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10">
              <path
                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                fill="#fff"
              />
            </svg>
          </div>
        )}

        {icon === "person" && (
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                fill="#fff"
              />
              <path
                d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#fff"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  let nt = 0;  // nt needs to be outside so that it keeps progressing

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    ctx.filter = `blur(${blur}px)`;
    animate(ctx);
  };

  const drawWave = (ctx: CanvasRenderingContext2D, n: number) => {
    const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
    const { width: w, height: h } = dimensions;

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];

      for (let x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);  // Adjust for the height (50% of container)
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    const { width: w, height: h } = dimensions;

    // Clear the canvas first
    ctx.clearRect(0, 0, w, h);

    // Fill the background (no opacity applied here)
    ctx.fillStyle = backgroundFill || "black";
    ctx.fillRect(0, 0, w, h);

    // Adjust wave opacity here and draw the waves
    ctx.globalAlpha = waveOpacity;
    drawWave(ctx, 5);

    // Update nt for the next frame to create the animation
    nt += getSpeed();
    requestAnimationFrame(() => animate(ctx));
  };

  // Handle window resizing and update the dimensions
  const handleResize = () => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const resizeListener = () => {
      handleResize();
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      initCanvas();  // Initialize canvas whenever the dimensions change
    }
  }, [dimensions]);

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute top-20 z-0"
        style={{ width: "100%", height: "100%" }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

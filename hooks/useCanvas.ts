import { CanvasPixel } from "@/types/CanvasPixel";
import { useEffect, useRef, useState } from "react";

export const useCanvas = (width: number, height: number, scale = 1) => {
  const [canvasContext, setCanvasContext] = useState(
    null as CanvasRenderingContext2D | null
  );
  const [mirrorContext, setMirrorContext] = useState(
    null as CanvasRenderingContext2D | null
  );
  const canvasRef = useRef(null as HTMLCanvasElement | null);
  const mirrorRef = useRef(null as HTMLCanvasElement | null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext("2d");

    if (!context) {
      return;
    }

    setCanvasContext(context);

    // blank the canvas
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    const mirrorContext = mirrorRef?.current?.getContext("2d");

    if (!mirrorContext) {
      return;
    }

    setMirrorContext(mirrorContext);

    // blank the canvas
    mirrorContext.fillStyle = "#ffffff";
    mirrorContext.fillRect(0, 0, width, height);
  }, [width, height]);

  const flushCanvas = () => {
    if (!canvasContext) {
      console.error("Canvas context not available");
      return;
    }

    // blank the canvas
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(0, 0, width, height);

    if (!mirrorContext) {
      return;
    }

    // blank the canvas
    mirrorContext.fillStyle = "#ffffff";
    mirrorContext.fillRect(0, 0, width, height);
  };

  const drawToCanvas = (pixels: CanvasPixel[]) => {
    if (!canvasContext) {
      console.error("Canvas context not available");
      return;
    }

    for (let pixel of pixels) {
      canvasContext.fillStyle = pixel.color;
      canvasContext.fillRect(pixel.x * scale, pixel.y * scale, scale, scale);

      if (mirrorContext) {
        mirrorContext.fillStyle = pixel.color;
        mirrorContext.fillRect(pixel.x * scale, pixel.y * scale, scale, scale);
      }
    }
  };

  return {
    canvasRef,
    canvasContext,
    mirrorRef,
    flushCanvas,
    drawToCanvas,
  };
};

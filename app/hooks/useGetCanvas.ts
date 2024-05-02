import { PIXELS_PER_ROW } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import { useEffect } from "react";

const NUM_ROWS = PIXELS_PER_ROW;

export const useGetCanvas = (setPixels: (x: CanvasPixel[]) => void) => {
    useEffect(() => {
      let canvasPixels = new Array(NUM_ROWS * PIXELS_PER_ROW)
        .fill({})
        .map((_, index) => ({
          x: index % PIXELS_PER_ROW,
          y: Math.floor(index / PIXELS_PER_ROW),
          color: "#ffffff",
        }));
  
        fetch("/api/canvas").then(async (res) => {
          for (let pixel of await res.json()) {
            canvasPixels[pixel.y * PIXELS_PER_ROW + pixel.x] = {
              id: pixel.id,
              x: pixel.x,
              y: pixel.y,
              color: pixel.color,
            } as CanvasPixel;
          }
          setPixels(canvasPixels);
        })
      }, [setPixels])
  }
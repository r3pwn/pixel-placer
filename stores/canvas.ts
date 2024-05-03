import { create } from "zustand";
import { CanvasPixel } from "@/types/CanvasPixel";
import { PIXELS_PER_ROW } from "@/constants";

const NUM_ROWS = PIXELS_PER_ROW;

interface CanvasStore {
  pixels: CanvasPixel[];
  flushCanvas: () => void;
  drawToCanvas: (drawPixels: CanvasPixel[]) => void;
}

const blankCanvas = () =>
  new Array(NUM_ROWS * PIXELS_PER_ROW).fill({}).map((_, index) => ({
    x: index % PIXELS_PER_ROW,
    y: Math.floor(index / PIXELS_PER_ROW),
    color: "#ffffff",
  }));

export const useCanvasStore = create<CanvasStore>((set) => ({
  pixels: blankCanvas(),
  flushCanvas: () => set(() => ({ pixels: blankCanvas() })),
  drawToCanvas: (drawPixels) => {
    set((state) => {
      const canvasCopy = [...state.pixels];
      for (let pixel of drawPixels) {
        canvasCopy[pixel.y * PIXELS_PER_ROW + pixel.x] = {
          id: pixel.id,
          x: pixel.x,
          y: pixel.y,
          color: pixel.color,
        } as CanvasPixel;
      }

      return {
        pixels: canvasCopy,
      };
    });
  },
}));

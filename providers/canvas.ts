import { CanvasPixel } from "@/types/CanvasPixel";

type PixelUpdateResponse = {
  id: string;
  nextPixelIn: number;
};

export const getCanvasPixels = async () => {
  const result = await fetch("/api/canvas");
  return (await result.json()) as CanvasPixel[];
};

export const getCanvasDelta = async (from: string) => {
  const result = await fetch(`/api/canvas?from=${from}`);
  return (await result.json()) as CanvasPixel[];
};

export const putCanvasPixel = async (pixel: CanvasPixel) => {
  const result = await fetch("/api/canvas", {
    method: "POST",
    body: JSON.stringify(pixel),
  });
  return (await result.json()) as PixelUpdateResponse;
};

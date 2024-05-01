"use client";
import { useEffect, useState } from "react";
import Pixel from "./Pixel";

const NUM_ROWS = 10;
const PIXELS_PER_ROW = 10;

type Props = {
  readonly?: boolean;
};

type CanvasPixel = {
  x: number;
  y: number;
  color: string;
};

export default function Canvas({ readonly }: Props) {
  const [pixels, setPixels] = useState([] as CanvasPixel[]);
  const [currentColor, setCurrentColor] = useState("#eb4034");

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
          x: pixel.x,
          y: pixel.y,
          color: pixel.color,
        };
      }
      setPixels(canvasPixels);
    });
  }, []);

  const handleClick = (pixel: CanvasPixel) => {
    if (readonly) {
      return;
    }

    fetch("/api/canvas", {
      method: "PUT",
      body: JSON.stringify({
        x: pixel.x,
        y: pixel.y,
        color: currentColor,
      }),
    }).then(() => {
      setPixels(
        pixels.map((value) => {
          if (value.x === pixel.x && value.y === pixel.y) {
            return {
              x: pixel.x,
              y: pixel.y,
              color: currentColor,
            };
          }
          return value;
        })
      );
    });
  };

  return (
    <ul
      className="canvas"
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(10, 1fr)",
      }}
    >
      {pixels.map((pixel, index) => (
        <li key={index}>
          <Pixel
            color={pixel.color}
            onClick={() => {
              handleClick(pixel);
            }}
          />
        </li>
      ))}
    </ul>
  );
}

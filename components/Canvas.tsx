"use client";
import { useEffect, useState } from "react";
import { PIXELS_PER_ROW } from "@/constants";
import Pixel from "./Pixel";

// assuming a square canvas
const NUM_ROWS = PIXELS_PER_ROW;

const COLOR_OPTIONS = ["#eb4034", "#8709db", "#eff702", "#ffffff", "#000000"];

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
  const [currentColor, setCurrentColor] = useState(COLOR_OPTIONS[0]);

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
    <>
      {!readonly && (
        <div className="color-options">
          {COLOR_OPTIONS.map((color) => (
            <input
              key={color}
              name="color_option"
              value={color}
              checked={color === currentColor}
              type="radio"
              style={{
                width: 20,
                height: 20,
                accentColor: color,
                borderRadius: "100%",
              }}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
          ))}
        </div>
      )}
      <ul
        className="canvas"
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${PIXELS_PER_ROW}, 1fr)`,
          gridTemplateRows: `repeat(${NUM_ROWS}, 1fr)`,
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
    </>
  );
}

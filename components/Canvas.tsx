"use client";
import { useState } from "react";
import { PIXELS_PER_ROW } from "@/constants";
import Pixel from "./Pixel";
import { CanvasPixel } from "@/types/CanvasPixel";
import { useGetCanvas } from "@/app/hooks/useGetCanvas";

// assuming a square canvas
const NUM_ROWS = PIXELS_PER_ROW;

const COLOR_OPTIONS = ["#eb4034", "#8709db", "#eff702", "#ffffff", "#000000"];
let apiBuffer: NodeJS.Timeout;

type Props = {
  readonly?: boolean;
};



const setCanvasPixels = (setPixels: (x: CanvasPixel[]) => void, pixel: CanvasPixel, pixels: CanvasPixel[], currentColor: string): void => {
  // Locally set the pixels first
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
  clearTimeout(apiBuffer);
  // Create a buffer time so we do not spam the API
  apiBuffer = setTimeout(() => {
    fetch("/api/canvas", {
      method: "POST",
      body: JSON.stringify({
        ...pixel,
        color: currentColor,
      }),
    }).then(async (result) => {
      let res = await result.json();
      // Update the pixels once we get an API response
      setPixels(
        pixels.map((value) => {
          if (value.x === pixel.x && value.y === pixel.y) {
            return {
              id: res.id,
              x: pixel.x,
              y: pixel.y,
              color: currentColor,
            };
          }
          return value;
        })
      );
    });
  } , 1000)
}

export default function Canvas({ readonly }: Props) {
  const [pixels, setPixels] = useState([] as CanvasPixel[]);
  const [currentColor, setCurrentColor] = useState(COLOR_OPTIONS[0]);

  useGetCanvas(setPixels);
  const handleDrag = (event: any, pixel: CanvasPixel) => {
    if (readonly) {
      return;
    }
    if (currentColor === pixel.color) {
      return;
    }
    // We can take advantage of W3C rules for MouseEvents which dictate that buttons === 1 is a primary mouse click
    if(event["buttons"] != 1) {
      return;
    }
    setCanvasPixels(setPixels, pixel, pixels, currentColor)
  }

  const handleClick = (pixel: CanvasPixel) => {
    if (readonly) {
      return;
    }
    if (currentColor === pixel.color) {
      return;
    }
    setCanvasPixels(setPixels, pixel, pixels, currentColor)
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
              onDrag={(e: any) => {
                handleDrag(e, pixel)
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

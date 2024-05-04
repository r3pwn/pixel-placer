"use client";
import { useEffect } from "react";
import { PIXELS_PER_ROW } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import { useCanvasStore } from "@/stores/canvas";
import { getCanvasPixels, putCanvasPixel } from "@/providers/canvas";
import { useColorStore } from "@/stores/color";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { CanvasControls } from "./CanvasControls";
import Pixel from "./Pixel";

// assuming a square canvas
const NUM_ROWS = PIXELS_PER_ROW;

type Props = {
  readonly?: boolean;
};

export default function Canvas({ readonly }: Props) {
  const { currentColor, addPastColor } = useColorStore();
  const { pixels, flushCanvas, drawToCanvas } = useCanvasStore();

  useEffect(() => {
    flushCanvas();

    getCanvasPixels().then(drawToCanvas);
  }, [drawToCanvas, flushCanvas]);

  /*
   * sets a pixel locally, then updates the store with
   * the ID after the API call completes
   */
  const eagerDraw = (pixel: CanvasPixel) => {
    const newPixel = { ...pixel, color: currentColor };
    drawToCanvas([newPixel]);
    putCanvasPixel(newPixel).then((result) => {
      drawToCanvas([
        {
          ...newPixel,
          ...result,
        },
      ]);
    });
  };

  const handlePixelSubmit = (pixel: CanvasPixel) => {
    if (readonly) {
      return;
    }
    if (currentColor === pixel.color) {
      return;
    }
    eagerDraw(pixel);
    addPastColor(currentColor);
  };

  return (
    <TransformWrapper>
      {(utils) => (
        <div>
          <CanvasControls {...utils} />
          <TransformComponent
            wrapperStyle={{ width: "100vw", height: "100vh" }}
          >
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
                    readonly={readonly}
                    onSubmit={() => {
                      handlePixelSubmit(pixel);
                    }}
                  />
                </li>
              ))}
            </ul>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}

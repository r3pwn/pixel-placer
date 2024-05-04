"use client";
import { useEffect, useRef, useState } from "react";
import { PIXELS_PER_ROW, CANVAS_PX_SCALE } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import { getCanvasPixels, putCanvasPixel } from "@/providers/canvas";
import { useColorStore } from "@/stores/color";
import {
  TransformWrapper,
  TransformComponent,
  MiniMap,
} from "react-zoom-pan-pinch";
import { CanvasControls } from "./CanvasControls";
import { useCanvas } from "@/hooks/useCanvas";
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import Pixel from "./Pixel";

// assuming a square canvas
const NUM_ROWS = PIXELS_PER_ROW;

const CANVAS_WIDTH = PIXELS_PER_ROW * CANVAS_PX_SCALE;
const CANVAS_HEIGHT = NUM_ROWS * CANVAS_PX_SCALE;

type Props = {
  readonly?: boolean;
};

export default function Canvas({ readonly }: Props) {
  const [hoverPixel, setHoverPixel] = useState(
    undefined as CanvasPixel | undefined
  );
  const { currentColor, addPastColor } = useColorStore();
  const { canvasRef, canvasContext, mirrorRef, drawToCanvas } = useCanvas(
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_PX_SCALE
  );

  useEffect(() => {
    if (!canvasContext) {
      return;
    }
    getCanvasPixels().then(drawToCanvas);
  }, [canvasContext]);

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

    /*
     * sets a pixel locally, then updates the store with
     * the ID after the API call completes
     */
    const eagerDraw = (pixel: CanvasPixel) => {
      const newPixel = { ...pixel, color: currentColor };
      drawToCanvas([newPixel]);
      putCanvasPixel(newPixel);
    };

    const canvas = canvasRef.current;

    const clickHandler = (e: MouseEvent) => {
      if (readonly) {
        return;
      }

      const clickedX = Math.floor(e.offsetX / CANVAS_PX_SCALE);
      const clickedY = Math.floor(e.offsetY / CANVAS_PX_SCALE);

      eagerDraw({ x: clickedX, y: clickedY, color: currentColor });
      addPastColor(currentColor);
    };

    const hoverHandler = (e: MouseEvent) => {
      const hoverX = Math.floor(e.offsetX / CANVAS_PX_SCALE);
      const hoverY = Math.floor(e.offsetY / CANVAS_PX_SCALE);

      if (hoverPixel?.x === hoverX && hoverPixel?.y === hoverY) {
        return;
      }
      setHoverPixel({ x: hoverX, y: hoverY, color: "#ffffff" });
    };

    canvas?.addEventListener("click", clickHandler);
    canvas?.addEventListener("mousemove", hoverHandler);

    return () => {
      canvas?.removeEventListener("click", clickHandler);
      canvas?.removeEventListener("mousemove", hoverHandler);
    };
  }, [readonly, canvasContext, canvasRef, currentColor, hoverPixel]);

  return (
    <TransformWrapper>
      {(utils) => (
        <div>
          <CanvasControls {...utils} />
          <div
            style={{
              position: "fixed",
              zIndex: 5,
              top: "50px",
              right: "50px",
            }}
          >
            <MiniMap>
              <canvas
                ref={mirrorRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
            </MiniMap>
          </div>
          <TransformComponent
            wrapperStyle={{ width: "100vw", height: "100vh" }}
          >
            <Popover
              className="relative"
              style={{
                ...(!!hoverPixel && {
                  top: hoverPixel.y * CANVAS_PX_SCALE,
                  left: hoverPixel.x * CANVAS_PX_SCALE,
                }),
              }}
            >
              <Float
                autoPlacement={{
                  alignment: "start",
                }}
              >
                <Popover.Button
                  as="div"
                  className={`canvas-pixel hover:scale-110 hover:outline-1 hover:outline hover:relative hover:z-10 hover:shadow-lg outline-offset-[-1px] ui-open:scale-110 ui-open:outline-1 ui-open:outline ui-open:relative ui-open:z-10 ui-open:shadow-lg`}
                  style={{
                    position: "absolute",
                    width: CANVAS_PX_SCALE,
                    height: CANVAS_PX_SCALE,
                    backgroundColor: "transparent",
                    outlineColor: "#ffffff",
                    zIndex: 10,
                  }}
                />
                <Popover.Panel
                  className={
                    "absolute z-10 bg-zinc-800 p-2 rounded-md shadow-md flex flex-col"
                  }
                >
                  <h2>panel</h2>
                </Popover.Panel>
              </Float>
            </Popover>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}

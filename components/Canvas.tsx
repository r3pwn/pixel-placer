"use client";
import { useEffect, useMemo, useState } from "react";
import { PIXELS_PER_ROW, CANVAS_PX_SCALE } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import { getCanvasPixels, putCanvasPixel } from "@/providers/canvas";
import { useColorStore } from "@/stores/color";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { CanvasControls } from "./CanvasControls";
import { useCanvas } from "@/hooks/useCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { rgbToHex } from "@/lib/utils";
import { Button } from "./ui/button";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";
import Color from "color";

// assuming a square canvas
const NUM_ROWS = PIXELS_PER_ROW;

const CANVAS_WIDTH = PIXELS_PER_ROW * CANVAS_PX_SCALE;
const CANVAS_HEIGHT = NUM_ROWS * CANVAS_PX_SCALE;

type Props = {
  isLoggedIn: boolean;
  authUrl: string;
};

export default function Canvas({ isLoggedIn, authUrl }: Props) {
  const [activePixel, setActivePixel] = useState(
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
      const clickedX = Math.floor(e.offsetX / CANVAS_PX_SCALE);
      const clickedY = Math.floor(e.offsetY / CANVAS_PX_SCALE);

      const midpointX = clickedX * CANVAS_PX_SCALE + 0.5 * CANVAS_PX_SCALE;
      const midpointY = clickedY * CANVAS_PX_SCALE + 0.5 * CANVAS_PX_SCALE;

      const pixelData = canvasContext.getImageData(
        midpointX,
        midpointY,
        1,
        1
      ).data;

      setActivePixel({
        x: clickedX,
        y: clickedY,
        color: rgbToHex(pixelData[0], pixelData[1], pixelData[2]),
      });
    };

    canvas?.addEventListener("click", clickHandler);

    return () => {
      canvas?.removeEventListener("click", clickHandler);
    };
  }, [canvasContext, canvasRef, currentColor, activePixel]);

  const activeOutline = useMemo(() => {
    const colorObject = Color(activePixel?.color);
    if (colorObject.black() >= 90) {
      return Color.rgb(150, 150, 150);
    } else if (colorObject.black() >= 50) {
      return colorObject.lighten(1);
    }
    return colorObject.isDark()
      ? colorObject.lighten(0.25)
      : colorObject.darken(0.25);
  }, [activePixel]);

  return (
    <TransformWrapper initialScale={2} minScale={0.5}>
      {(utils) => (
        <div>
          <CanvasControls {...utils} />
          <TransformComponent
            wrapperStyle={{
              width: "100vw",
              height: "100vh",
            }}
          >
            {activePixel && (
              <div
                className="canvas-pixel absolute outline outline-2 outline-offset-[-1px] shadow-xl"
                style={{
                  backgroundColor: "transparent",
                  width: CANVAS_PX_SCALE,
                  height: CANVAS_PX_SCALE,
                  outlineColor: activeOutline.toString(),
                  top: activePixel.y * CANVAS_PX_SCALE,
                  left: activePixel.x * CANVAS_PX_SCALE,
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />
          </TransformComponent>
          {activePixel && (
            <Card
              style={{
                position: "fixed",
                zIndex: 5,
                bottom: "1rem",
                left: "1rem",
              }}
            >
              <CardHeader>
                <CardTitle>
                  ({activePixel.x}, {activePixel.y})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3 items-center">
                <div
                  style={{
                    backgroundColor: activePixel.color,
                    height: "2rem",
                    width: "2rem",
                    borderRadius: "50%",
                    border: "2px solid white",
                    outline: "2px solid black",
                    outlineOffset: "1px",
                  }}
                ></div>
                {!isLoggedIn && (
                  <Link href={authUrl}>
                    <Button>Log in to update</Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <Button
                    size="icon"
                    type="button"
                    onClick={() =>
                      console.log("not yet implemented. coming soon")
                    }
                  >
                    <MdOutlineEdit />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </TransformWrapper>
  );
}

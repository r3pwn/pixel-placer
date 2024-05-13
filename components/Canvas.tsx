"use client";
import { useEffect, useMemo, useState } from "react";
import { PIXELS_PER_ROW, CANVAS_PX_SCALE } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import {
  getCanvasDelta,
  getCanvasPixels,
  putCanvasPixel,
} from "@/providers/canvas";
import { useColorStore } from "@/stores/color";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { CanvasControls } from "./CanvasControls";
import { useCanvas } from "@/hooks/useCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { rgbToHex } from "@/lib/utils";
import { Button } from "./ui/button";
import { MdOutlineEdit } from "react-icons/md";
import { GiToken } from "react-icons/gi";
import Link from "next/link";
import Color from "color";
import ColorPickerDialog from "./ColorPickerDialog";
import { getPixelBank, pixelBankHeartbeat } from "@/providers/pixelBank";
import { useBankStore } from "@/stores/bank";

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
  const [canvasLastUpdated, setCanvasLastUpdated] = useState(
    new Date().toISOString()
  );
  const { addPastColor } = useColorStore();
  const { canvasRef, canvasContext, drawToCanvas } = useCanvas(
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_PX_SCALE
  );

  const { setCurrentPixels, currentPixels } = useBankStore();

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

    getCanvasPixels().then(drawToCanvas);
    getPixelBank().then(bank => setCurrentPixels(bank.currentPixels))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasContext]);

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

    const interval = setInterval(() => {
      getCanvasDelta(canvasLastUpdated).then(drawToCanvas);
      pixelBankHeartbeat().then(pixels => {
        if (!pixels || !pixels.currentPixels) {
          return;
        }
        setCurrentPixels(pixels.currentPixels);
      })
      setCanvasLastUpdated(new Date().toISOString());
    }, 10_000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasLastUpdated, canvasContext]);

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

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
  }, [canvasContext, canvasRef, activePixel]);

  // sets a pixel locally, then makes the API call
  const eagerDraw = (pixel: CanvasPixel) => {
    drawToCanvas([pixel]);
    addPastColor(pixel.color);
    putCanvasPixel(pixel);
    setCurrentPixels(currentPixels - 1);
    setActivePixel(pixel);
  };

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
                {isLoggedIn && (
                  <div className="flex items-center px-2 whitespace-nowrap bg-primary text-primary-foreground gap-2 text-md rounded-full" aria-label="Available tokens">
                    <GiToken /> <span>{ currentPixels }</span>
                  </div>
                )}
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
                  <ColorPickerDialog
                    initialColor={activePixel.color}
                    trigger={
                      <Button size="icon" type="button">
                        <MdOutlineEdit />
                      </Button>
                    }
                    onSubmit={(color) =>
                      eagerDraw({
                        ...activePixel,
                        color,
                      })
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </TransformWrapper>
  );
}

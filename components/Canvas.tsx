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
import { usePixelCanvas } from "@/hooks/usePixelCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { rgbToHex } from "@/lib/utils";
import { Button } from "./ui/button";
import { FaHourglassEnd, FaPencilAlt, FaSquare } from "react-icons/fa";
import Link from "next/link";
import Color from "color";
import ColorPickerDialog from "./ColorPickerDialog";
import { getBank } from "@/providers/pixelBank";
import { useBankStore } from "@/stores/bank";
import { Badge } from "./ui/badge";
import { useTimer } from "@/hooks/useTimer";

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
  const { canvasRef, canvasContext, drawToCanvas } = usePixelCanvas(
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_PX_SCALE
  );
  const { timer, startTimer } = useTimer();

  const {
    currentPixels,
    setCurrentPixels,
  } = useBankStore();

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

    getCanvasPixels().then(drawToCanvas);
    if (isLoggedIn) {
      getBank().then((bank) => {
        setCurrentPixels(bank.currentPixels);
        startTimer(bank.nextPixelIn);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasContext, isLoggedIn]);

  useEffect(() => {
    if (!canvasContext) {
      return;
    }

    const interval = setInterval(() => {
      getCanvasDelta(canvasLastUpdated).then(drawToCanvas);
      setCanvasLastUpdated(new Date().toISOString());
    }, 10_000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasLastUpdated, canvasContext]);

  useEffect(() => {
    if (timer !== 0) {
      return;
    }

    // once the pixel timer hits 0, make the bank call again, and the cycle repeats
    getBank().then((bank) => {
      setCurrentPixels(bank.currentPixels);
      startTimer(bank.nextPixelIn);
    });
  }, [timer]);

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
    putCanvasPixel(pixel).then(res => {
      startTimer(res.nextPixelIn)
    });
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
                  <div className="mb-2">
                    <Badge className="mr-2" icon={<FaSquare />}>
                      {currentPixels}
                    </Badge>
                    {timer !== -1 && <Badge variant="secondary" icon={<FaHourglassEnd />}>
                      {timer}s
                    </Badge>}
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
                        <FaPencilAlt size={20}/>
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

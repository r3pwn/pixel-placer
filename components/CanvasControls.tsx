import React from "react";

import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";

export const CanvasControls: React.FC<ReactZoomPanPinchContentRef> = ({
  zoomIn,
  zoomOut,
  resetTransform,
}: ReactZoomPanPinchContentRef) => (
  <div
    className="absolute flex gap-1"
    style={{
      zIndex: 2,
      transform: "translate(10px, 10px)",
      maxWidth: "calc(100% - 20px)",
    }}
  >
    <Button size="icon" type="button" onClick={() => zoomIn()}>
      <MdOutlineZoomIn />
    </Button>
    <Button size="icon" type="button" onClick={() => zoomOut()}>
      <MdOutlineZoomOut />
    </Button>
    <Button size="icon" type="button" onClick={() => resetTransform()}>
      <GrPowerReset />
    </Button>
  </div>
);

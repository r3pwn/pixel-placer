import React from "react";

import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { Button } from "./core/Button";

export const CanvasControls: React.FC<ReactZoomPanPinchContentRef> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
}: ReactZoomPanPinchContentRef) => (
  <div
    className="absolute flex gap-1"
    style={{
      zIndex: 2,
      transform: "translate(10px, 10px)",
      maxWidth: "calc(100% - 20px)",
    }}
  >
    <Button type="button" onClick={() => zoomIn()}>
      Zoom In +
    </Button>
    <Button type="button" onClick={() => zoomOut()}>
      Zoom Out -
    </Button>
    <Button type="button" onClick={() => resetTransform()}>
      Reset
    </Button>
    <Button type="button" onClick={() => centerView()}>
      Center
    </Button>
  </div>
);

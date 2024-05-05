import { NextRequest, NextResponse } from "next/server";
import { auth, client } from "@/providers/edgedb";
import { PIXELS_PER_ROW } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import e from "@/dbschema/edgeql-js";

const PIXEL_COORD_MIN = 0;
const PIXEL_COORD_MAX = PIXELS_PER_ROW - 1;

export async function GET() {
  const pixels = await e
    .select(e.CanvasPixel, () => ({
      x: true,
      y: true,
      color: true,
    }))
    .run(client);

  if (!pixels) {
    return NextResponse.json(
      { message: "No pixels available" },
      { status: 404 }
    );
  }

  return NextResponse.json(pixels, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = auth.getSession();
  const isSignedIn = await session.isSignedIn();

  if (!isSignedIn) {
    return NextResponse.json({ message: "Not logged in" }, { status: 403 });
  }

  let reqJson: CanvasPixel | undefined = undefined;
  try {
    reqJson = await req.json();
  } catch {
    // intentionally left blank
  }

  let validRequest = false;
  /*
   * ensure the following is true:
   * - request body exists
   * - `x` and `y` are provided and fall within the acceptable range
   * - `color` exists on the request body
   */
  if (
    reqJson &&
    reqJson.x >= PIXEL_COORD_MIN &&
    reqJson.x <= PIXEL_COORD_MAX &&
    reqJson.y >= PIXEL_COORD_MIN &&
    reqJson.y <= PIXEL_COORD_MAX &&
    !!reqJson.color
  ) {
    validRequest = true;
  }

  if (!reqJson || !validRequest) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  let result = await e
    .insert(e.CanvasPixel, {
      x: Number(reqJson.x),
      y: Number(reqJson.y),
      color: reqJson.color,
    })
    .unlessConflict((pixel) => ({
      on: e.tuple([pixel.x, pixel.y]),
      else: e.update(pixel, () => ({
        set: {
          color: reqJson.color,
        },
      })),
    }))
    .run(client);

  return NextResponse.json(result, {
    status: 200,
  });
}

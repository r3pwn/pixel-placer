import { NextRequest, NextResponse } from "next/server";
import { auth, client } from "@/providers/edgedb";
import { PIXELS_PER_ROW } from "@/constants";
import { CanvasPixel } from "@/types/CanvasPixel";
import e from "@/dbschema/edgeql-js";

const PIXEL_COORD_MIN = 0;
const PIXEL_COORD_MAX = PIXELS_PER_ROW - 1;

export async function GET(req: NextRequest) {
  const {
    nextUrl: { searchParams },
  } = req;

  const from = searchParams.get("from");
  let pixels = [] as CanvasPixel[];

  if (from) {
    const fromDate = new Date(from || "");
    pixels = await e
      .select(e.CanvasPixel, (pixel) => ({
        x: true,
        y: true,
        color: true,
        filter: e.op(pixel.updated_at, ">", fromDate),
      }))
      .run(client);
  } else {
    pixels = await e
      .select(e.CanvasPixel, () => ({
        x: true,
        y: true,
        color: true,
      }))
      .run(client);
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
      updated_at: new Date(),
    })
    .unlessConflict((pixel) => ({
      on: e.tuple([pixel.x, pixel.y]),
      else: e.update(pixel, () => ({
        set: {
          color: reqJson.color,
          updated_at: new Date(),
        },
      })),
    }))
    .run(client);

  return NextResponse.json(result, {
    status: 200,
  });
}

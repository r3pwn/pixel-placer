import { NextRequest, NextResponse } from "next/server";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const PIXEL_COORD_MIN = 0;
const PIXEL_COORD_MAX = 9;

export async function GET() {
  const client = createClient();

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

export async function PUT(req: NextRequest) {
  let reqJson;
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

  if (!validRequest) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const client = createClient();

  try {
    await e
      .insert(e.CanvasPixel, {
        x: Number(reqJson.x),
        y: Number(reqJson.y),
        color: reqJson.color,
      })
      .run(client);
  } catch (err) {
    if (String(err).includes("std::exclusive")) {
      return NextResponse.json(
        {
          message: "pixel already exists",
        },
        {
          status: 409,
        }
      );
    }
  }

  return NextResponse.json(
    {
      message: "ok",
    },
    {
      status: 200,
    }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/providers/edgedb";
import e from "@/dbschema/edgeql-js";
import { secondsDiff } from "@/lib/utils";

// 1 pixel every PIXEL_AWARD_RATE seconds
const PIXEL_AWARD_RATE = (process.env.PIXEL_AWARD_RATE && parseInt(process.env.PIXEL_AWARD_RATE)) || 0;
const PIXEL_BANK_MAX = (process.env.PIXEL_BANK_MAX && parseInt(process.env.PIXEL_BANK_MAX)) || 0;

export async function GET(req: NextRequest) {
    const session = auth.getSession();
    if (!(await session.isSignedIn())) {
      return NextResponse.json({ message: "not logged in" }, { status: 403 })
    }

    const authenticatedClient = session.client;

    const userBank = await e.select(e.User.bank, () => ({
      id: true,
      currentPixels: true,
      last_awarded_at: true
    })).run(authenticatedClient)
    
    const { currentPixels, last_awarded_at } = userBank[0]
    const lastAwardedAtDate = new Date(last_awarded_at);
    if (currentPixels >= PIXEL_BANK_MAX) {
      return NextResponse.json({ currentPixels, nextPixelIn: -1 }, { status: 200 })
    }
    
    // Find out how many seconds have passed to know how many pixels we need to add (backfill)
    const secondsPassed = secondsDiff(new Date(), lastAwardedAtDate);
    if (secondsPassed < PIXEL_AWARD_RATE)
    {
      return NextResponse.json({
        currentPixels,
        nextPixelIn: currentPixels === PIXEL_BANK_MAX ? -1 : PIXEL_AWARD_RATE - secondsPassed,
      }, { status: 200 })
    }

    const newCurrentPixels = Math.min(currentPixels + 1, PIXEL_BANK_MAX);
    const carryoverSeconds = newCurrentPixels === PIXEL_BANK_MAX ? 0 : secondsPassed % PIXEL_AWARD_RATE;

    await e.update(e.PixelBank, () => ({
      filter_single: {id: userBank[0].id},
      set: {
        currentPixels: newCurrentPixels,
        last_awarded_at: new Date(new Date().getTime() - (carryoverSeconds * 1000))
      }
    })).run(authenticatedClient)

    return NextResponse.json({
      currentPixels: newCurrentPixels,
      nextPixelIn: newCurrentPixels === PIXEL_BANK_MAX ? -1 : PIXEL_AWARD_RATE - carryoverSeconds
    }, { status: 200 });
}

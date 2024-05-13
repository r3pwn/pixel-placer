import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/providers/edgedb";
import e from "@/dbschema/edgeql-js";

const PIXEL_AWARD_RATE = (process.env.PIXEL_AWARD_PER_MINUTE && parseInt(process.env.PIXEL_AWARD_PER_MINUTE)) || 0;
const PIXEL_BANK_MAX = (process.env.PIXEL_BANK_MAX && parseInt(process.env.PIXEL_BANK_MAX)) || 0;

export async function GET(req: NextRequest) {
    const session = auth.getSession();
    if (!(await session.isSignedIn())) {
        return NextResponse.json({ message: "Not logged in" }, { status: 403 })
    }

    const authenticatedClient = session.client;
    const currentPixels = await e.select(e.User.bank, () => ({
        currentPixels: true
    })).run(authenticatedClient)

    return NextResponse.json(currentPixels[0], { status: 200 });
}

export async function POST(req: NextRequest) {
    const session = auth.getSession();
    if(!(await session.isSignedIn())) {
        return NextResponse.json({ message: "Not logged in" }, { status: 403 })
    }

    const authenticatedClient = session.client;

    const userBank = await e.select(e.User.bank, () => ({
        id: true,
        currentPixels: true,
        last_awarded_at: true
    })).run(authenticatedClient)
    const {currentPixels, last_awarded_at} = userBank[0]
    console.log(last_awarded_at)
    const lastAwardedAtDate = new Date(last_awarded_at);
    if(currentPixels >= PIXEL_BANK_MAX) {
        return NextResponse.json({currentPixels, message: "Cannot add more pixels as user has reached max holding!"}, {status: 412})
    }

    // The date object will automatically handle changes of hour/days/months/years
    const lastAwardedDatePlusOneMinute = new Date(lastAwardedAtDate).setMinutes(lastAwardedAtDate.getMinutes() + 1);
    // If one minute from the lastAwardedAtDate is less than the current time
    if (lastAwardedDatePlusOneMinute > new Date().getTime())
    {
        return NextResponse.json({currentPixels, message: `Cannot add more pixels until, ${new Date(lastAwardedDatePlusOneMinute).toString()}`}, {status: 412})
    }

    // Find out how many minutes have passed to know how many pixels we need to add (backfill)
    const minsPassed = minutesDiff(new Date(), lastAwardedAtDate);
    console.log(minsPassed)
    const pixelsToReward = minsPassed * PIXEL_AWARD_RATE;
    let newCurrentPixels = currentPixels + pixelsToReward;
    if (newCurrentPixels > PIXEL_BANK_MAX) {
        newCurrentPixels = PIXEL_BANK_MAX;
    }

    const updatedBank = await e.update(e.PixelBank, () => ({
        filter_single: {id: userBank[0].id},
        set: {
            currentPixels: newCurrentPixels,
            last_awarded_at: new Date()
        }
    })).run(authenticatedClient)

    return NextResponse.json({currentPixels: newCurrentPixels}, {status: 201});
}

function minutesDiff(currentTimeValue: Date, pastTimeValue: Date) {
    console.log(currentTimeValue.getTime(), pastTimeValue.getTime())
    var differenceValue = (currentTimeValue.getTime() - pastTimeValue.getTime()) / 1000;
    console.log(differenceValue)
    differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
 }
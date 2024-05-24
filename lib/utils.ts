import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rgbToHex(red: number, green: number, blue: number) {
  return (
    "#" + (0x1000000 + (red << 16) + (green << 8) + blue).toString(16).slice(1)
  );
}

/** return the number of seconds between two dates */
export function secondsDiff(currentTimeValue: Date, pastTimeValue: Date) {
  var differenceValue = (currentTimeValue.getTime() - pastTimeValue.getTime()) / 1000;
  return Math.abs(Math.round(differenceValue));
}
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

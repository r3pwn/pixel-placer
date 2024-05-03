import { create } from "zustand";

const DEFAULT_COLOR = "#eb4034";
const PAST_COLORS_LIMIT = 5;

interface ColorStore {
  currentColor: string;
  pastColors: string[];
  setCurrentColor: (color: string) => void;
  addPastColor: (color: string) => void;
}

export const useColorStore = create<ColorStore>((set, get) => ({
  currentColor: DEFAULT_COLOR,
  pastColors: [DEFAULT_COLOR],
  setCurrentColor: (color) => set(() => ({ currentColor: color })),
  addPastColor: (color) => {
    const pastColors = get().pastColors;
    if (pastColors.includes(color)) {
      // if the color already exists in the array, move it to the front
      const index = pastColors.indexOf(color);
      if (index === 0) {
        return;
      }
      set(() => ({
        pastColors: [
          color,
          ...pastColors.filter((pastColor) => pastColor != color),
        ],
      }));
      return;
    }
    // add the color to the array and limit its size to PAST_COLORS_LIMIT items;
    set(() => ({
      pastColors: [color, ...pastColors].slice(0, PAST_COLORS_LIMIT),
    }));
  },
}));

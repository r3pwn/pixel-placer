import { useColorStore } from "@/stores/color";
import { debounce } from "lodash";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

const debounceSetCurrentColor = debounce((color: string, setCurrentColor: (color: string) => void) => {
  setCurrentColor(color); 
}, 500)

export default function ColorPicker({currentPixelColor}: {currentPixelColor: string}) {
  const { currentColor, setCurrentColor, pastColors } = useColorStore();
  const [ selectedColor, setSelectedColor ] = useState(currentPixelColor);

  const handleChange = (color: string) => {
    setSelectedColor(color);
    debounceSetCurrentColor(color, setCurrentColor);
  }

  return (
    <div className="flex flex-col mx-3">
      <div className="text-sm">
        <div>Current Pixel Color: {currentPixelColor}</div>
        <div>New Color: {selectedColor}</div>
      </div>
      <div className="mt-3">
        <HexColorPicker color={currentPixelColor} onChange={handleChange} />
      </div>
      <ul className="flex mt-3 gap-2">
        {pastColors.length &&
          pastColors.map((pastColor, index) => {
            return (
              <button
                key={index}
                name="color_history_option"
                role="radio"
                aria-checked={pastColor === currentColor}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: pastColor,
                  outline: pastColor === currentColor ? "auto" : "none",
                  outlineOffset: "2px",
                  borderRadius: "100%",
                }}
                onClick={() => setCurrentColor(pastColor)}
              ></button>
            );
          })}
      </ul>
    </div>
  );
}

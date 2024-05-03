import { useColorStore } from "@/stores/color";
import { HexColorPicker } from "react-colorful";

export default function Sidebar() {
  const { currentColor, setCurrentColor, pastColors } = useColorStore();
  return (
    <aside className="flex flex-col mr-3">
      <div>Current Color: {currentColor}</div>
      <div>
        <HexColorPicker color={currentColor} onChange={setCurrentColor} />
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
    </aside>
  );
}

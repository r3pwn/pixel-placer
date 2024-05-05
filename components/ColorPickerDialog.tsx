import { useColorStore } from "@/stores/color";
import { ReactNode, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

type Props = {
  initialColor: string;
  trigger: ReactNode | ReactNode[];
  onSubmit: (color: string) => void;
};

export default function ColorPickerDialog({
  initialColor,
  trigger,
  onSubmit,
}: Props) {
  const { pastColors } = useColorStore();
  const [selectedColor, setSelectedColor] = useState(initialColor);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing a pixel</DialogTitle>
          <div className="flex flex-col mx-auto">
            <div className="mt-3">
              <HexColorPicker
                color={selectedColor}
                onChange={setSelectedColor}
              />
            </div>
            <ul className="flex mt-3 gap-2">
              {pastColors.length &&
                pastColors.map((pastColor, index) => {
                  return (
                    <button
                      key={index}
                      name="color_history_option"
                      role="radio"
                      aria-checked={pastColor === selectedColor}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: pastColor,
                        outline: pastColor === selectedColor ? "auto" : "none",
                        outlineOffset: "2px",
                        borderRadius: "100%",
                      }}
                      onClick={() => setSelectedColor(pastColor)}
                    ></button>
                  );
                })}
            </ul>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={() => onSubmit(selectedColor)}>
              Change
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

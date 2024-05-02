import { HexColorPicker } from "react-colorful"

type Props = {
    color: string,
    lastFiveColors: string[],
    setColor: (x: string) => void
}

export default function Sidebar ({color, lastFiveColors, setColor}: Props) {
    return (
        <aside className="flex flex-col mr-3">
            <div>Current Color: {color}</div>
            <div>
                <HexColorPicker color={color} onChange={setColor} />
            </div>
            <ul className="flex mt-3 gap-2">
                { lastFiveColors.length && (
                    lastFiveColors.map((historyColor, index) => {
                        return (
                            <button key={index}
                                    name="color_history_option"
                                    role="radio"
                                    aria-checked={historyColor === color}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: historyColor,
                                        outline: historyColor === color ? "auto" : "none",
                                        outlineOffset: "2px",
                                        borderRadius: "100%",
                                    }}
                                    onClick={() => setColor(historyColor)}>
                            </button>
                        )
                    })
                )}
            </ul>
        </aside>
    )
}
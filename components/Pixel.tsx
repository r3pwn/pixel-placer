"use client";

type Props = {
  color: string;
  selected?: boolean;
  size?: number;
  onClick?: () => void;
  onDrag?: (e: any) => void;
};

const defaultProps: Partial<Props> = {
  selected: false,
  size: 25,
};

export default function Pixel({ color, size, onClick, onDrag }: Props) {
  return (
    <div
      className="canvas-pixel"
      style={{
        backgroundColor: color,
        width: size || defaultProps.size,
        height: size || defaultProps.size,
      }}
      onClick={onClick}
      onMouseEnter={onDrag}
    ></div>
  );
}

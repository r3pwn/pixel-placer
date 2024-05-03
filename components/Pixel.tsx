"use client";
import { Popover } from '@headlessui/react'
import ColorPicker from './ColorPicker';
import Color from 'color';
import { Float } from '@headlessui-float/react';

type Props = {
  color: string;
  selected?: boolean;
  size?: number;
  onSubmit?: () => void;
};

const defaultProps: Partial<Props> = {
  selected: false,
  size: 25,
};

export default function Pixel({ color, size, onSubmit }: Props) {
  const colorObject = Color(color);
  const darkenedColor = colorObject.darken(0.2);
  return (
    <Popover className="relative">
      <Float autoPlacement={
        {
          alignment: "start"
        }
      }
      >  
        <Popover.Button as="div"
        className={`canvas-pixel hover:scale-110 hover:outline-1 hover:outline hover:relative hover:z-10 hover:shadow-lg outline-offset-[-1px] ui-open:scale-110 ui-open:outline-1 ui-open:outline ui-open:relative ui-open:z-10 ui-open:shadow-lg`}
        style={{
          backgroundColor: color,
          width: size || defaultProps.size,
          height: size || defaultProps.size,
          outlineColor: darkenedColor.toString()
        }}
        />
        <Popover.Panel className={"z-10 bg-zinc-800 p-2 rounded-md shadow-md flex flex-col"}>
          <h2>Choose the pixel color!</h2>
          <ColorPicker currentPixelColor={color}/>
          <button className='bg-cyan-800 hover:bg-cyan-900 px-2 py-1 mt-3 ml-auto rounded-md' onClick={() => onSubmit && onSubmit()}>Set Pixel Color</button>
        </Popover.Panel>
      </Float>
    </Popover>
  );
}

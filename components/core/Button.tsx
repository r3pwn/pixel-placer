import React, { ButtonHTMLAttributes } from "react";

type ButtonColor = "cyan" | "purple";

type ButtonProps = {
  color?: ButtonColor;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  color,
  className,
  children,
  ...props
}: ButtonProps) => {
  const buttonColor = color || "cyan";
  const buttonClasses = `bg-${buttonColor}-800 hover:bg-${buttonColor}-900 px-2 py-1 rounded-md ${className}`;
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

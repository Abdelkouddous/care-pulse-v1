import React from "react";
import Image from "next/image";
import { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "./button";

interface SubmitButtonProps extends VariantProps<typeof buttonVariants> {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode | string;
  type?: "submit" | "button" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const SubmitButton = ({
  isLoading,
  className,
  children,
  roleVariant = "patient",
  size = "default",
  type = "submit",
  onClick,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading}
      roleVariant={roleVariant}
      size={size}
      onClick={onClick}
      className={className}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={18}
            height={18}
            className="animate-spin brightness-0 invert"
          />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

import React from "react";
import Image from "next/image";

import { Button } from "./button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode | string;
}
export const SubmitButton = ({
  isLoading,
  className,
  children,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={
        className ?? "shad-primary-btn w-full hover:scale-105 hover:shadow-sm"
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width="16"
            height="16"
            className="animate-spin"
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Universal Button Component with Domain Role Polymorphism
 * Enforces unified visual tokens for Patient (Emerald), Doctor (Sky), Admin (Slate) and Neutral actions.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] dark:ring-offset-slate-950",
  {
    variants: {
      roleVariant: {
        // Patient Domain Actions
        patient:
          "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600",
        patientOutline:
          "border-2 border-emerald-600 text-emerald-600 bg-transparent hover:bg-emerald-50 hover:border-emerald-700 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/30",

        // Doctor Domain Actions
        doctor:
          "bg-sky-600 text-white shadow-md shadow-sky-600/20 hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 focus-visible:ring-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600",
        doctorOutline:
          "border-2 border-sky-600 text-sky-600 bg-transparent hover:bg-sky-50 hover:border-sky-700 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-950/30",

        // Admin Domain Actions
        admin:
          "bg-slate-800 text-white shadow-md shadow-slate-800/20 hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-800/30 focus-visible:ring-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
        adminOutline:
          "border-2 border-slate-700 text-slate-700 bg-transparent hover:bg-slate-100 dark:border-slate-400 dark:text-slate-200 dark:hover:bg-slate-800",

        // Standard Utility Variants
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        link:
          "text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      roleVariant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  variant?: VariantProps<typeof buttonVariants>["roleVariant"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, roleVariant, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const resolvedRole = roleVariant || variant || "default";
    return (
      <Comp
        className={cn(buttonVariants({ roleVariant: resolvedRole, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

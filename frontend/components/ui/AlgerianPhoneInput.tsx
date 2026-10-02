"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { DZ } from "country-flag-icons/react/3x2";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlgerianPhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
}

export function cleanAlgerianDigits(input: string = ""): string {
  if (!input) return "";
  let digits = input.replace(/\D/g, "");
  // Strip country code if pasted
  if (digits.startsWith("213")) {
    digits = digits.slice(3);
  }
  // Strip leading 0 if entered (e.g. 0550 -> 550)
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // Algerian mobile & national numbers are 9 digits
  return digits.slice(0, 9);
}

export function formatAlgerianDigits(digits: string): string {
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
}

export const AlgerianPhoneInput = forwardRef<HTMLInputElement, AlgerianPhoneInputProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "549 88 24 56",
      disabled = false,
      className,
      containerClassName,
      id,
      autoFocus,
      required,
      ...props
    },
    ref
  ) => {
    // Keep local formatted state for display
    const [displayValue, setDisplayValue] = useState(() => {
      const cleaned = cleanAlgerianDigits(value);
      return formatAlgerianDigits(cleaned);
    });

    // Synchronize with external value changes (e.g. form reset or autofill)
    useEffect(() => {
      const cleaned = cleanAlgerianDigits(value);
      const formatted = formatAlgerianDigits(cleaned);
      setDisplayValue(formatted);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const cleaned = cleanAlgerianDigits(rawInput);
      const formatted = formatAlgerianDigits(cleaned);
      setDisplayValue(formatted);

      if (onChange) {
        // Output full E.164 Algerian format (+213XXXXXXXXX) or empty string
        const fullE164 = cleaned ? `+213${cleaned}` : "";
        onChange(fullE164);
      }
    };

    return (
      <div
        className={cn(
          "w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-3.5 py-2.5 shadow-xs transition-all",
          "focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500",
          disabled && "opacity-60 cursor-not-allowed",
          containerClassName
        )}
      >
        {/* Locked Algerian Country Badge (+213) */}
        <div
          className="flex items-center gap-1.5 select-none shrink-0"
          title="Locked to Algeria (+213)"
          aria-label="Algeria country code +213"
        >
          <div className="w-5 h-3.5 rounded-[2px] overflow-hidden shadow-xs border border-black/10 shrink-0 flex items-center justify-center">
            <DZ className="w-full h-full object-cover" />
          </div>
          <ChevronDown className="size-3 text-slate-400 shrink-0 opacity-80" />
          <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 pl-0.5">
            +213
          </span>
        </div>

        {/* Vertical subtle divider */}
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

        {/* Phone Input Box */}
        <input
          ref={ref}
          type="tel"
          id={id}
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-0 p-0 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal outline-none focus:outline-none focus:ring-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

AlgerianPhoneInput.displayName = "AlgerianPhoneInput";
export default AlgerianPhoneInput;

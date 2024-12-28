"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/tw-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      helperText,
      fullWidth = true,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-1",
          fullWidth ? "w-full" : "w-auto",
          containerClassName
        )}
      >
        <input
          {...props}
          ref={ref}
          disabled={disabled}
          className={cn(
            "bg-white",
            "border border-line-default",
            "rounded px-2 py-2",
            "transition-colors duration-200",
            "placeholder:text-muted-foreground",
            // Focus states
            // Error states
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
            // Disabled state
            disabled && "opacity-50 cursor-not-allowed bg-muted",
            // Width
            fullWidth ? "w-full" : "w-auto",
            className
          )}
        />
        {helperText && (
          <p
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

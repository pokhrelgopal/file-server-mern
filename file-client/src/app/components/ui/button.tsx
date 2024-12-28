"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        md: "px-4 py-2.5 text-b2 rounded-md",
        lg: "px-6 py-3 text-lg rounded-md",
        fullRounded: "rounded-full p-3",
      },
      variant: {
        primary: "bg-button-700 text-white",
        secondary: "bg-button-50 text-black",
        outline: "border border-line-default text-gray-700",
        link: "text-blue-500",
        ghost: "bg-transparent text-gray-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    loading?: boolean;
  };

export const LoaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size,
      variant,
      type = "button",
      onClick,
      iconLeft,
      iconRight,
      disabled,
      className,
      loading,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {loading && <LoaderIcon />}
        {!loading && iconLeft && (
          <span className={`${children ? "mr-2" : undefined}`}>{iconLeft}</span>
        )}
        {!loading && children}
        {!loading && iconRight && (
          <span className={children ? "ml-2" : undefined}>{iconRight}</span>
        )}
      </>
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ size, variant, className })}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

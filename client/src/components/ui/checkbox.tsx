import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center">
        <div className="relative inline-block">
          <input
            type="checkbox"
            className="absolute w-0 h-0 opacity-0"
            ref={ref}
            {...props}
          />
          <div
            className={`w-4 h-4 border border-gray-300 rounded cursor-pointer flex items-center justify-center ${
              props.checked ? "bg-blue-500 border-blue-500" : "bg-white"
            } ${className}`}
          >
            {props.checked && (
              <svg
                className="w-3 h-3 text-white fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            )}
          </div>
        </div>
        {label && <span className="ml-2 text-sm">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

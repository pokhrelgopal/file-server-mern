import { cn } from "@/utils/tw-merge";
import React from "react";

interface Props {
  className?: string;
  message: string | undefined;
}

const FormErrorMessage = (props: Props) => {
  return (
    <span className={cn(["text-red-500 text-xs mt-1"], props.className)}>
      {props.message}
    </span>
  );
};

export default FormErrorMessage;

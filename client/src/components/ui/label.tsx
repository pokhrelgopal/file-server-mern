import { cn } from "@/utils/tw-merge";
import React from "react";
interface Props extends React.ComponentPropsWithRef<"label"> {
  children: React.ReactNode;
}

const Label = (props: Props) => {
  return (
    <label {...props} className={cn(["mb-1"])}>
      {props.children}
    </label>
  );
};

export default Label;

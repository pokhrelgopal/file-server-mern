import Image from "next/image";
import React from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  src?: string;
}

const Avatar = (props: Props) => {
  return (
    <div className="rounded-full min-h-8 min-w-8">
      <Image
        src={props.src || "/avatar.png"}
        alt="avatar"
        width={100}
        height={100}
        className={`rounded-full object-cover h-8 min-w-8 max-w-8`}
      />
    </div>
  );
};

export default Avatar;

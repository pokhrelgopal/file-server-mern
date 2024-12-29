"use client";
import { useLogoutMutation } from "@/libs/features/userApi";
import { cn } from "@/utils/tw-merge";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "../ui/button";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const LogoutButton = (props: Props) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    const response = await logout();
    if ("data" in response) {
      router.push("/");
    } else {
      console.error("Logout error:", response.error);
    }
  };

  return (
    <Button
      variant={"primary"}
      onClick={handleLogout}
      className={cn("cursor-pointer", props.className)}
    >
      {props.children}
    </Button>
  );
};

export default LogoutButton;

"use client";
import Button from "@/components/ui/button";
import { logoutUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import React from "react";

const DashboardPage = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response?.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error in handleLogout:", error);
    }
  };
  return (
    <div>
      <Button onClick={handleLogout} variant={"primary"}>
        Logout
      </Button>
    </div>
  );
};

export default DashboardPage;

"use client";
import Button from "@/components/ui/button";
import { useMeQuery } from "@/libs/features/userApi";
import Link from "next/link";
import React, { useEffect } from "react";

const HeroNav = () => {
  const { data: user, refetch } = useMeQuery();
  useEffect(() => {
    console.log(user);
    refetch();
  }, []);
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 py-6">
      <h4 className="text-h4 text-red-600">DropIT</h4>
      <>
        {user ? (
          <Link href="/dashboard">
            <Button variant={"secondary"}>Dashboard</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant={"secondary"}>Sign In</Button>
          </Link>
        )}
      </>
    </nav>
  );
};

export default HeroNav;

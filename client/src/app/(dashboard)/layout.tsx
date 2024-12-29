"use client";
import React, { useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { useGetSecretKeyQuery } from "@/libs/features/keyApi";
import Loader from "@/components/ui/loader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: secretKeyData, isLoading } = useGetSecretKeyQuery();
  useEffect(() => {
    if (secretKeyData) {
      console.log("Secret key fetched and stored in Redux");
    }
  }, [secretKeyData]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="min-h-screen flex">
      <aside className="fixed w-64 h-screen border-e border-line-default">
        <Sidebar />
      </aside>
      <article className="ml-64 p-6 w-full">{children}</article>
    </main>
  );
};

export default DashboardLayout;

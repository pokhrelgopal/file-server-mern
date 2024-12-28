import React from "react";
import Sidebar from "./_components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

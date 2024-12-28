"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/utils/tw-merge";
import { DocumentLike, HomeHashtag, Key, Setting2 } from "iconsax-react";

export const dashboardRoutes = [
  {
    label: "Dashboard",
    icon: HomeHashtag,
    href: "/dashboard",
  },
  {
    label: "Files",
    icon: DocumentLike,
    href: "/dashboard/files",
  },
  {
    label: "Api Key",
    icon: Key,
    href: "/dashboard/api-key",
  },
  {
    label: "Settings",
    icon: Setting2,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="px-4 py-6">
        <Link href="/">
          <span className="grid text-h4 text-red-600 h-10 w-28 place-content-center rounded-lg bg-white ">
            DropIT
          </span>
        </Link>

        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          {dashboardRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 font-medium",
                  {
                    "bg-gray-100 text-gray-700": isActive,
                    "text-gray-500 hover:bg-gray-100 hover:text-gray-700":
                      !isActive,
                  }
                )}
              >
                <route.icon className="stroke-icon-default h-5 w-5 opacity-75" />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          {/* <Image
            alt="User"
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="rounded-full object-cover"
            width={40}
            height={40}
          /> */}

          {/* use placeholder image for now */}
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

          <div>
            <p className="text-xs">
              <strong className="block font-medium">Eric Frusciante</strong>
              <span className="text-gray-500"> eric@frusciante.com </span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

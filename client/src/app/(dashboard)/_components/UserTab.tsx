"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useLogoutMutation, useMeQuery } from "@/libs/features/userApi";
import Button from "@/components/ui/button";
import { Logout } from "iconsax-react";
import { useRouter } from "next/navigation";

export interface UserType {
  id: string;
  email: string;
  fullName: string;
}

const UserTab = () => {
  const [showLogout, setShowLogout] = React.useState(false);
  const { data: user, isLoading } = useMeQuery();
  const logoutRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      console.log(res);
      if (res.status == 200) router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-1">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-10 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowLogout(!showLogout)}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="text-xs">
                <strong className="block font-medium">{user?.fullName}</strong>
                <span className="text-gray-500">{user?.email}</span>
              </p>
            </div>
          </div>
          <AnimatePresence>
            {showLogout && (
              <motion.div
                ref={logoutRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-16 bottom-20  mb-2"
              >
                <Button
                  variant="secondary"
                  size="md"
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                  <Logout className="stroke-icon-default w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UserTab;

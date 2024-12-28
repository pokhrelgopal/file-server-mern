import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isCollapsed?: boolean;
}

const Logo = ({ isCollapsed = false }: Props) => {
  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={24}
          height={24}
          className="min-w-10 min-h-10 max-w-10 max-h-10 -ml-2.5"
        />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-accent-700 overflow-hidden whitespace-nowrap"
            >
              GIDS
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export default Logo;

import { CloseCircle } from "iconsax-react";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px]"
        >
          <div ref={sheetRef} className="relative h-full bg-white shadow-xl">
            <p className="absolute top-2 right-2">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <CloseCircle className="stroke-icon-default cursor-pointer size-5" />
              </button>
            </p>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sheet;

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

function Backdrop({ children, onClick }) {
  return (
    <AnimatePresence>
      <motion.div
        onClick={onClick}
        className="fixed inset-0 z-40 overflow-y-auto bg-black/50 flex justify-center items-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
          // ease: "easeInOut",
          // type: "spring",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default Backdrop;

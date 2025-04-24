import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function DomainSuccessModal({ domainName, open, onClose }) {
  const [width, height] = useWindowSize();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="glassmorphic-dark dark:glassmorphic rounded-2xl p-6 w-full max-w-md shadow-xl relative text-center">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={250} />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center space-y-4"
        >
          <CheckCircle className="text-white w-16 h-16" />
          <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
          <p className="text-white">
            Thank you for your domain purchase. {domainName} is now yours.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-primary/60 hover:bg-primary/70 text-white rounded-2xl"
          >
            Close
          </button>
        </motion.div>
      </div>
    </div>
  );
}

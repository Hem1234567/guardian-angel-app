import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface SOSButtonProps {
  onPress: () => void;
  isActive: boolean;
}

const SOSButton = ({ onPress, isActive }: SOSButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Animated rings */}
      {!isActive && (
        <>
          <span className="absolute h-32 w-32 rounded-full bg-emergency/20 sos-ring" />
          <span className="absolute h-32 w-32 rounded-full bg-emergency/15 sos-ring" style={{ animationDelay: "0.5s" }} />
          <span className="absolute h-32 w-32 rounded-full bg-emergency/10 sos-ring" style={{ animationDelay: "1s" }} />
        </>
      )}

      <motion.button
        onClick={onPress}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className={`relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full font-bold text-emergency-foreground shadow-2xl transition-colors ${
          isActive
            ? "bg-success"
            : "bg-emergency sos-pulse"
        }`}
      >
        {isActive ? (
          <>
            <Phone className="mb-1 h-8 w-8" />
            <span className="text-sm">Calling...</span>
          </>
        ) : (
          <>
            <span className="text-3xl font-black tracking-wider">SOS</span>
            <span className="mt-1 text-xs font-medium opacity-90">TAP FOR HELP</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default SOSButton;

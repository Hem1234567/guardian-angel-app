import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendancePopupProps {
  isOpen: boolean;
  volunteerName: string;
  pointsAwarded: number;
  onClose: () => void;
}

const AttendancePopup = ({ isOpen, volunteerName, pointsAwarded, onClose }: AttendancePopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle2 className="h-10 w-10 text-success" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">Patient Attended!</h2>
            <p className="mt-2 text-muted-foreground">
              <strong>{volunteerName}</strong> has successfully attended the patient.
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-warning">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">+{pointsAwarded} Credit Points Awarded</span>
            </div>
            <Button onClick={onClose} className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90">
              Done
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendancePopup;

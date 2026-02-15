import { motion } from "framer-motion";
import { Phone, MapPin, Star, Stethoscope, Pill, HeartPulse, FlaskConical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const roleIcons: Record<string, React.ReactNode> = {
  Doctor: <Stethoscope className="h-3.5 w-3.5" />,
  Nurse: <HeartPulse className="h-3.5 w-3.5" />,
  Pharmacist: <Pill className="h-3.5 w-3.5" />,
  Compounder: <FlaskConical className="h-3.5 w-3.5" />,
};

const roleColors: Record<string, string> = {
  Doctor: "bg-blue-100 text-blue-800",
  Nurse: "bg-pink-100 text-pink-800",
  Pharmacist: "bg-amber-100 text-amber-800",
  Compounder: "bg-teal-100 text-teal-800",
};

export interface VolunteerCardData {
  id: string;
  name: string;
  mobile: string;
  role: string;
  specialty?: string | null;
  credit_points: number;
  distance: number;
  avatar: string;
}

interface VolunteerCardProps {
  volunteer: VolunteerCardData;
  onCall: (volunteer: VolunteerCardData) => void;
  isNearest?: boolean;
}

const VolunteerCard = ({ volunteer, onCall, isNearest }: VolunteerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-xl p-4 ${isNearest ? "ring-2 ring-emergency" : ""}`}
    >
      {isNearest && (
        <span className="mb-2 inline-block rounded-full bg-emergency px-2 py-0.5 text-xs font-semibold text-emergency-foreground">
          Nearest
        </span>
      )}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
            {volunteer.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{volunteer.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className={`text-xs gap-1 ${roleColors[volunteer.role] || ""}`}>
              {roleIcons[volunteer.role]}
              {volunteer.role}
            </Badge>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {(volunteer.distance * 1000).toFixed(0)}m
            </span>
          </div>
          {volunteer.specialty && (
            <p className="text-xs text-muted-foreground mt-0.5">{volunteer.specialty}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-0.5 text-xs text-warning">
            <Star className="h-3 w-3 fill-current" />
            {volunteer.credit_points}
          </span>
          <Button
            size="sm"
            className="bg-success text-success-foreground hover:bg-success/90 gap-1"
            onClick={() => onCall(volunteer)}
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VolunteerCard;

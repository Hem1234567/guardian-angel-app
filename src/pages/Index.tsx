import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Shield } from "lucide-react";
import SOSButton from "@/components/SOSButton";
import EmergencyMap from "@/components/EmergencyMap";
import VolunteerCard from "@/components/VolunteerCard";
import type { VolunteerCardData } from "@/components/VolunteerCard";
import AttendancePopup from "@/components/AttendancePopup";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getDistance } from "@/data/mockVolunteers";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [nearbyVolunteers, setNearbyVolunteers] = useState<VolunteerCardData[]>([]);
  const [callingVolunteer, setCallingVolunteer] = useState<VolunteerCardData | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchLocation = useCallback(() => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        () => {
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLocationLoading(false);
          toast({ title: "Using demo location", description: "GPS unavailable — using Delhi for demo." });
        }
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      setLocationLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchLocation(); }, [fetchLocation]);

  const handleSOS = async () => {
    if (sosActive || !userLocation || !user) return;
    setSosActive(true);

    await supabase.from("sos_requests").insert({
      user_id: user.id,
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      status: "pending",
    });

    const { data: volunteers } = await supabase.from("volunteers").select("*").eq("available", true);

    if (volunteers && volunteers.length > 0) {
      const withDistance: VolunteerCardData[] = volunteers
        .map((v) => ({
          id: v.id,
          name: v.name,
          mobile: v.mobile,
          role: v.role,
          specialty: v.specialty,
          credit_points: v.credit_points,
          distance: getDistance(userLocation.lat, userLocation.lng, v.latitude, v.longitude),
          avatar: v.name.split(" ").map((w) => w[0]).join("").slice(0, 2),
        }))
        .filter((v) => v.distance <= 10)
        .sort((a, b) => a.distance - b.distance);

      setNearbyVolunteers(withDistance);
      toast({ title: "🚨 SOS Alert Sent!", description: `Found ${withDistance.length} nearby volunteers.` });
    } else {
      toast({ title: "No volunteers nearby", description: "No registered volunteers found yet.", variant: "destructive" });
    }
  };

  const handleCall = (volunteer: VolunteerCardData) => {
    setCallingVolunteer(volunteer);
    window.location.href = `tel:${volunteer.mobile.replace(/\s/g, "")}`;
    setTimeout(() => setShowAttendance(true), 5000);
  };

  const handleAttendanceClose = async () => {
    if (callingVolunteer) {
      await supabase.rpc("award_credit_points", { _volunteer_id: callingVolunteer.id, _points: 10 });
    }
    setShowAttendance(false);
    setSosActive(false);
    setCallingVolunteer(null);
    setNearbyVolunteers([]);
    toast({ title: "✅ Emergency Completed", description: "Thank you! Stay safe." });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emergency" />
            <h1 className="text-lg font-bold text-foreground">MedSOS</h1>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {locationLoading ? "Locating..." : userLocation ? "Location active" : "No location"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-8">
          {!sosActive && (
            <div className="mb-6 flex items-center gap-2 rounded-full bg-emergency/10 px-4 py-2 text-sm font-medium text-emergency">
              <AlertTriangle className="h-4 w-4" />
              Press SOS for emergency help
            </div>
          )}
          <SOSButton onPress={handleSOS} isActive={sosActive} />
          {sosActive && nearbyVolunteers.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              {nearbyVolunteers.length} volunteer{nearbyVolunteers.length > 1 ? "s" : ""} found nearby
            </p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6 h-56 overflow-hidden rounded-xl border border-border shadow-sm">
          <EmergencyMap userLocation={userLocation} volunteers={nearbyVolunteers} selectedVolunteer={callingVolunteer?.id} />
        </motion.div>

        {sosActive && nearbyVolunteers.length > 0 && (
          <div className="space-y-3 pb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Nearby Volunteers</h2>
            {nearbyVolunteers.map((v, i) => (
              <VolunteerCard key={v.id} volunteer={v} onCall={handleCall} isNearest={i === 0} />
            ))}
          </div>
        )}
      </div>

      <AttendancePopup isOpen={showAttendance} volunteerName={callingVolunteer?.name || ""} pointsAwarded={10} onClose={handleAttendanceClose} />
    </div>
  );
};

export default Index;

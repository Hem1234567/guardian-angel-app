import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Star, MapPin, Phone, Shield, LogOut, ToggleLeft, ToggleRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [volunteer, setVolunteer] = useState<any>(null);
  const [sosHistory, setSosHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, volunteerRes, sosRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("volunteers").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("sos_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setProfile(profileRes.data);
      setVolunteer(volunteerRes.data);
      setSosHistory(sosRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleAvailability = async () => {
    if (!volunteer) return;
    const { error } = await supabase
      .from("volunteers")
      .update({ available: !volunteer.available })
      .eq("id", volunteer.id);
    if (!error) {
      setVolunteer({ ...volunteer, available: !volunteer.available });
      toast({ title: !volunteer.available ? "You're now online" : "You're now offline" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const initials = (profile?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground gap-1">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6 space-y-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 text-center">
          <Avatar className="mx-auto h-20 w-20 border-4 border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-xl font-bold text-foreground">{profile?.name || "User"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {profile?.mobile && (
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {profile.mobile}
            </p>
          )}
          {volunteer && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <Badge className="bg-primary/10 text-primary">{volunteer.role}</Badge>
              <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                <Star className="h-4 w-4 fill-current" /> {volunteer.credit_points} pts
              </span>
            </div>
          )}
        </motion.div>

        {/* Availability Toggle (Volunteers Only) */}
        {volunteer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button
              onClick={toggleAvailability}
              className={`w-full flex items-center justify-between glass-card rounded-xl p-4 transition-all ${
                volunteer.available ? "ring-2 ring-success" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className={`h-5 w-5 ${volunteer.available ? "text-success" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Availability</p>
                  <p className="text-xs text-muted-foreground">
                    {volunteer.available ? "Receiving emergency calls" : "Not receiving calls"}
                  </p>
                </div>
              </div>
              {volunteer.available ? (
                <ToggleRight className="h-8 w-8 text-success" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
            </button>
          </motion.div>
        )}

        {/* Emergency History */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
            Emergency History
          </h2>
          {sosHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No emergencies yet</p>
          ) : (
            <div className="space-y-2">
              {sosHistory.map((req) => (
                <div key={req.id} className="glass-card flex items-center justify-between rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    {req.status === "completed" || req.status === "attended" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : req.status === "pending" ? (
                      <Clock className="h-5 w-5 text-warning" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-emergency" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">SOS Request</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString()} at{" "}
                        {new Date(req.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      req.status === "completed" || req.status === "attended"
                        ? "bg-success/10 text-success"
                        : req.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

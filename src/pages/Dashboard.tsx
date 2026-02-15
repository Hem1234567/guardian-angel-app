import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, AlertTriangle, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [sosCount, setSosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [volRes, sosRes] = await Promise.all([
        supabase.from("volunteers").select("*").order("credit_points", { ascending: false }),
        supabase.from("sos_requests").select("id", { count: "exact" }).eq("user_id", user?.id || ""),
      ]);
      setVolunteers(volRes.data || []);
      setSosCount(sosRes.count || 0);
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const activeCount = volunteers.filter((v) => v.available).length;
  const totalPoints = volunteers.reduce((s, v) => s + v.credit_points, 0);

  const stats = [
    { label: "Total Volunteers", value: volunteers.length, icon: Users, color: "text-primary" },
    { label: "Active Now", value: activeCount, icon: TrendingUp, color: "text-success" },
    { label: "Your Emergencies", value: sosCount, icon: AlertTriangle, color: "text-emergency" },
    { label: "Total Points", value: totalPoints, icon: Star, color: "text-warning" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto max-w-md flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">Top Volunteers</h2>
          {volunteers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No volunteers registered yet</p>
          ) : (
            <div className="space-y-2">
              {volunteers.slice(0, 5).map((v, i) => (
                <div key={v.id} className="glass-card flex items-center gap-3 rounded-xl p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-xs font-bold text-warning">{i + 1}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {v.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                      <Star className="h-3.5 w-3.5 fill-current" /> {v.credit_points}
                    </span>
                    <Badge variant="secondary" className={v.available ? "bg-success/10 text-success text-xs" : "text-xs"}>
                      {v.available ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

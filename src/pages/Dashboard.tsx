import { motion } from "framer-motion";
import { LayoutDashboard, Users, AlertTriangle, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockVolunteers } from "@/data/mockVolunteers";

const stats = [
  { label: "Total Volunteers", value: mockVolunteers.length, icon: Users, color: "text-primary" },
  { label: "Active Now", value: mockVolunteers.filter((v) => v.available).length, icon: TrendingUp, color: "text-success" },
  { label: "Emergencies Today", value: 3, icon: AlertTriangle, color: "text-emergency" },
  { label: "Points Awarded", value: mockVolunteers.reduce((s, v) => s + v.creditPoints, 0), icon: Star, color: "text-warning" },
];

const recentEmergencies = [
  { id: 1, user: "Patient A", volunteer: "Dr. Priya Sharma", status: "Completed", time: "10 min ago" },
  { id: 2, user: "Patient B", volunteer: "Rajesh Kumar", status: "Completed", time: "25 min ago" },
  { id: 3, user: "Patient C", volunteer: "Dr. Anita Patel", status: "In Progress", time: "2 min ago" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto max-w-md flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Emergencies */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
            Recent Emergencies
          </h2>
          <div className="space-y-2">
            {recentEmergencies.map((e) => (
              <div key={e.id} className="glass-card flex items-center justify-between rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{e.user}</p>
                  <p className="text-xs text-muted-foreground">Attended by {e.volunteer}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={e.status === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}
                  >
                    {e.status}
                  </Badge>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Volunteers */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
            Top Volunteers
          </h2>
          <div className="space-y-2">
            {[...mockVolunteers]
              .sort((a, b) => b.creditPoints - a.creditPoints)
              .slice(0, 3)
              .map((v, i) => (
                <div key={v.id} className="glass-card flex items-center gap-3 rounded-xl p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-xs font-bold text-warning">
                    {i + 1}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {v.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.role}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {v.creditPoints}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

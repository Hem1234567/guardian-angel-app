import { Link, useLocation } from "react-router-dom";
import { HeartPulse, UserPlus, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/", label: "SOS", icon: HeartPulse },
  { to: "/register", label: "Register", icon: UserPlus },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                active
                  ? "text-emergency"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

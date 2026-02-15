import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Stethoscope, HeartPulse, Pill, FlaskConical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const roles = [
  { value: "Doctor", label: "Doctor", icon: Stethoscope },
  { value: "Nurse", label: "Nurse", icon: HeartPulse },
  { value: "Pharmacist", label: "Pharmacist", icon: Pill },
  { value: "Compounder", label: "Compounder", icon: FlaskConical },
] as const;

const Register = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", role: "", specialty: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.role) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "✅ Registration successful!", description: "You are now a registered medical volunteer." });
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pb-20 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {form.name}!</h2>
          <p className="mt-2 text-muted-foreground">You're now registered as a <strong>{form.role}</strong></p>
          <p className="mt-1 text-sm text-muted-foreground">You'll receive emergency calls from nearby patients.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">
            Register Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto max-w-md flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Volunteer Registration</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Dr. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Medical Role *</Label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    form.role === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty (Optional)</Label>
            <Input
              id="specialty"
              placeholder="e.g. Emergency Medicine"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground" size="lg">
            Register as Volunteer
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;

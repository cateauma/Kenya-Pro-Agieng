import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Get in touch with our team</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <form className="stat-card space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label>Name</Label>
            <Input placeholder="Your name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea placeholder="How can we help?" rows={4} />
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "info@kpao.or.ke" },
            { icon: Phone, label: "Phone", value: "+254 700 123 456" },
            { icon: MapPin, label: "Address", value: "Nairobi, Kenya" },
          ].map((item) => (
            <div key={item.label} className="stat-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

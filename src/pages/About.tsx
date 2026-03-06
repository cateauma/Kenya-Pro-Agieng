import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Heart, Users, Globe, Award } from "lucide-react";

export default function About() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">About Us</h1>
        <p className="page-subtitle">Kenya Pro Aging Organization</p>
      </div>
      <div className="max-w-3xl space-y-6">
        <div className="stat-card">
          <p className="text-sm leading-relaxed">
            Kenya Pro Aging Organization (KPAO) is dedicated to improving the quality of life for elderly citizens across Kenya. 
            We coordinate care services, connect beneficiaries with resources, and build a community of support through volunteers, 
            donors, and professional caregivers.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Heart, title: "Our Mission", text: "To provide dignified, accessible care and support for every elderly person in Kenya." },
            { icon: Users, title: "Community", text: "Over 200 volunteers, 50 caregivers, and 140+ beneficiaries across the country." },
            { icon: Globe, title: "Reach", text: "Operating in Nairobi, Mombasa, Kisumu, Nakuru, and expanding to more counties." },
            { icon: Award, title: "Impact", text: "Partnered with Inua Jamii and local saccos to deliver financial and health services." },
          ].map((item) => (
            <div key={item.title} className="stat-card">
              <item.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

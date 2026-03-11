import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Heart, Utensils } from "lucide-react";

const notifications = [
  { icon: Utensils, title: "Meal delivery scheduled", message: "Your Tuesday meal delivery is confirmed for 10:00 AM", time: "1 hour ago", unread: true },
  { icon: Calendar, title: "Appointment reminder", message: "Health check-up with Dr. Ochieng on March 15 at 2:00 PM", time: "3 hours ago", unread: true },
  { icon: Heart, title: "Service update", message: "New counseling session available — group therapy on March 18", time: "Yesterday", unread: true },
  { icon: Bell, title: "Home visit completed", message: "Mary completed your home visit. Notes have been updated.", time: "Yesterday", unread: false },
  { icon: Bell, title: "Clothing distribution", message: "You received 3 items from the March distribution drive", time: "Mar 2", unread: false },
];

export default function Notifications() {
  return (
    <DashboardLayout>
      <PageWrapper title="Notifications" subtitle="Stay updated on your services">
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <Card key={i} className={`hover:shadow-sm transition-shadow ${n.unread ? "border-primary/30 bg-primary/5" : ""}`}>
              <CardContent className="flex items-start gap-3 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <n.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {n.unread && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}

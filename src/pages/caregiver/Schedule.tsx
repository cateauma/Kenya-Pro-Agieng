import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";

const schedule = [
  { time: "8:00 AM", task: "Morning check", beneficiary: "Mama Wambui", location: "Westlands", type: "Visit" },
  { time: "10:00 AM", task: "Meal delivery", beneficiary: "Eastlands route (5 stops)", location: "Eastlands", type: "Delivery" },
  { time: "12:00 PM", task: "Medication reminder", beneficiary: "Mr. Otieno", location: "Kibera", type: "Alert" },
  { time: "2:00 PM", task: "Afternoon visit", beneficiary: "Mrs. Njoroge", location: "Karen", type: "Visit" },
  { time: "3:30 PM", task: "Vital signs check", beneficiary: "Mama Njeri", location: "Langata", type: "Health" },
  { time: "5:00 PM", task: "End-of-day report", beneficiary: "—", location: "Office", type: "Admin" },
];

export default function Schedule() {
  return (
    <DashboardLayout>
      <PageWrapper title="Today's Schedule" subtitle="Your daily tasks and visits">
        <div className="space-y-3">
          {schedule.map((item, i) => (
            <Card key={i} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-semibold text-primary">{item.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.task}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{item.beneficiary}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{item.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}

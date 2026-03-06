import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Star } from "lucide-react";

export default function Feedback() {
  const [rating, setRating] = useState(0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Feedback</h1>
        <p className="page-subtitle">Help us improve our services</p>
      </div>
      <form className="stat-card max-w-lg space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label>How would you rate your experience?</Label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <Star className={`h-8 w-8 transition-colors ${star <= rating ? "fill-secondary text-secondary" : "text-muted"}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Your feedback</Label>
          <Textarea placeholder="Tell us what you think..." rows={4} />
        </div>
        <Button className="w-full">Submit Feedback</Button>
      </form>
    </DashboardLayout>
  );
}

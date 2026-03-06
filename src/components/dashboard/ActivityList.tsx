interface Activity {
  id: string;
  text: string;
  time: string;
  type: "info" | "success" | "warning";
}

interface ActivityListProps {
  title: string;
  activities: Activity[];
}

export function ActivityList({ title, activities }: ActivityListProps) {
  const dotColor = {
    info: "bg-info",
    success: "bg-success",
    warning: "bg-warning",
  };

  return (
    <div className="stat-card">
      <h3 className="section-title">{title}</h3>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${dotColor[a.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{a.text}</p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

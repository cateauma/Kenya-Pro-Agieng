import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

const searchableItems = [
  { title: "Meal Distribution Program", category: "Program", description: "Weekly meal deliveries to elderly beneficiaries" },
  { title: "Health Check-up Schedule", category: "Healthcare", description: "Monthly health monitoring appointments" },
  { title: "Volunteer Training", category: "Event", description: "Orientation for new volunteers" },
  { title: "Inua Jamii Registration", category: "Service", description: "Government social protection enrollment" },
  { title: "Donation Drive — March", category: "Event", description: "Community fundraising event" },
  { title: "Counseling Services", category: "Service", description: "Emotional and financial counseling for beneficiaries" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const filtered = searchableItems.filter(
    (item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Search</h1>
        <p className="page-subtitle">Find programs, services, and events</p>
      </div>
      <div className="max-w-2xl space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.title} className="stat-card cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.category}</span>
              </div>
              <h3 className="font-medium text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
          {query && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No results found for "{query}"</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

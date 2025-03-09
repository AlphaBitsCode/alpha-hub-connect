
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";

// Mock milestones for demo purposes
// In a real app, this would come from the database
const MOCK_MILESTONES = [
  { id: 1, title: "Project Kickoff", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: 2, title: "Design Review", date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
  { id: 3, title: "MVP Release", date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
];

export const ProjectMilestones = () => {
  const [now, setNow] = useState(new Date());
  
  // Update the current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate time remaining
  const getTimeRemaining = (targetDate: Date) => {
    const timeRemaining = targetDate.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return "Past due";
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hr${hours !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  };
  
  // Sort milestones by date (closest first)
  const sortedMilestones = [...MOCK_MILESTONES].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <Card className="glass-card border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center">
          <CalendarClock className="mr-2 h-5 w-5 text-alphabits-teal" /> Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMilestones.map((milestone) => (
            <div key={milestone.id} className="flex flex-col p-3 rounded-md bg-white/5">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-alphabits-teal rounded-full mr-2 flex-shrink-0" />
                  <span className="text-white font-medium">{milestone.title}</span>
                </div>
                <span className="text-xs text-white/70">
                  {milestone.date.toLocaleDateString()}
                </span>
              </div>
              <div className="ml-5 mt-1 text-sm text-alphabits-teal font-medium">
                {getTimeRemaining(milestone.date)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

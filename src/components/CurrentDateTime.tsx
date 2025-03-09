
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const CurrentDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="glass-card border-white/20">
      <CardContent className="flex items-center py-4">
        <Clock className="text-alphabits-teal h-5 w-5 mr-2" />
        <div>
          <div className="text-white font-medium">{formatDate(dateTime)}</div>
          <div className="text-white/70 text-sm">{formatTime(dateTime)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

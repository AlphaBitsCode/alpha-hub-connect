
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Github, FileSpreadsheet, Milestone } from "lucide-react";

interface JournalEntry {
  id: string;
  type: 'github' | 'sheet' | 'milestone';
  date: string;
  title: string;
  description: string;
  author?: string;
}

export const ProjectJournal = () => {
  // Sample data - in a real app, this would come from API
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      type: 'github',
      date: '2023-07-15T14:30:00Z',
      title: 'Initial commit',
      description: 'Initial project structure and setup',
      author: 'John Doe'
    },
    {
      id: '2',
      type: 'sheet',
      date: '2023-07-16T10:15:00Z',
      title: 'Updated timeline',
      description: 'Added new milestones to project timeline',
      author: 'Jane Smith'
    },
    {
      id: '3',
      type: 'milestone',
      date: '2023-07-18T09:00:00Z',
      title: 'Phase 1 Complete',
      description: 'All tasks for initial phase have been completed',
      author: 'Project Team'
    },
    {
      id: '4',
      type: 'github',
      date: '2023-07-20T16:45:00Z',
      title: 'Feature implementation',
      description: 'Implemented user authentication and dashboard',
      author: 'John Doe'
    },
    {
      id: '5',
      type: 'sheet',
      date: '2023-07-22T11:30:00Z',
      title: 'Budget update',
      description: 'Updated project budget allocation for Q3',
      author: 'Jane Smith'
    }
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-5 w-5 text-white" />;
      case 'sheet':
        return <FileSpreadsheet className="h-5 w-5 text-white" />;
      case 'milestone':
        return <Milestone className="h-5 w-5 text-white" />;
      default:
        return <Calendar className="h-5 w-5 text-white" />;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'github':
        return 'bg-purple-500/20 border-purple-500/30';
      case 'sheet':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'milestone':
        return 'bg-green-500/20 border-green-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Project Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20 z-0"></div>
          
          {/* Journal entries */}
          <div className="space-y-6">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="relative pl-12">
                {/* Timeline node */}
                <div className={`absolute left-0 p-2 rounded-full z-10 ${getTypeColor(entry.type)}`}>
                  {getIcon(entry.type)}
                </div>
                
                {/* Entry content */}
                <div className={`p-4 rounded-lg ${getTypeColor(entry.type)}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">{entry.title}</h4>
                    <span className="text-white/70 text-sm">{formatDate(entry.date)}</span>
                  </div>
                  <p className="text-white/80 mb-2">{entry.description}</p>
                  {entry.author && (
                    <p className="text-white/60 text-sm">By: {entry.author}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

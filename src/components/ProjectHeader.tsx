
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectHeaderProps {
  projectName: string;
  clientName: string;
  status: string | null;
}

export const ProjectHeader = ({ projectName, clientName, status }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300";
      case "At Risk":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Completed":
        return <div className="h-4 w-4 bg-green-500 rounded-full"></div>;
      case "At Risk":
        return <div className="h-4 w-4 bg-red-500 rounded-full"></div>;
      default:
        return <div className="h-4 w-4 bg-blue-500 rounded-full"></div>;
    }
  };

  return (
    <>
      {/* Back button and edit */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        
        <Button
          variant="outline"
          className="glass border-white/20 text-white hover:bg-white/10"
          onClick={() => navigate(`/projects/edit/${projectName}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Project Settings
        </Button>
      </div>
      
      {/* Project header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-4xl font-bold text-white">{projectName}</h1>
          <Badge 
            className={`mt-2 md:mt-0 flex items-center gap-1 px-3 py-1 ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            <span>{status}</span>
          </Badge>
        </div>
        <p className="text-white/70 mt-1 text-lg">Client: {clientName}</p>
      </div>
    </>
  );
};

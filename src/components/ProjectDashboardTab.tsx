
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  HelpCircle, 
  FileSpreadsheet, 
  Edit,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectDashboardTabProps {
  projectId: string;
  googleSheetId: string | null;
}

export const ProjectDashboardTab = ({ projectId, googleSheetId }: ProjectDashboardTabProps) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-alphabits-darkblue/95' : ''}`}>
      {googleSheetId ? (
        <Card className={`glass-card border-white/20 overflow-hidden ${isFullscreen ? 'h-full' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Google Sheet</CardTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => window.open('https://support.google.com/docs/answer/183965?hl=en&co=GENIE.Platform%3DDesktop', '_blank')}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      To embed your Google Sheet, publish it to the web first. Click "File" {'>'}  "Share" {'>'} "Publish to web" in Google Sheets, then copy the Sheet ID.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <div className={`${isFullscreen ? 'h-[calc(100%-4rem)]' : 'aspect-[4/3]'} w-full`}>
            <iframe
              src={`${googleSheetId}`}
              className="w-full h-full border-0"
              title="Project Dashboard"
            ></iframe>
          </div>
        </Card>
      ) : (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Dashboard</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => window.open('https://support.google.com/docs/answer/183965?hl=en&co=GENIE.Platform%3DDesktop', '_blank')}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      To embed your Google Sheet, publish it to the web first. Click "File" {'>'}  "Share" {'>'} "Publish to web" in Google Sheets, then copy the Sheet ID.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileSpreadsheet className="h-16 w-16 text-white/30 mb-4" />
            <p className="text-white/70 mb-4">No dashboard has been connected to this project yet.</p>
            <Button
              variant="outline"
              className="glass border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate(`/projects/edit/${projectId}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Connect Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
      
      {isFullscreen && (
        <Button
          variant="outline"
          className="fixed top-4 right-4 glass border-white/20 text-white hover:bg-white/10"
          onClick={toggleFullscreen}
        >
          <Minimize2 className="mr-2 h-4 w-4" /> Exit Fullscreen
        </Button>
      )}
    </div>
  );
};


import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Folder, 
  MessageCircle, 
  Plus, 
  Users 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, John Doe</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-alphabits-purple hover:bg-alphabits-purple/90">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">12</span>
                    <Folder className="h-5 w-5 text-alphabits-purple" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">24</span>
                    <Users className="h-5 w-5 text-alphabits-purple" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">5</span>
                    <Clock className="h-5 w-5 text-alphabits-purple" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Unread Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">18</span>
                    <MessageCircle className="h-5 w-5 text-alphabits-purple" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Projects</CardTitle>
                      <Button variant="ghost" size="sm" className="text-alphabits-purple">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Website Redesign", client: "Tech Corp", progress: 75 },
                        { name: "Mobile App Development", client: "StartUp Inc", progress: 45 },
                        { name: "Marketing Campaign", client: "Brand Solutions", progress: 90 },
                        { name: "E-commerce Platform", client: "Retail Group", progress: 30 },
                      ].map((project, i) => (
                        <div key={i} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-2 h-10 bg-alphabits-purple rounded-full mr-4"></div>
                          <div className="flex-1">
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.client}</p>
                          </div>
                          <div className="w-24">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-alphabits-purple h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">{project.progress}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Activity and Calendar */}
              <div className="space-y-6">
                {/* Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "Added new task", project: "Marketing Campaign", time: "2h ago" },
                        { action: "Commented on", project: "Website Redesign", time: "4h ago" },
                        { action: "Completed milestone", project: "Mobile App", time: "Yesterday" },
                        { action: "Scheduled meeting", project: "E-commerce", time: "Yesterday" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start">
                          <div className="h-2 w-2 mt-2 rounded-full bg-alphabits-purple mr-3"></div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{activity.action}</span>{" "}
                              <span className="text-gray-600">{activity.project}</span>
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Calendar Preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Calendar</CardTitle>
                      <Button variant="ghost" size="sm" className="text-alphabits-purple">
                        <Calendar className="h-4 w-4 mr-1" /> Full Calendar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { event: "Weekly Team Meeting", time: "10:00 AM", day: "Today" },
                        { event: "Client Presentation", time: "2:30 PM", day: "Today" },
                        { event: "Project Deadline", time: "11:59 PM", day: "Tomorrow" },
                        { event: "Strategy Planning", time: "9:00 AM", day: "Jun 15" },
                      ].map((event, i) => (
                        <div key={i} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                          <div className="w-12 h-12 bg-alphabits-purple/10 rounded flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-alphabits-purple">{event.day}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{event.event}</h4>
                            <p className="text-xs text-gray-500">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

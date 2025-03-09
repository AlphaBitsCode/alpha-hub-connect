
import { AlphaBitsSidebar } from "@/components/AlphaBitsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  MoreHorizontal,
  FolderOpen,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Project Manager",
      email: "john.doe@alphabits.team",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      avatar: "JD",
      projects: 5,
      department: "Management"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "UI/UX Designer",
      email: "jane.smith@alphabits.team",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      avatar: "JS",
      projects: 3,
      department: "Design"
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "Senior Developer",
      email: "michael.j@alphabits.team",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      avatar: "MJ",
      projects: 7,
      department: "Development"
    },
    {
      id: 4,
      name: "Emily Wilson",
      role: "Content Strategist",
      email: "emily.w@alphabits.team",
      phone: "+1 (555) 789-0123",
      location: "Chicago, IL",
      avatar: "EW",
      projects: 2,
      department: "Marketing"
    },
    {
      id: 5,
      name: "Robert Chen",
      role: "Backend Developer",
      email: "robert.c@alphabits.team",
      phone: "+1 (555) 234-5678",
      location: "Seattle, WA",
      avatar: "RC",
      projects: 4,
      department: "Development"
    },
    {
      id: 6,
      name: "Sarah Miller",
      role: "Product Manager",
      email: "sarah.m@alphabits.team",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles, CA",
      avatar: "SM",
      projects: 6,
      department: "Management"
    },
    {
      id: 7,
      name: "David Brown",
      role: "QA Engineer",
      email: "david.b@alphabits.team",
      phone: "+1 (555) 456-7891",
      location: "Denver, CO",
      avatar: "DB",
      projects: 5,
      department: "Development"
    },
    {
      id: 8,
      name: "Lisa Anderson",
      role: "Marketing Specialist",
      email: "lisa.a@alphabits.team",
      phone: "+1 (555) 567-8912",
      location: "Miami, FL",
      avatar: "LA",
      projects: 3,
      department: "Marketing"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="flex flex-1 w-full">
        <AlphaBitsSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team</h1>
                <p className="text-gray-500">Manage your team members</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-alphabits-purple hover:bg-alphabits-purple/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Team Member
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search team members..." 
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>

            {/* Team Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Members</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamMembers.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="management" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamMembers
                    .filter(m => m.department === "Management")
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="development" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamMembers
                    .filter(m => m.department === "Development")
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamMembers
                    .filter(m => m.department === "Design")
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="marketing" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {teamMembers
                    .filter(m => m.department === "Marketing")
                    .map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member }: { member: any }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-0 pt-6 flex flex-row items-start justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-alphabits-purple flex items-center justify-center text-white text-sm font-medium mr-3">
            {member.avatar}
          </div>
          <div>
            <CardTitle className="text-base">{member.name}</CardTitle>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" /> Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="h-4 w-4 mr-2" /> Call
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" /> Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" /> Schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 truncate">{member.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{member.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{member.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <FolderOpen className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{member.projects} Projects</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Team;

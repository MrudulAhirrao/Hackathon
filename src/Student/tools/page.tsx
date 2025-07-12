import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "../components/student-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  BookOpenIcon,
  BrainIcon,
  FileTextIcon,
  LightbulbIcon,
  FlaskConicalIcon,
  CalendarCheckIcon,
  ShieldCheckIcon,
} from "lucide-react";

const tools = [
  {
    name: "Roadmap Generator",
    description: "Create personalized learning paths.",
    icon: <SparklesIcon className="w-6 h-6 text-blue-500" />,
    path: "./learningpath/page",
  },
  {
    name: "Study Suggestions",
    description: "AI-powered study strategies.",
    icon: <BookOpenIcon className="w-6 h-6 text-green-500" />,
    path: "./learningpath/page",
  },
  {
    name: "Interview Question Generator",
    description: "Get tailored interview questions.",
    icon: <BrainIcon className="w-6 h-6 text-orange-500" />,
    path: "/Student/tools/interview-question-generator",
  },
  {
    name: "MCQ from PDF/Document",
    description: "Extract MCQs from your study files.",
    icon: <FileTextIcon className="w-6 h-6 text-purple-500" />,
    path: "./tools/allTools/mcqmaker/page",
  },
  {
    name: "Research Topic Recommender",
    description: "Find topics for your next paper.",
    icon: <LightbulbIcon className="w-6 h-6 text-indigo-500" />,
    path: "./research/page",
  },
  {
    name: "AI Research Paper Generator",
    description: "Let AI help write your research.",
    icon: <FlaskConicalIcon className="w-6 h-6 text-red-500" />,
    path: "./tools/allTools/aipapercreator/page",
  },
  {
    name: "Conference Finder",
    description: "Search upcoming academic events.",
    icon: <CalendarCheckIcon className="w-6 h-6 text-teal-500" />,
    path: "./tools/allTools/conferencefinder/page",
  },
  {
    name: "Online Proctored Tests",
    description: "Take monitored online exams.",
    icon: <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />,
    path: "./tools/allTools/onlineproctortest/page",
  },
];

export default function ToolsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <StudentSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🛠 Tools Library</h1>
          <p className="text-muted-foreground">
            Explore powerful tools designed to boost your productivity and learning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {tools.map((tool, index) => (
                <Link to={`/Student${tool.path.replace('./', '/')}`} className="block" key={index}>
                <Card className="hover:shadow-lg transition-transform hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                    {tool.icon}
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {tool.description}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

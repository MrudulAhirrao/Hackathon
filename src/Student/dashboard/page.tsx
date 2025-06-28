import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "../components/student-sidebar";
import { SiteHeader } from "@/Admin/components/site-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wand2Icon,
  SearchIcon,
  StarIcon,
  SparklesIcon,
  MessageSquareIcon,
} from "lucide-react";

const aiTools = [
  {
    category: "🎓 Career & Learning",
    tools: ["Roadmap Generator", "Study Suggestions", "Interview Question Generator",],
  },
  {
    category: "📄 Question Generator",
    tools: ["MCQ from PDF/Document"],
  },
  {
    category: "🤖 AI Tools",
    tools: ["Research Topic Recommender","AI Research Paper Generator"],
  },
  {
    category: "📅 Event Discovery",
    tools: ["Conference Finder"],
  },
  {
    category: "🛡 Testing Suite",
    tools: ["Online Proctored Tests"],
  },
  {
    category: "⚙ Developer Tools",
    tools: [
      "Public API Suite for Roadmaps",
      "MCQ Generator API",
      "Paper Writing API",
      "Research Paper Generator API",
    ],
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [recentTools] = useState([
    "MCQ from PDF/Document",
    "Research Topic Recommender",
  ]);

  const filteredTools = aiTools
    .map((section) => ({
      ...section,
      tools: section.tools.filter((tool) =>
        tool.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.tools.length > 0);

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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🤖 AI Tools Dashboard
            <SparklesIcon className="w-5 h-5 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground">
            Explore smart tools to boost your learning, testing, and development journey.
          </p>

          {/* Search */}
          <div className="flex items-center gap-2 mt-4">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md"
            />
          </div>

          {/* Recently Used */}
          {recentTools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-8 mb-2 flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500" /> Recently Used
              </h3>
              <div className="flex gap-2 flex-wrap">
                {recentTools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tool Count */}
          <div className="text-muted-foreground text-sm mt-2">
            Showing {filteredTools.reduce((acc, curr) => acc + curr.tools.length, 0)} tools
          </div>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((section, index) => (
              <Card
                key={index}
                className="transition-all hover:scale-[1.015] hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{section.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.tools.map((tool, i) => (
                    <Link
                      key={i}
                      to={`/Student/tools/${tool.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-sm text-primary hover:underline transition-all"
                    >
                      • {tool}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Utility Section */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">✨ Other Smart Utilities</h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="secondary" className="flex items-center gap-2">
                <Wand2Icon className="w-4 h-4" /> Ask a Doubt
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <MessageSquareIcon className="w-4 h-4" /> Join Community Forum
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
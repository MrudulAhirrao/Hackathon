import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const paperTypes = [
  { label: "Research", value: "research" },
  { label: "Survey", value: "survey" },
  { label: "Review", value: "review" },
];

const formats = [
  { label: "IEEE", value: "ieee" },
  { label: "Springer", value: "springer" },
  { label: "Elsevier", value: "elsevier" },
  { label: "General", value: "general" },
];

export default function CreatePaper() {
  const [paperType, setPaperType] = useState("research");
  const [paperFormat, setPaperFormat] = useState("ieee");
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    console.log({ topic, paperType, paperFormat });
    navigate("/Student/tools/allTools/aipapercreator/page");
  };

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
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              📝 Create a New Research Paper
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Select your paper type, format, and topic — we’ll generate everything for you.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Panel */}
            <div className="space-y-6">
              {/* Paper Type */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Select Paper Type</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {paperTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={paperType === type.value ? "default" : "outline"}
                      onClick={() => setPaperType(type.value)}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      {type.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Format Selection */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Choose Format / Journal</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {formats.map((format) => (
                    <Button
                      key={format.value}
                      variant={paperFormat === format.value ? "default" : "outline"}
                      onClick={() => setPaperFormat(format.value)}
                      className="rounded-xl w-full sm:w-auto"
                    >
                      {format.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Your Topic or Problem Statement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    placeholder="e.g. Ethical Concerns in AI-Generated Art"
                    className="rounded-xl text-base"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Be as specific as you want. This helps the AI give more accurate structure.
                  </p>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <div className="pt-2">
                <Link to="/Student/tools/allTools/aipapercreator/prompt/paper">
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim()}
                  className={cn(
                    "w-full py-6 text-base font-medium rounded-xl transition duration-300",
                    "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                  )}
                >
                  🚀 Generate Paper with AI Magic
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

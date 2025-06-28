import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Rocket, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResearchPaperGenerator() {
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

        <div className="p-6 space-y-6">
          {/* Welcome */}
          <div className="text-2xl font-semibold">
            👋 Welcome back, Researcher!
          </div>
          <p className="text-muted-foreground text-sm">
            Your research journey continues. Let’s create something impactful
            today.
          </p>

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted p-4 text-center">
              <div className="text-2xl font-bold text-primary">5</div>
              <p className="text-sm text-muted-foreground mt-1">
                Papers Created
              </p>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <div className="text-2xl font-bold text-primary">91%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avg. Grammar Score
              </p>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <div className="text-2xl font-bold text-primary">4%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avg. Plagiarism Risk
              </p>
            </Card>
            <Card className="bg-muted p-4 text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground mt-1">
                Papers This Week
              </p>
            </Card>
          </div>

          {/* ✅ Create New Paper Button */}
          <div className="flex justify-between items-center mt-8">
            <h2 className="text-xl font-bold">📁 Recent Papers</h2>
            <Link to="/Student/tools/allTools/aipapercreator/prompt/page">
              <Button className="rounded-xl text-base">
                + Create New Research Paper
              </Button>
            </Link>
          </div>

          {/* Recent Papers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((paper) => (
              <Card
                key={paper}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle>AI in Healthcare (Survey)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Format: IEEE
                  </div>
                  <div className="text-sm mt-1">Created: June 25</div>
                  <div className="mt-2 space-x-2">
                    <Badge variant="secondary">Grammar: 91%</Badge>
                    <Badge>Plagiarism: 3%</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 🏆 Achievements with Creative Text */}
          <h2 className="text-xl font-bold mt-10 mb-2">
            🏆 Your Research Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted p-4 flex items-center gap-4">
              <Trophy className="text-yellow-500" />
              <div>
                <div className="font-semibold">✨ First Paper Unlocked</div>
                <p className="text-sm text-muted-foreground">
                  You’ve taken your first step into the academic world — one
                  paper at a time!
                </p>
              </div>
            </Card>
            <Card className="bg-muted p-4 flex items-center gap-4">
              <Rocket className="text-orange-500" />
              <div>
                <div className="font-semibold">🚀 5+ Papers Created</div>
                <p className="text-sm text-muted-foreground">
                  You’re not just writing — you’re launching ideas into the
                  world!
                </p>
              </div>
            </Card>
            <Card className="bg-muted p-4 flex items-center gap-4">
              <ShieldCheck className="text-green-600" />
              <div>
                <div className="font-semibold">🧠 Grammar Master</div>
                <p className="text-sm text-muted-foreground">
                  Your writing is sharp — consistently scoring above 90% in
                  grammar!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

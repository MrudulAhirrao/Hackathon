import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function PaperContent() {
  const [activeTab, setActiveTab] = useState("abstract");

  const paperSections = [
    { id: "abstract", title: "📘 Abstract" },
    { id: "introduction", title: "📚 Introduction" },
    { id: "methodology", title: "🧪 Methodology" },
    { id: "results", title: "📈 Results" },
    { id: "conclusion", title: "🧠 Conclusion" },
    { id: "references", title: "🔗 References" },
  ];

  const [sectionText, setSectionText] = useState({
    abstract: "This paper explores blockchain-based voting in India...",
    introduction: "Voting systems are crucial to democratic processes...",
    methodology: "We propose a hybrid blockchain model using Ethereum...",
    results: "Testing showed improved security and lower fraud risk...",
    conclusion: "Blockchain has potential to revolutionize voting...",
    references: "[1] Nakamoto, S. Bitcoin: A peer-to-peer electronic cash system...",
  });

  const PreviewPanel = () => (
    <div className="prose max-w-none bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-2xl font-bold mb-4">📄 Live Paper Preview</h2>
      {paperSections.map((section) => (
        <div key={section.id} className="mb-4">
          <h3 className="text-xl font-semibold">{section.title}</h3>
          <p>{sectionText[section.id as keyof typeof sectionText]}</p>
        </div>
      ))}
    </div>
  );

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

        {/* Header Info */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold">📝 Blockchain Voting System in India</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Paper Type: Research | Format: IEEE
          </p>
        </div>

        {/* Split Layout for Editor & Preview */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="flex flex-wrap gap-2">
                {paperSections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id}>
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {paperSections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <Card className="shadow-md mt-4">
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        rows={10}
                        value={sectionText[section.id as keyof typeof sectionText]}
                        onChange={(e) =>
                          setSectionText((prev) => ({
                            ...prev,
                            [section.id]: e.target.value,
                          }))
                        }
                        className="text-base rounded-xl"
                      />

                      <div className="grid gap-2">
                        <Label>Add Image</Label>
                        <Input type="file" accept="image/*" />
                        <Textarea placeholder="Add caption or reference below image..." rows={2} />
                      </div>

                      <div className="grid gap-2">
                        <Label>Embed Chart / Video Link</Label>
                        <Input type="url" placeholder="https://your-embed-url.com" />
                        <Textarea placeholder="Explain this chart or video..." rows={2} />
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button variant="outline">💬 Ask AI</Button>
                        <Button variant="outline">🔄 Regenerate</Button>
                        <Button variant="outline">📄 Cite</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <PreviewPanel />
        </div>

        {/* Export Button */}
        <div className="px-6 pb-8 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-6 py-3 text-base bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                📤 Export Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>📊 Final Review Before Export</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>✅ Grammar Score: 92%</p>
                <p>🔍 Plagiarism Risk: 12%</p>
                <p>🤖 AI-generated: 78% | User-edited: 22%</p>
                <p>🔗 References Valid: 5 / 6</p>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 text-white">✅ Confirm & Export</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

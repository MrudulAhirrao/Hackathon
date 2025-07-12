import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";

export default function InterviewQuestionPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
  if (!jobTitle.trim()) return;
  setLoading(true);
  setGeneratedQuestions([]);

  try {
    const res = await fetch("http://localhost:8000/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ job_title: jobTitle }),
    });

    const data = await res.json();
    setGeneratedQuestions(data.questions || []);
  } catch (err) {
    console.error("Generation failed:", err);
    setGeneratedQuestions(["Failed to generate questions. Please try again."]);
  } finally {
    setLoading(false);
  }
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
        <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-100 min-h-screen">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Question Generator</h1>
              <p className="text-gray-600">
                Enter a job role and get AI-generated interview questions to help you practice.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter job title (e.g. React Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="bg-white shadow p-6 rounded-lg border space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">Suggested Questions:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {generatedQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

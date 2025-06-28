import { useState, useRef } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/Admin/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, SendHorizonal, Trash2 } from "lucide-react"
import { TeacherSidebar } from "../components/teacher-sidebar"

// Extend the Window interface to include SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function TeacherLearnPath() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef<any>(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setLoading(true)

    // Simulate generation
    setTimeout(() => {
      setResponse(
        `🧠 Here's a learning roadmap for: "${prompt}"\n\n1. Start with basic concepts\n2. Explore core topics\n3. Practice with projects\n4. Take certifications\n5. Apply knowledge in real world`
      )
      setLoading(false)
    }, 1200)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition.")
      return
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = "en-US"
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setPrompt(transcript)
      }
    }

    recognitionRef.current.start()
  }

  const handleClear = () => {
    setPrompt("")
    setResponse("")
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <TeacherSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col items-center justify-start p-8 gap-8">
          <h1 className="text-3xl font-bold text-center">
            🎯 AI Learning Path Generator
          </h1>
          <p className="text-muted-foreground text-center max-w-xl">
            Describe your learning goals and get a personalized roadmap with
            curated steps and resources.
          </p>

          <Card className="w-full max-w-3xl shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Example: I want to master JavaScript from scratch"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" variant="outline" onClick={handleVoiceInput}>
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                >
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>

              {response && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-primary">
                    Generated Roadmap
                  </h2>
                  <Textarea
                    value={response}
                    readOnly
                    className="bg-muted/40 border-muted text-sm h-60 overflow-y-auto resize-none rounded-md shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleClear}
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { useState, useRef } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/Admin/components/site-header"
import { StudentSidebar } from "../components/student-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, SendHorizonal, Trash2 } from "lucide-react"
import constants from "@/constant/contstant.json"
import apiCall from "@/lib/apicall"
import { toast } from "sonner"
import { convertToMarkdown } from "@/lib/utils"
import MarkdownPreview from '@uiw/react-markdown-preview'

export default function ResearchAsst() {
  const [query, setQuery] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef<any>(null)

  const handleGenerate = async() => {
    if (!query.trim()) return
    setLoading(true)

    const body ={
      query:query.trim()
    };
    try{
      const response = await apiCall(constants.baseUrl+"/api/v1/ai/researchPaperFinder","POST",body);
      if (!response.ok) {
        setLoading(false)
        toast.error("Failed to generate summary. Please try again.")
        return
      } 
      const data = await response.json();
      console.log("Response:", data.response);
      setSummary(convertToMarkdown(data.response));
    }catch(error:any){
      console.error("Error generating summary:", error)
      toast.error("There is some error while generating summary. Please try again.")
    }finally {
      setLoading(false);
    }
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
        setQuery(transcript)
      }
    }

    recognitionRef.current.start()
  }

  const handleClear = () => {
    setQuery("")
    setSummary("")
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <StudentSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col items-center justify-start p-8 gap-8">
          <h1 className="text-3xl font-bold text-center">
            🔍 Research Assistant
          </h1>
          <p className="text-muted-foreground text-center max-w-xl">
            Enter your research topic to get a summarized overview and key highlights.
          </p>

          <Card className={`w-full max-w-3xl shadow-xl ${summary?'top-div':''}`}>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Example: Impact of AI on modern education"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" variant="outline" onClick={handleVoiceInput}>
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleGenerate}
                  disabled={loading || !query.trim()}
                >
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>

              {summary && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-primary">
                    Generated Summary
                  </h2>
                  {/* <Textarea
                    value={summary}
                    readOnly
                    className="bg-muted/40 border-muted text-sm h-60 overflow-y-auto resize-none rounded-md shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0"
                  /> */}
                  <MarkdownPreview 
                    source={summary}
                    className="bg-muted/40 border-muted text-sm h-60 overflow-y-auto resize-none rounded-md shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 inner-div"
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

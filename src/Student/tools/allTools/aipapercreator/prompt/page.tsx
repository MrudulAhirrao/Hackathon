"use client";

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Wand2, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interface Definitions ---

interface PaperType {
  value: string;
  label: string;
  columns: "1" | "2" | "both";
  description: string;
}

interface Format {
  value: string;
  label: string;
  defaultColumns: "1" | "2";
  description: string;
}

interface Config {
  paperType: string;
  paperFormat: string;
  topic: string;
  columnLayout: "1" | "2";
}


const PAPER_TYPES: PaperType[] = [
  { value: "research", label: "Research Paper", columns: "both", description: "Original research with methodology and findings" },
  { value: "survey", label: "Survey Paper", columns: "both", description: "Comprehensive overview of existing research" },
  { value: "review", label: "Review Paper", columns: "both", description: "Critical analysis of literature in a field" },
  { value: "conference", label: "Conference Paper", columns: "2", description: "Short paper for conference presentation" },
  { value: "journal", label: "Journal Article", columns: "both", description: "Detailed research for journal publication" },
  { value: "thesis", label: "Thesis/Dissertation", columns: "1", description: "Extended academic work for degree completion" }
];

const FORMATS: Format[] = [
  { value: "ieee", label: "IEEE Format", defaultColumns: "2", description: "Institute of Electrical and Electronics Engineers" },
  { value: "springer", label: "Springer Format", defaultColumns: "2", description: "Springer Nature publication format" },
  { value: "acm", label: "ACM Format", defaultColumns: "2", description: "Association for Computing Machinery" },
  { value: "apa", label: "APA Format", defaultColumns: "1", description: "American Psychological Association" },
  { value: "mla", label: "MLA Format", defaultColumns: "1", description: "Modern Language Association" },
  { value: "elsevier", label: "Elsevier Format", defaultColumns: "2", description: "Elsevier journal publication format" },
  { value: "general", label: "General Format", defaultColumns: "1", description: "Standard academic paper format" }
];

export default function CreatePaper() {
  const [config, setConfig] = useState<Config>({
    paperType: "",
    paperFormat: "",
    topic: "",
    columnLayout: "1" // Default to 1 column
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Memoized selections for efficiency and clarity
  const selectedPaperType = useMemo(() =>
    PAPER_TYPES.find(p => p.value === config.paperType),
    [config.paperType]
  );

  const selectedFormat = useMemo(() =>
    FORMATS.find(f => f.value === config.paperFormat),
    [config.paperFormat]
  );

  // Determine if column layout is forced by paper type
  const forcedColumns = useMemo(() => {
    if (selectedPaperType && selectedPaperType.columns !== "both") {
      return selectedPaperType.columns;
    }
    return null;
  }, [selectedPaperType]);

  // Handle configuration changes, with logic for column layout adjustments
  const handleConfigChange = useCallback((key: keyof Config, value: string) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };

      if (key === "paperFormat") {
        const format = FORMATS.find(f => f.value === value);
        if (format) {
          // Prioritize forcedColumns, then format default, then "1"
          newConfig.columnLayout = forcedColumns || format.defaultColumns;
        }
      }

      if (key === "paperType") {
        const paperType = PAPER_TYPES.find(p => p.value === value);
        if (paperType) {
          // Prioritize paperType's specific column setting, then selected format default, then "1"
          newConfig.columnLayout = paperType.columns !== "both"
            ? paperType.columns
            : selectedFormat?.defaultColumns || "1";
        }
      }

      // Clear validation errors on any input change
      if (validationErrors.length) {
        setValidationErrors([]);
      }
      return newConfig;
    });
  }, [forcedColumns, selectedFormat, validationErrors.length]);

  // Validate form inputs
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    if (!config.topic.trim()) errors.push("Research Topic is required.");
    if (config.topic.trim().length < 10) errors.push("Research Topic must be at least 10 characters long.");
    if (!config.paperType) errors.push("Paper Type is required.");
    if (!config.paperFormat) errors.push("Paper Format is required.");
    return errors;
  }, [config.topic, config.paperType, config.paperFormat]);

  // Handle paper generation
  // Replace your existing handleGenerate function with this:
const handleGenerate = async () => {
  const errors = validateForm();
  if (errors.length) {
    setValidationErrors(errors);
    return;
  }

  setLoading(true);
  
  try {
    // Call your backend API instead of using mock data
    const response = await fetch('http://localhost:8000/generate-paper/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: config.topic,
        paper_type: config.paperType,
        paper_format: config.paperFormat
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Validate that we received paper data
    if (!result.paper) {
      throw new Error('No paper data received from server');
    }

    // Store the real generated paper data
    sessionStorage.setItem("generatedPaper", JSON.stringify({
      paper: {
        title: config.topic,
        abstract: result.paper.abstract || "Abstract not generated",
        introduction: result.paper.introduction || "Introduction not generated",
        related_work: result.paper.related_work || "Related work not generated",
        methodology: result.paper.methodology || "Methodology not generated",
        results: result.paper.results || "Results not generated",
        conclusion: result.paper.conclusion || "Conclusion not generated",
        references: result.paper.references || "References not generated"
      },
      config,
      timestamp: new Date().toISOString()
    }));

    // Navigate to the paper view page
    navigate("/Student/tools/allTools/aipapercreator/prompt/paper");
    
  } catch (error) {
    console.error('Error generating paper:', error);
    setValidationErrors([
      `Failed to generate paper: ${
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error)
      }. Please check your API key and try again.`
    ]);
  } finally {
    setLoading(false);
  }
};

  // Determine if the generate button should be disabled
  const isGenerateDisabled = useMemo(() => {
    return !config.topic.trim() || config.topic.trim().length < 10 || !config.paperType || !config.paperFormat || loading;
  }, [config.topic, config.paperType, config.paperFormat, loading]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "288px", "--header-height": "96px" } as React.CSSProperties}>
      <StudentSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">AI Research Paper Generator</h1>
              <p className="text-muted-foreground text-lg">
                Configure your paper and let AI generate a full research paper.
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="w-4 h-4 text-blue-700" />
            <AlertDescription className="text-sm text-blue-800">
              Fill out the form below. The AI will generate a formatted research paper based on your inputs.
            </AlertDescription>
          </Alert>

          {/* Fixed Height Validation Errors Container */}
          <div className="min-h-[50px] mb-6">
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please correct the following errors:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Configuration Card */}
          <Card className="bg-white dark:bg-gray-900 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Paper Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Options Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Paper Type Selection */}
                <div className="space-y-2">
                  <label htmlFor="paper-type" className="font-medium text-sm">Paper Type <span className="text-red-500">*</span></label>
                  <Select
                    value={config.paperType}
                    onValueChange={val => handleConfigChange("paperType", val)}
                  >
                    <SelectTrigger id="paper-type" className="w-full h-10">
                      {/* IMPORTANT FIX: Force single line and truncate text within SelectValue */}
                      <SelectValue placeholder="Select paper type" className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAPER_TYPES.map(pt => (
                        <SelectItem key={pt.value} value={pt.value}>
                          <div>
                            <div className="font-medium">{pt.label}</div>
                            <div className="text-xs text-muted-foreground">{pt.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Format Selection */}
                <div className="space-y-2">
                  <label htmlFor="paper-format" className="font-medium text-sm">Format <span className="text-red-500">*</span></label>
                  <Select
                    value={config.paperFormat}
                    onValueChange={val => handleConfigChange("paperFormat", val)}
                  >
                    <SelectTrigger id="paper-format" className="w-full h-10">
                      {/* IMPORTANT FIX: Force single line and truncate text within SelectValue */}
                      <SelectValue placeholder="Select paper format" className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map(f => (
                        <SelectItem key={f.value} value={f.value}>
                          <div>
                            <div className="font-medium">{f.label}</div>
                            <div className="text-xs text-muted-foreground">{f.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Column Layout Selection */}
                <div className="space-y-2">
                  <label htmlFor="column-layout" className="font-medium text-sm">
                    Column Layout
                    {forcedColumns && <Badge variant="secondary" className="ml-2 text-xs">Fixed: {forcedColumns} columns</Badge>}
                  </label>
                  <Select
                    value={forcedColumns || config.columnLayout}
                    onValueChange={(val: "1" | "2") => handleConfigChange("columnLayout", val)}
                    disabled={!!forcedColumns}
                  >
                    <SelectTrigger id="column-layout" className="w-full h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Single Column</SelectItem>
                      <SelectItem value="2">Two Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Research Topic Section - Fixed Height Textarea and character count */}
              <div className="space-y-4">
                <label htmlFor="topic-input" className="font-medium text-sm">Research Topic <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  <Textarea
                    id="topic-input"
                    placeholder="e.g. Blockchain in Education or AI-based Mental Health Diagnostics..."
                    value={config.topic}
                    onChange={(e) => handleConfigChange("topic", e.target.value)}
                    className="h-[120px] w-full resize-none overflow-y-auto"
                    maxLength={1000}
                  />
                  {/* Character count and min length feedback */}
                  <div className="flex items-center justify-between h-5">
                    <p className="text-sm text-muted-foreground">
                      Minimum 10 characters required for generation
                    </p>
                    <p className="text-sm">
                      <span className={cn(
                        "font-medium",
                        config.topic.length < 10 ? "text-red-500" :
                        config.topic.length < 30 ? "text-yellow-500" :
                        "text-green-600"
                      )}>
                        {config.topic.length}
                      </span>
                      <span className="text-muted-foreground"> / 1000 characters</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button Section */}
              <div className="pt-4 border-t">
                <Button
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                >
                  {loading ? (
                    <>
                      <Wand2 className="animate-spin w-5 h-5 mr-2" />
                      Generating Paper...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Research Paper
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
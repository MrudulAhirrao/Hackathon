import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Sparkles, Loader2, Search } from "lucide-react"; // Added Search icon for initial state
import { useState } from "react";
import React from 'react';

// Define interfaces for better type safety
interface Conference {
  acronym: string;
  name: string;
  link: string;
  location: string;
  submission_deadline: string;
  start_date: string;
  topics: string[];
}

// Define static lists for dropdown options
const domains: string[] = [
  "Artificial Intelligence", "Machine Learning", "Blockchain", "Cybersecurity",
  "Cloud Computing", "Data Science", "IoT", "Computer Vision",
  "Natural Language Processing", "Quantum Computing", "Bioinformatics",
  "Software Engineering", "Web Development", "Mobile Computing", "Other",
];

const paperTypes: string[] = [
  "Research Paper", "Survey Paper", "Conference Paper", "Review Paper",
  "Journal Paper", "Thesis/Dissertation",
];

const formats: string[] = [
  "IEEE Format", "Springer Format", "ACM Format", "APA Format",
  "MLA Format", "Elsevier Format", "General Format",
];

export default function ConferenceFinder() {
  // State variables with explicit type annotations
  const [domain, setDomain] = useState<string>("");
  const [paperType, setPaperType] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // New state to track if a search has been performed

  /**
   * Handles the "Find My Conferences" button click.
   * Makes an API call to the backend with selected filters and displays results.
   */
  const handleFindConferences = async (): Promise<void> => {
    // Basic validation: Ensure all dropdowns have a selection
    if (!domain || !paperType || !format) {
      setError("Please select all preferences (Domain, Paper Type, Format) before searching.");
      return;
    }

    setIsLoading(true);
    setConferences([]);
    setError(null);
    setHasSearched(true); // Set to true once a search is initiated

    try {
      const queryParams = new URLSearchParams({
        domain: domain,
        paper_type: paperType,
        format: format,
      }).toString();

      const apiUrl = `http://localhost:8000/scrape/easychair?${queryParams}`;
      console.log("Calling Backend API with URL:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const filteredConferences: Conference[] = await response.json();
      setConferences(filteredConferences);

    } catch (err: unknown) { // Changed 'any' to 'unknown' for stricter type checking
      console.error("Failed to fetch or process conferences:", err);
      let errorMsg = "Failed to load conferences. Please ensure your backend server is running and accessible.";
      if (err instanceof Error) {
        errorMsg = `Failed to load conferences: ${err.message}. Please ensure your backend server is running and accessible.`;
      } else if (typeof err === 'string') { // Handle cases where error might be a string
        errorMsg = `Failed to load conferences: ${err}. Please ensure your backend server is running and accessible.`;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-slate-50 py-12 px-4 text-center rounded-b-2xl border-b border-slate-200">
          <div className="max-w-4xl mx-auto space-y-2">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight flex justify-center items-center gap-2">
              <Sparkles className="text-blue-600" />
              Smart Conference Finder
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              🔍 Discover academic and tech conferences that match your research goals.
            </p>
          </div>
        </section>

        {/* Preferences Selection Card */}
        <section className="max-w-5xl mx-auto mt-10 px-4 md:px-8">
          <Card className="rounded-3xl shadow-xl border bg-white p-6 sm:p-10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 text-center">
                🎓 Select Your Research Preferences
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domain Selection */}
                <div>
                  <Label className="text-sm text-gray-700">Choose Domain</Label>
                  <Select onValueChange={setDomain} value={domain}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="e.g. Artificial Intelligence" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Paper Type Selection */}
                <div>
                  <Label className="text-sm text-gray-700">Choose Paper Type</Label>
                  <Select onValueChange={setPaperType} value={paperType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="e.g. Research Paper" />
                    </SelectTrigger>
                    <SelectContent>
                      {paperTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Format Selection */}
                <div className="md:col-span-2">
                  <Label className="text-sm text-gray-700">Preferred Format</Label>
                  <Select onValueChange={setFormat} value={format}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="e.g. IEEE Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Find Conferences Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  className="w-full md:w-1/2 text-base py-6 font-medium transition-transform hover:scale-105"
                  disabled={!domain || !paperType || !format || isLoading}
                  onClick={handleFindConferences}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "🔍 Find My Conferences"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            💡 Tip: We match your filters with live sources and AI-curated databases.
          </p>

          {/* Dynamic Display Area: Loading, Error, Initial State, or Conferences */}
          <div className="mt-10">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-4 text-lg text-gray-600">Fetching and filtering conferences...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="rounded-3xl shadow-xl border bg-red-50 p-6 text-red-700">
                <CardHeader>
                  <CardTitle className="text-xl">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <p className="mt-2 text-sm">Please ensure your backend server is running and accessible at `http://localhost:8000`.</p>
                </CardContent>
              </Card>
            )}

            {/* Initial State (before any search) */}
            {!isLoading && !error && !hasSearched && (
              <Card className="rounded-3xl shadow-xl border bg-blue-50 p-6 text-blue-700 text-center">
                <CardContent>
                  <Search className="h-8 w-8 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    Select your preferences above and click "Find My Conferences" to begin your search.
                  </p>
                  <p className="mt-2 text-sm">
                    We'll fetch relevant conferences based on your criteria.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Conferences Found State */}
            {!isLoading && !error && hasSearched && conferences.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">
                  Found Conferences ({conferences.length})
                </h2>
                {conferences.map((conf, index) => (
                  <Card key={index} className="rounded-2xl shadow-md border bg-white p-4">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-xl font-semibold text-blue-700">
                        {/* Link to the conference CFP page */}
                        <a href={conf.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {conf.acronym}: {conf.name}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-gray-700 text-sm">
                      <p><strong>Location:</strong> {conf.location}</p>
                      <p><strong>Submission Deadline:</strong> {conf.submission_deadline}</p>
                      <p><strong>Start Date:</strong> {conf.start_date}</p>
                      <p><strong>Topics:</strong> {conf.topics.join(', ')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Conferences Found State (after search) */}
            {!isLoading && !error && hasSearched && conferences.length === 0 && (
              <Card className="rounded-3xl shadow-xl border bg-yellow-50 p-6 text-yellow-700 text-center">
                <CardContent>
                  <Lightbulb className="h-8 w-8 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    No conferences found matching your selected domain "{domain}".
                  </p>
                  <p className="mt-2 text-sm">
                    Try selecting a different domain or check for broader topics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

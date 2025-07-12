"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Download,
    Edit3,
    Image as ImageIcon,
    Save,
    FileText,
    ArrowLeft,
    XCircle,
    PlusCircle,
    BookOpen, // New icon for adding formatted reference
} from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import { SiteHeader } from "@/Admin/components/site-header";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface RichTextEditorProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
    return (
        <Textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${className} p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
    );
};

interface GeneratedPaperContent {
    title: string;
    abstract: string;
    introduction: string;
    related_work: string;
    methodology: string;
    results: string;
    conclusion: string;
    references: string;
}

interface PaperConfig {
    paperType: string;
    paperFormat: string;
    topic: string;
    columnLayout: "1" | "2";
}

interface PaperData {
    paper: GeneratedPaperContent;
    config: PaperConfig;
    timestamp: string;
    authors?: string[];
    sectionImages?: Record<keyof GeneratedPaperContent, string | undefined>;
    // Removed 'citations' from PaperData as it will be managed directly in 'references' text
}

const PaperView = () => {
    const navigate = useNavigate();
    const [paperData, setPaperData] = useState<PaperData | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedPaperContent | null>(null);
    const [config, setConfig] = useState<PaperConfig | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<Record<string, number> | null>(null);
    const [authors, setAuthors] = useState<string[]>([]);
    const [newAuthor, setNewAuthor] = useState<string>("");
    const [sectionImages, setSectionImages] = useState<Record<keyof GeneratedPaperContent, string | undefined>>({
        title: undefined,
        abstract: undefined,
        introduction: undefined,
        related_work: undefined,
        methodology: undefined,
        results: undefined,
        conclusion: undefined,
        references: undefined,
    });
    // New state for adding a single formatted reference string
    const [newFormattedReference, setNewFormattedReference] = useState<string>("");


    const fileInputRef = useRef<HTMLInputElement>(null);
    const sectionFileInputRefs = useRef<Record<keyof GeneratedPaperContent, HTMLInputElement | null>>({
        title: null,
        abstract: null,
        introduction: null,
        related_work: null,
        methodology: null,
        results: null,
        conclusion: null,
        references: null,
    });

    useEffect(() => {
        const storedPaper = sessionStorage.getItem("generatedPaper");
        if (storedPaper) {
            const parsedData: PaperData = JSON.parse(storedPaper);
            setPaperData(parsedData);
            
            // Ensure all expected sections are present, even if empty from backend
            const defaultGeneratedContent: GeneratedPaperContent = {
                title: parsedData.paper.title || "",
                abstract: parsedData.paper.abstract || "",
                introduction: parsedData.paper.introduction || "",
                related_work: parsedData.paper.related_work || "",
                methodology: parsedData.paper.methodology || "",
                results: parsedData.paper.results || "",
                conclusion: parsedData.paper.conclusion || "",
                references: parsedData.paper.references || "",
            };
            setGeneratedContent(defaultGeneratedContent);
            setConfig(parsedData.config);
            if (parsedData.authors) setAuthors(parsedData.authors);
            if (parsedData.sectionImages) setSectionImages(parsedData.sectionImages);
            // 'citations' state is no longer derived from stored data or used to manage main references
        }
    }, []);

    const handleContentEdit = (section: keyof GeneratedPaperContent, value: string) => {
        if (generatedContent) {
            setGeneratedContent((prev) => ({
                ...prev!,
                [section]: value,
            }));
        }
    };

    const handleSaveChanges = () => {
        if (paperData && generatedContent) {
            const updated: PaperData = {
                ...paperData,
                paper: generatedContent,
                authors: authors,
                sectionImages: sectionImages,
                // Removed 'citations' from the saved data structure
            };
            sessionStorage.setItem("generatedPaper", JSON.stringify(updated));
            console.log("Saved locally in sessionStorage.", updated);
            setIsEditing(false);
        }
    };

    const handleAddAuthor = () => {
        if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
            setAuthors((prev) => [...prev, newAuthor.trim()]);
            setNewAuthor("");
        }
    };

    const handleRemoveAuthor = (authorToRemove: string) => {
        setAuthors((prev) => prev.filter((author) => author !== authorToRemove));
    };

    const handleImageUploadForSection = (
        sectionKey: keyof GeneratedPaperContent,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSectionImages((prev) => ({
                    ...prev,
                    [sectionKey]: reader.result as string,
                }));
                console.log(`Uploaded image for ${sectionKey}:`, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImageForSection = (sectionKey: keyof GeneratedPaperContent) => {
        setSectionImages((prev) => ({
            ...prev,
            [sectionKey]: undefined,
        }));
    };

    // New function to add a formatted reference directly to the references text area
    const handleAddFormattedReference = () => {
        if (newFormattedReference.trim()) {
            const refToAdd = newFormattedReference.trim();
            let currentReferences = generatedContent?.references || "";
            
            // Add a new line if current references is not empty, then append the new reference
            if (currentReferences.trim().length > 0 && !currentReferences.endsWith('\n')) {
                currentReferences += '\n'; // Ensure new ref starts on a new line
            }
            // Add a hyphen for list-like formatting, or just append
            const formattedRef = currentReferences.endsWith('\n') ? `- ${refToAdd}` : `${currentReferences.length > 0 ? '\n' : ''}- ${refToAdd}`;
            
            handleContentEdit("references", currentReferences + (currentReferences.trim().length > 0 ? '\n' : '') + `- ${refToAdd}`);
            setNewFormattedReference(""); // Clear input after adding
        }
    };

    const getFormatStyles = () => {
        const base = "font-serif leading-relaxed";
        switch (config?.paperFormat) {
            case "ieee":
            case "springer":
            case "acm":
                return `${base} text-sm`;
            default:
                return `${base} text-base`;
        }
    };

    const getColumnClass = () => {
        return config?.columnLayout === "2" ? "columns-2 gap-6 column-rule" : "";
    };

    const columnRuleStyle = config?.columnLayout === "2" ? {
        columnRule: "1px solid #e0e0e0"
    } : {};


    const simulateAnalysis = () => {
        const mock = {
            Grammar: Math.floor(Math.random() * 6 + 93),
            Plagiarism: Math.floor(Math.random() * 5 + 1),
            Formatting: Math.floor(Math.random() * 10 + 85),
            Citation: Math.floor(Math.random() * 10 + 80),
            Readability: Math.floor(Math.random() * 10 + 75),
        };
        setAnalysisResults(mock);
        setShowAnalysis(true);
    };

    const renderSection = useCallback(
        (
            title: string,
            contentKey: keyof GeneratedPaperContent,
            index?: number // Index for numbered sections (e.g., 1. Introduction)
        ) => (
            <div className="mb-8 break-inside-avoid">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {index !== undefined ? `${index}. ` : ""}
                        {title}
                    </h2>
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sectionFileInputRefs.current[contentKey]?.click()}
                            >
                                <ImageIcon className="w-4 h-4 mr-2" /> Upload Image
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={el => { sectionFileInputRefs.current[contentKey] = el; }}
                                onChange={(e) => handleImageUploadForSection(contentKey, e)}
                            />
                            {sectionImages[contentKey] && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveImageForSection(contentKey)}
                                    title="Remove Image"
                                >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {sectionImages[contentKey] && (
                    <div className="my-4 text-center">
                        <img
                            src={sectionImages[contentKey]}
                            alt={`Image for ${title} section`}
                            className="max-w-62 h-62 mx-auto rounded-md shadow-sm"
                        />
                    </div>
                )}
                {isEditing ? (
                    <RichTextEditor
                        value={generatedContent?.[contentKey] || ""}
                        onChange={(e) => handleContentEdit(contentKey, e.target.value)}
                        className="min-h-[120px] text-sm"
                        placeholder={`Edit content for ${title}...`}
                    />
                ) : (
                    <div className="text-justify text-gray-800 whitespace-pre-line">
                        {generatedContent?.[contentKey] === "" ? (
                            <p className="text-gray-500 italic">No content generated for this section.</p>
                        ) : (
                            generatedContent?.[contentKey]
                        )}
                    </div>
                )}
            </div>
        ),
        [isEditing, generatedContent, sectionImages, handleContentEdit, handleImageUploadForSection, handleRemoveImageForSection]
    );

    const renderPaperContent = () => {
        if (!generatedContent || !config) return null;

        return (
            <div className={`bg-white p-10 shadow-lg rounded-lg max-w-5xl mx-auto ${getFormatStyles()}`} style={columnRuleStyle}>
                <div className="text-center mb-10 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? (
                            <Input
                                value={generatedContent.title}
                                onChange={(e) => handleContentEdit("title", e.target.value)}
                                className="text-center text-2xl border-none focus:ring-0 font-bold"
                            />
                        ) : (
                            generatedContent.title
                        )}
                    </h1>
                    {/* Authors section */}
                    <div className="mt-4">
                        {isEditing ? (
                            <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
                                <Input
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="Add author name"
                                    className="max-w-xs"
                                />
                                <Button onClick={handleAddAuthor} size="sm">
                                    <PlusCircle className="w-4 h-4 mr-1" /> Add Author
                                </Button>
                            </div>
                        ) : null}
                        {authors.length > 0 && (
                            <p className="text-md text-gray-700">
                                {authors.map((author, index) => (
                                    <span key={author} className="inline-flex items-center">
                                        {author}
                                        {isEditing && (
                                            <XCircle
                                                className="w-3 h-3 ml-1 text-red-400 cursor-pointer hover:text-red-600"
                                                onClick={() => handleRemoveAuthor(author)}
                                            />
                                        )}
                                        {index < authors.length - 1 && ", "}
                                    </span>
                                ))}
                            </p>
                        )}
                        {authors.length === 0 && !isEditing && (
                                <p className="text-sm text-gray-500 italic">No authors listed</p>
                        )}
                    </div>
                    <p className="text-sm mt-2 text-gray-500">
                        {config.paperFormat.toUpperCase()} •{" "}
                        {config.paperType.charAt(0).toUpperCase() + config.paperType.slice(1)} Paper
                    </p>
                </div>

                <div className={getColumnClass()}>
                    {renderSection("Abstract", "abstract")}
                    {renderSection("Introduction", "introduction", 1)}
                    {renderSection("Related Work", "related_work", 2)}
                    {renderSection("Methodology", "methodology", 3)}
                    {renderSection("Results and Discussion", "results", 4)}
                    {renderSection("Conclusion", "conclusion", 5)}

                    {/* References Section - NOW FULLY EDITABLE VIA renderSection */}
                    {renderSection("References", "references", 6)}

                    {/* New input for adding formatted references directly to the text area */}
                    {isEditing && (
                        <div className="mb-8 break-inside-avoid mt-4 p-4 border rounded-md bg-gray-50">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Add Formatted Reference</h3>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={newFormattedReference}
                                    onChange={(e) => setNewFormattedReference(e.target.value)}
                                    placeholder="e.g., [1] A. B. Author, 'Title,' Journal, vol. X, no. Y, pp. Z, Year."
                                    className="flex-grow"
                                />
                                <Button onClick={handleAddFormattedReference} size="sm">
                                    <BookOpen className="w-4 h-4 mr-1" /> Add
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                This will append the reference directly to the "References" section text.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
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
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    navigate("/Student/tools/allTools/aipapercreator/prompt/page")
                                }
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Generator
                            </Button>

                            <h1 className="text-3xl font-bold text-gray-900">Generated Paper</h1>

                            <div className="flex gap-2">
                                {isEditing && (
                                    <Button onClick={handleSaveChanges}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    {isEditing ? "View" : "Edit"}
                                </Button>
                                <Button onClick={simulateAnalysis}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF & Analyze
                                </Button>
                            </div>
                        </div>

                        {generatedContent && config ? (
                            <div className="rounded-xl border border-gray-200 bg-white">
                                {renderPaperContent()}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="h-96 flex items-center justify-center">
                                    <div className="text-center">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No paper found. Please generate one.</p>
                                        <Button
                                            onClick={() =>
                                                navigate("/Student/tools/allTools/aipapercreator/prompt/page")
                                            }
                                            className="mt-4"
                                        >
                                            Generate Paper
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    console.log("Uploaded (global input):", e.target.files[0]);
                                    alert("Global image upload simulated, consider using section-specific upload.");
                                }
                            }}
                        />

                        <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Paper Quality Analysis</DialogTitle>
                                    <DialogDescription>Here’s your paper’s current health check:</DialogDescription>
                                </DialogHeader>
                                {analysisResults && (
                                    <div className="space-y-4">
                                        {Object.entries(analysisResults).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="flex justify-between text-sm font-medium mb-1">
                                                    <span>{key}</span>
                                                    <span>{value}%</span>
                                                </div>
                                                <Progress value={value} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default PaperView;
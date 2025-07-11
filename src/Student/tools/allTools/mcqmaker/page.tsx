"use client";

import { useState } from "react";
import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  UploadCloudIcon,
  ClipboardCopyIcon,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StudentSidebar } from "@/Student/components/student-sidebar";
import McqComponent from "./McqComponent";
import { type McqData, type Question } from "@/types/mcq.type";
import apiCall from "@/lib/apicall"
import constant from "@/constant/contstant.json"
import { toast } from "sonner"

export default function McqGenerator() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [questionCount, setQuestionCount] = useState("5");
  const [difficulty, setDifficulty] = useState("Medium");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [mcqData,setMcqData] = useState<McqData | null>(null);

  const dummyData = {
    "id": "68715d847da8ce294c887240",
    "userId": 2,
    "questions": [
        {
            "question": "Which type of UML diagram best represents the dynamic behavior of a system, showing interactions between actors and use cases?",
            "options": [
                "Class Diagram",
                "Sequence Diagram",
                "Use Case Diagram",
                "Deployment Diagram"
            ],
            "answer": "Use Case Diagram",
            "difficulty": "easy"
        },
        {
            "question": "In a Use Case Diagram, what represents the external entities that interact with the system?",
            "options": [
                "Use Cases",
                "Actors",
                "Classes",
                "Packages"
            ],
            "answer": "Actors",
            "difficulty": "easy"
        },
        {
            "question": "What is the primary purpose of a Use Case Diagram?",
            "options": [
                "To model the static structure of a system",
                "To show the flow of data within a system",
                "To represent the dynamic behavior and interactions within a system",
                "To illustrate the physical deployment of system components"
            ],
            "answer": "To represent the dynamic behavior and interactions within a system",
            "difficulty": "easy"
        },
        {
            "question": "According to the provided text, what is a precondition for using the Animal Adoption App?",
            "options": [
                "The user must have an existing animal profile.",
                "The Rescue Organization must be registered.",
                "The adopter must be pre-approved.",
                "The animal must be medically cleared."
            ],
            "answer": "The Rescue Organization must be registered.",
            "difficulty": "easy"
        },
        {
            "question": "In the given Animal Adoption App Use Case example, who are considered the primary actors?",
            "options": [
                "Only Potential Adopters",
                "Rescue Organization and Potential Adopters",
                "Only Rescue Organization",
                "Rescue Organization, Rescuers and Potential Adopters"
            ],
            "answer": "Rescue Organization, Rescuers and Potential Adopters",
            "difficulty": "easy"
        }
    ],
    "createdAt": "2025-07-12 00:22:52"
};

  const generateQuestions = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      text: `Question ${i + 1}: What is ${i + 2} + ${i + 3}?`,
      isEditing: false,
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    const uid = Math.random().toString(36).slice(2, 6);
    const questions = generateQuestions(Number(questionCount));

    const newEntry = {
      filename: selectedFile.name,
      link: `https://www.kshitijedu.com/mcq/${uid}`,
      date: new Date().toLocaleDateString("en-GB"),
      difficulty,
      questionCount,
      questions,
    };
      try {
        const formData = new FormData();
        formData.append("file", selectedFile as Blob);
        console.log("FormData:", formData);
        console.log("Difficulty:", difficulty);
        console.log("Question Count:", questionCount);

        const response = await apiCall(
          `${constant.baseUrl}/api/v1/ai/fileToMcqGenerater?difficultyLevel=${difficulty.toLowerCase()}&noOfQuestions=${questionCount}`,
          "POST",
          formData,
          {},
          true);
          const data = await response.json();
        console.log("Response:", data);
        if (!response.ok) {
          toast.error("Failed to generate MCQs. Please try again.");
          return;
        }
          toast.success("MCQs generated successfully!");
          setMcqData(data);
      } catch (error) {
        // handle error (optional)
        toast.error("Error generating MCQs. Please try again.");
        console.error(error);
      }
    setFileList((prev) => [...prev, newEntry]);
    setSelectedFile(null);
    setQuestionCount("5");
    setDifficulty("Medium");
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setPreview(null); // close popup after copying
  };

  const updateQuestion = (id: number, newText: string) => {
    if (!preview) return;
    const updated = preview.questions.map((q: any) =>
      q.id === id ? { ...q, text: newText } : q
    );
    setPreview({ ...preview, questions: updated });
  };

  const toggleEdit = (id: number) => {
    if (!preview) return;
    const updated = preview.questions.map((q: any) =>
      q.id === id ? { ...q, isEditing: !q.isEditing } : q
    );
    setPreview({ ...preview, questions: updated });
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
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🧠 MCQ Generator</h1>
          <p className="text-muted-foreground">
            Upload a document to auto-generate MCQs and share test links.
          </p>

          {/* Upload Section */}
          <Card className="border-dashed border-2 border-muted-foreground">
            <CardContent className="p-10 text-center flex flex-col items-center gap-3">
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                Click to upload or drag a file
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-xs text-muted-foreground">
                Accepted: ppt, pdf, pptx | Max Size: 5MB
              </span>
              {selectedFile && (
                <p className="text-sm font-medium mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>No. of Questions</Label>
              <Input
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
              />
            </div>
            <div>
              <Label>Select Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="mt-4"
            variant="default"
            disabled={!selectedFile}
            onClick={handleGenerate}
          >
            Generate Questions
          </Button>

          <Separator className="my-6" />

          {/* Displaying generated MCQs */}
          <McqComponent mcqData={mcqData}/>

          {/* File List */}
          <Card>
            <CardHeader>
              <CardTitle>📁 Uploaded Documents & Generated Links</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileList.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        📄 {file.filename}
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() => setPreview(file)}
                          className="text-blue-600 cursor-pointer underline flex items-center gap-2"
                        >
                          {file.link}
                          <ClipboardCopyIcon className="w-4 h-4" />
                        </span>
                      </TableCell>
                      <TableCell>{file.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>

      {/* Dialog for test preview and question edit */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>📝 Test Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p><strong>File:</strong> {preview?.filename}</p>
            <p><strong>Difficulty:</strong> {preview?.difficulty}</p>
            <p><strong>No. of Questions:</strong> {preview?.questionCount}</p>

            <Separator className="my-3" />

            {/* Questions */}
            <div className="space-y-3">
              {preview?.questions.map((q: any) => (
                <div key={q.id} className="flex items-start gap-2">
                  <span className="font-medium">{q.id}.</span>
                  {q.isEditing ? (
                    <Input
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      onBlur={() => toggleEdit(q.id)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 flex justify-between items-center">
                      <span>{q.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleEdit(q.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleCopy(preview.link)}>
              Copy Test Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

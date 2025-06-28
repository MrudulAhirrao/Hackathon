import { AppSidebar } from "@/Admin/components/app-sidebar";
import { SiteHeader } from "@/Admin/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudUpload, FileDown } from "lucide-react";

export default function DataPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        {/* Page Content */}
        <div className="flex flex-col items-center justify-center px-4 py-10 gap-10 w-full">
          {/* Tabs for Upload */}
          <Tabs defaultValue="teachers" className="w-full max-w-4xl">
            <TabsList className="flex justify-center w-full mb-6 border-b border-border bg-background">
              <TabsTrigger
                value="teachers"
                className="text-sm font-medium px-4 py-2 border-b-2 border-transparent
             data-[state=active]:border-primary
             data-[state=active]:text-primary
             data-[state=active]:bg-muted
             transition-colors duration-200 ease-in-out"
              >
                Upload Teachers
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="text-sm font-medium px-4 py-2 border-b-2 border-transparent
             data-[state=active]:border-primary
             data-[state=active]:text-primary
             data-[state=active]:bg-muted
             transition-colors duration-200 ease-in-out"
              >
                Upload Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teachers">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">Teacher Data Upload</CardTitle>
                  <CardDescription>
                    Upload an Excel file with teacher data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Required columns:</strong> <code>teacher_name</code>
                    , <code>teacher_email</code>, <code>teacher_phone</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Optional columns:</strong> <code>experience</code>,{" "}
                    <code>img_blob</code>
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <input
                    type="file"
                    id="teacher-upload"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Teacher file selected:", file.name);
                        // TODO: Upload logic here
                      }
                    }}
                  />
                  <label htmlFor="teacher-upload">
                    <Button asChild className="flex gap-2 cursor-pointer">
                      <span>
                        <CloudUpload className="w-4 h-4 inline" /> Select Excel
                        File
                      </span>
                    </Button>
                  </label>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">Student Data Upload</CardTitle>
                  <CardDescription>
                    Upload an Excel file with student data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Required columns:</strong> <code>student_name</code>
                    , <code>student_email</code>, <code>student_phone</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Optional columns:</strong> <code>dob</code>,{" "}
                    <code>class</code>
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <input
                    type="file"
                    id="student-upload"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Student file selected:", file.name);
                        // TODO: Upload logic here
                      }
                    }}
                  />
                  <label htmlFor="student-upload">
                    <Button asChild className="flex gap-2 cursor-pointer">
                      <span>
                        <CloudUpload className="w-4 h-4 inline" /> Select Excel
                        File
                      </span>
                    </Button>
                  </label>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Download Teacher Template</CardTitle>
                <CardDescription>
                  Use this Excel file format to upload teacher data.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <Button variant="outline" className="flex gap-2">
                  <FileDown className="w-4 h-4" />
                  Download .xlsx
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Student Template</CardTitle>
                <CardDescription>
                  Use this Excel file format to upload student data.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <Button variant="outline" className="flex gap-2">
                  <FileDown className="w-4 h-4" />
                  Download .xlsx
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

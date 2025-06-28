import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/Admin/components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>All active students</CardDescription>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-bold">1,234</h2>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Teachers</CardTitle>
                <CardDescription>Verified teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-bold">56</h2>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Available online courses</CardDescription>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-bold">18</h2>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>New student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-bold">9</h2>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="announcements" className="w-full">
            <TabsList>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="notices">Notices</TabsTrigger>
            </TabsList>
            <TabsContent value="announcements">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Announcements</CardTitle>
                  <CardDescription>Important updates for teachers and students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-4 space-y-1 text-sm">
                    <li>Semester exams scheduled from July 1st</li>
                    <li>New courses added in Computer Science</li>
                    <li>Teacher training on June 25th</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notices">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notices</CardTitle>
                  <CardDescription>Operational and policy updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-4 space-y-1 text-sm">
                    <li>Portal maintenance on June 30th</li>
                    <li>Profile photo update deadline extended</li>
                    <li>New login policy for teachers</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

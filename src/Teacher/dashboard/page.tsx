import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TeacherSidebar } from "../components/teacher-sidebar";


export default function TeacherDashboard(){
    return(
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <TeacherSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
            <p className="text-muted-foreground mb-6">
                Welcome to your dashboard! Here you can manage your courses, view
                student progress, and access teaching resources.
            </p>
            {/* Add more content here as needed */}
        </div>
      </SidebarInset>
    </SidebarProvider>

    )
}
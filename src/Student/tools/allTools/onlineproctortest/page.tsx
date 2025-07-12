import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/Student/components/student-sidebar";

export default function OnlineProctorTestPage() {
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
     <h1>Online Proctor Test</h1>
      <p>This is the online proctor test page.</p>   
      </SidebarInset>
    </SidebarProvider>
  );
}

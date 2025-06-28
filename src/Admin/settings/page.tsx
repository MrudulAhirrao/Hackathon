import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">
            Customize general features for the admin dashboard.
          </p>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>
                Enable or disable common UI and feature modes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ui" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="ui">UI Settings</TabsTrigger>
                  <TabsTrigger value="features">Feature Toggles</TabsTrigger>
                </TabsList>
                <TabsContent value="ui" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-sidebar">Compact Sidebar</Label>
                    <Switch id="compact-sidebar" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">Enable Animations</Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                  <Button className="mt-4">Save UI Settings</Button>
                </TabsContent>
                <TabsContent value="features" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autosave">Auto-Save Data</Label>
                    <Switch id="autosave" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tooltips">Show Tooltips</Label>
                    <Switch id="tooltips" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="accessibility">Accessibility Mode</Label>
                    <Switch id="accessibility" />
                  </div>
                  <Button className="mt-4">Save Feature Settings</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

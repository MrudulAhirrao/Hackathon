import { SiteHeader } from "@/Admin/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { TeacherSidebar } from "../components/teacher-sidebar";

export default function TeacherSettings() {
  const [form, setForm] = useState({
    id: "202301",
    fullName: "John Doe",
    email: "johndoe@example.com",
    password: "",
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    autoSaveNotes: true,
    twoFactorAuth: false,
    language: "English",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <TeacherSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">⚙️ Student Settings</h1>
          <p className="text-muted-foreground">
            Manage your student account preferences and settings.
          </p>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account Info</TabsTrigger>
              <TabsTrigger value="general">General Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View and update your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>ID</Label>
                    <Input
                      name="id"
                      value={form.id}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      onChange={handleChange}
                    />
                  </div>
                  <Button className="mt-2">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Preferences</CardTitle>
                  <CardDescription>
                    Enable or disable optional features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>🌙 Dark Mode</span>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={() => handleToggle("darkMode")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>📧 Email Notifications</span>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={() => handleToggle("emailNotifications")}
                    />
                  </div>
                 
                  <div>
                    <Label htmlFor="language">🌐 Language</Label>
                    <Input
                      id="language"
                      name="language"
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

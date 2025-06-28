"use client"

import { SiteHeader } from "@/Admin/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { StudentSidebar } from "../components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BellIcon } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

const mockNotifications = [
  {
    id: 1,
    title: "📄 New Assignment Posted",
    time: "2 hours ago",
    description: "A new assignment has been posted in your Mathematics course.",
    type: "Assignment",
  },
  {
    id: 2,
    title: "🧪 Chemistry Lab Reminder",
    time: "Yesterday",
    description: "Don't forget to submit your lab report by 5 PM today.",
    type: "Reminder",
  },
  {
    id: 3,
    title: "🎥 Video Lecture Available",
    time: "3 days ago",
    description: "New recorded lecture uploaded in Physics: Wave Mechanics.",
    type: "Update",
  },
]

export default function NotificationPage() {
  const [tab, setTab] = useState("All")
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null)

  const filtered =
    tab === "All" ? mockNotifications : mockNotifications.filter((n) => n.type === tab)

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
        <main className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <BellIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <p className="text-muted-foreground">
            Stay up to date with your courses and upcoming activities.
          </p>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mt-4">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Assignment">Assignments</TabsTrigger>
              <TabsTrigger value="Reminder">Reminders</TabsTrigger>
              <TabsTrigger value="Update">Updates</TabsTrigger>
            </TabsList>

            <TabsContent
              value={tab}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
            >
              {filtered.map((note) => (
                <Card key={note.id} className="transition-all hover:shadow-lg">
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-semibold">
                        {note.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {note.time}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{note.description}</p>
                    <Separator className="my-3" />
                    <div className="flex justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedNotification(note)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        {selectedNotification && selectedNotification.id === note.id && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{selectedNotification.title}</DialogTitle>
                              <DialogDescription>{selectedNotification.time}</DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                              <p><strong>Type:</strong> {selectedNotification.type}</p>
                              <p>{selectedNotification.description}</p>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

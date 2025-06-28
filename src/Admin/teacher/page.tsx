import React, { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/Admin/components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";

type Teacher = {
  id: number;
  name: string;
  email: string;
  experience: string;
  phone: string;
  portfolio: string;
};

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: "Mrudul Ahirrao",
      email: "mrudul@gmail.com",
      experience: "3 years",
      phone: "9876543210",
      portfolio: "https://github.com/mrudul",
    },
    {
      id: 2,
      name: "Sneha Kulkarni",
      email: "sneha@gmail.com",
      experience: "5 years",
      phone: "1234567890",
      portfolio: "https://sneha.dev",
    },
  ]);

  const [formData, setFormData] = useState<Omit<Teacher, "id">>({
    name: "",
    email: "",
    experience: "",
    phone: "",
    portfolio: "",
  });

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  const paginatedTeachers = teachers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: Date.now(),
      ...formData,
    };
    setTeachers((prev) => [...prev, newTeacher]);
    setFormData({ name: "", email: "", experience: "", phone: "", portfolio: "" });
  };

  const handleDelete = (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this teacher?");
    if (confirmDelete) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher) return;
    setTeachers((prev) =>
      prev.map((t) => (t.id === editingTeacher.id ? editingTeacher : t))
    );
    setEditingTeacher(null);
    setIsEditDialogOpen(false);
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">+ Add Teacher</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Teacher</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {["name", "email", "experience", "phone", "portfolio"].map((field) => (
                    <div className="grid gap-1" key={field}>
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        placeholder={`Enter ${field}`}
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleAddTeacher} className="w-full mt-2">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.experience}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(teacher)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(teacher.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Teacher</DialogTitle>
              </DialogHeader>
              {editingTeacher && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1">
                    <Label>ID</Label>
                    <Input value={editingTeacher.id} readOnly />
                  </div>
                  {["name", "email", "experience", "phone", "portfolio"].map((field) => (
                    <div className="grid gap-1" key={field}>
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        value={(editingTeacher as any)[field]}
                        onChange={(e) =>
                          setEditingTeacher({
                            ...editingTeacher,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleUpdateTeacher} className="w-full mt-2">
                    Update
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

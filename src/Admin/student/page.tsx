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

export default function StudentPage() {
  type Student = {
    roll: number;
    fullname: string;
    email: string;
  };

  const [students, setStudents] = useState<Student[]>([
    { roll: 101, fullname: "Riya Sharma", email: "riya@example.com" },
    { roll: 102, fullname: "Aman Verma", email: "aman@example.com" },
    { roll: 103, fullname: "Priya Desai", email: "priya@example.com" },
    { roll: 104, fullname: "Kunal Yadav", email: "kunal@example.com" },
    { roll: 105, fullname: "Neha Kaur", email: "neha@example.com" },
  ]);

  const [formData, setFormData] = useState<Student>({
    roll: 0,
    fullname: "",
    email: "",
  });

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginatedStudents = students.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddStudent = () => {
    const newStudent: Student = { ...formData };
    setStudents((prev) => [...prev, newStudent]);
    setFormData({ roll: 0, fullname: "", email: "" });
  };

  const handleDelete = (roll: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      setStudents((prev) => prev.filter((s) => s.roll !== roll));
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    setStudents((prev) =>
      prev.map((s) => (s.roll === editingStudent.roll ? editingStudent : s))
    );
    setEditingStudent(null);
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
            <h2 className="text-2xl font-semibold">Student Dashboard</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">+ Add Student</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Student</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {["roll", "fullname", "email"].map((field) => (
                    <div className="grid gap-1" key={field}>
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        placeholder={`Enter ${field}`}
                        type={field === "roll" ? "number" : "text"}
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleAddStudent} className="w-full mt-2">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.roll}>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(student)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(student.roll)}>
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
              </DialogHeader>
              {editingStudent && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1">
                    <Label>Roll No</Label>
                    <Input value={editingStudent.roll} readOnly />
                  </div>
                  {["fullname", "email"].map((field) => (
                    <div className="grid gap-1" key={field}>
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        value={(editingStudent as any)[field]}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleUpdateStudent} className="w-full mt-2">
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
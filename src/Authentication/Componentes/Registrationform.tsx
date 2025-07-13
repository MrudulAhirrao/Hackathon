import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"

import apiCall from "@/lib/apicall"
import constant from "@/constant/contstant.json"

export default function Registrationform() {
  const registrationHandler = async(e: React.FormEvent) => {
    e.preventDefault();
    if(name === "" || email === "" || password === "" || confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if(password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const response = await apiCall(`${constant.baseUrl}/api/v1/users`, "POST", {
      email,
      password
    });
    if(response.status === 201) {
      toast.success("Registration successful! Please login.");
      window.location.href = "/login";
    } else {
      const data = await response.json();
      toast.error(data.message || "Registration failed. Please try again.");
    }
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <form className="space-y-4" onSubmit={registrationHandler}>
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" placeholder="John Doe" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>

            {/* <Link to="/login" > */}
            <Button className="w-full" type="submit">
              Register
            </Button>
            {/* </Link> */}
          </form>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

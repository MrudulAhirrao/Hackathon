import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import constant from "@/constant/contstant.json"
import Cookies from "js-cookie"
import { useState } from "react"
import { toast } from "sonner"
import apiCall from "@/lib/apicall"
import { Link } from "react-router-dom"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async(event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if(password.trim().length <0) {
      toast.error("Password is empty.");
      return;
    }
    const body = {
      email: email,
      password: password
    }
    const response = await apiCall(constant.baseUrl+"/api/v1/users/login","POST",body);
    if(response.status === 200) {
      const data = await response.json();
      Cookies.set("token", data.token, { expires: 7 });
      toast.success("Login successful!");
      window.location.href = "/Student/dashboard/page";
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Login failed. Please try again.");
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={doLogin}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" 
                type="email" 
                placeholder="m@example.com" 
                required  
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* <Link to="/Student/dashboard/page" className="w-full"> */}
        <Button className="w-full" type="submit">
          Login
        </Button>
        {/* </Link> */}

        <div className="text-center text-sm">
                Don’t have an account?{" "}
                <Link to="/register" className="underline">
                  Register
                </Link>
              </div>
      </div>
    </form>
  )
}

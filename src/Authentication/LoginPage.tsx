import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/Authentication/Componentes/Loginfrom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
   import { Toaster, toast } from "sonner";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Kshitij
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <DotLottieReact
          src="https://lottie.host/94403e9e-b671-460b-9742-49a6e365b793/d8xdFXI3vo.lottie"
          loop
          autoplay
        />
      </div>
      <Toaster/>
    </div>
  );
}

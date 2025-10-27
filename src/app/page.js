'use client'

import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="items-center flex justify-center gap-2 md:justify-start">
          <a href="#" className="lg:hidden flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
              <Image
                src="/sidebar-logo.svg"
                alt="MIRA Logo"
                width={720}
                height={720}
                className="rounded-md"
              />
            </div>
            MIRA - Media Informasi dan Relasi Akses
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login-image.jpg"
          alt="Login image"
          width={1440}
          height={1440}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />

        <div className="ml-6 mt-8 relative z-20 items-center flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary tracking-tight text-primary-foreground flex size-12 items-center justify-center rounded-md">
              <Image
                src="/sidebar-logo.svg"
                alt="MIRA Logo"
                width={720}
                height={720}
                className="rounded-md"
              />
            </div>
            MIRA - Media Informasi dan Relasi Akses
          </a>
        </div>
        <div className="absolute bottom-0 w-full z-20 p-6">
          <blockquote className="space-y-2">
            <p className="text-lg tracking-tight">
              &ldquo;MIRA bukan sekadar asisten, melainkan representasi layanan cerdas FEB. 
              Kami memanfaatkan AI untuk menyediakan akses informasi yang relevan dan 
              responsif bagi seluruh civitas akademika.&rdquo;
            </p>
            <footer className="text-sm">Sekretariat</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

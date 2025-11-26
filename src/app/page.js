'use client'

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import FloatingLines from "@/components/FloatingLines";

export default function Home() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <FloatingLines
            enabledWaves={["middle", "bottom"]}
            lineCount={[5, 3]}
            lineDistance={[8, 6, 4]}
            bendRadius={5.0}
            bendStrength={1.9}
            interactive={true}
            parallax={true}
            mixBlendMode="screen"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030711] via-[#01030b]/30 to-[#030711]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-start text-center text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-white/10 p-1 shadow-lg">
              <Image
                src="/logo-feb.png"
                alt="MIRA Logo"
                width={80}
                height={80}
                className="rounded-xl"
                priority
              />
            </div>
            <div className="text-left">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  MIRA
                </p>
                <p className="text-xs">
                  Media Informasi dan Relasi Anda
                </p>
              </div>
            </div>
          </div>
          {/* <p className="text-sm text-white/70">
            &ldquo;MIRA bukan sekadar asisten, melainkan representasi layanan cerdas FEB.
            Kami memanfaatkan AI untuk menyediakan akses informasi yang relevan dan responsif
            bagi seluruh civitas akademika.&rdquo;
          </p> */}
        </div>

        <div className="flex justify-center">
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

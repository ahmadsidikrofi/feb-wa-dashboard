import { Geist, Geist_Mono, Nunito, Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

const raleway = Nunito({
  variable: "--font-raleway",
  subsets: ["latin"],
});


export const metadata = {
  title: "MIRA FEB",
  description: "Media Informasi dan Relasi Anda - Menunjukkan kemudahan akses informasi bagi Mahasiswa/Dosen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} antialiased`} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <AuthProvider>
              {children}
            </AuthProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

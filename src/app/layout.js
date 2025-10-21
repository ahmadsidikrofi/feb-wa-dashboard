import { Geist, Geist_Mono, Nunito, Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const raleway = Nunito({
  variable: "--font-raleway",
  subsets: ["latin"],
});


export const metadata = {
  title: "MIRA FEB",
  description: "Media Relasi dan Relasi Anda - Menunjukkan kemudahan akses informasi bagi Mahasiswa/Dosen",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

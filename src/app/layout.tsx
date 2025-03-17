import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/myComponents/header";
import {ClerkProvider}  from "@clerk/nextjs"
import { dark } from '@clerk/themes'
import { Toaster } from "sonner";
// import SnowflakeCursor from "@/utils/CustomeCursor";
import CanvasCursor from "@/utils/CanvasCursor";



const inter=Inter({subsets:["latin"]})


export const metadata: Metadata = {
  title: "Flux Ai - AI Career Coach",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
        <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} scroll-smooth`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>

            <main className="min-h-screen">
            {children}
            {/* <SnowflakeCursor/> */}
            <CanvasCursor/>
            
            </main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-12">
              <div className="container px-4  mx-auto text-center">
         <p>Crafted with ❤️ by Akshat.</p>
              </div>
              
            </footer>

          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
   
  );
}

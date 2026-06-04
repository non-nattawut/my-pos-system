import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { LoginPage } from "@/components/layout/LoginPage";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { cookies } from 'next/headers';
import { AUTH_COOKIE_KEY } from '@/constants';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NekoBite POS 🐾 | Next-Gen Anime Cafe POS",
  description: "A gorgeous, futuristic anime-themed Point of Sale system for the modern maid & cyber cafe.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_KEY);
  let authUser = null;

  if (authCookie?.value) {
    try {
      authUser = JSON.parse(decodeURIComponent(authCookie.value));
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col bg-theme-bg overflow-hidden">
        <ThemeProvider>
          {authUser ? (
            <Shell authUser={authUser}>{children}</Shell>
          ) : (
            <LoginPage />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

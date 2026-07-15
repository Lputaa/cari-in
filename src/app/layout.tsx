import type { Metadata } from "next";
import { AuthProvider } from "@/lib/AuthProvider";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cari-in",
  description: "Kehilangan sesuatu? Cari-in ajaa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-neutral-gray">
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}

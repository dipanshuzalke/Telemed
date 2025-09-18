import "./globals.css";
import { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Telemed Dashboard",
  description: "Doctor / Pharmacy / Admin Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
       <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Telemed Dashboard</h1>
        </header>
         <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}

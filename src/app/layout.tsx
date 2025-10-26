
import "./globals.css";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "To Do App",
  description: "Organize your tasks efficiently with our To Do App...",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

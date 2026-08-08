import type { Metadata } from "next";
import "./globals.css";
import { TerminalProvider } from "@/components/TerminalProvider";
import Buzzer from "@/components/Buzzer";
import Terminal from "@/components/Terminal";
import Navbar from "@/components/Navbar";
import CursorSparkle from "@/components/CursorSparkle";
import CrewPopup from "@/components/CrewPopup";


export const metadata: Metadata = {
  title: "CREWMATE_AADITA · Portfolio",
  description: "Among Us-themed portfolio. Type 'help' in the terminal to navigate. Beware the impostor.",
  keywords: ["portfolio", "developer", "among us", "creative", "web developer"],
  authors: [{ name: "CREWMATE_AADITA" }],

  openGraph: {
    title: "CREWMATE_AADITA · Portfolio",

    description: "An Among Us-themed developer portfolio. Explore the ship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="stars-bg" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <TerminalProvider>
          <Navbar />
          <main className="content-layer">
            {children}
          </main>
          <Buzzer />
          <Terminal />
          <CursorSparkle />
          <CrewPopup />

        </TerminalProvider>
      </body>
    </html>
  );
}

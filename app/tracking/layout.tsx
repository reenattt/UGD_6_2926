import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracking | Sky Link Logistics",
  description: "Track your air cargo shipments in real time and monitor delivery status instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

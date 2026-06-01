import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Sky Link Logistics",
  description: "Welcome to Sky Link Logistics, your premier partner for modern air cargo logistics and real-time shipment monitoring.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

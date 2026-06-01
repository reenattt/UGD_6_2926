import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Shipment | Sky Link Logistics",
  description: "Register new shipments, input sender and receiver details, specify cargo info, and generate tracking codes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

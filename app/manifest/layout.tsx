import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifest | Sky Link Logistics",
  description: "View, search, and manage comprehensive shipment manifests and cargo listings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

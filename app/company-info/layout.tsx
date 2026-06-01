import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Information | Sky Link Logistics",
  description: "Explore our vision, mission, services, and company background at Sky Link Logistics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

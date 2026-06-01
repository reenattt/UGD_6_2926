import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sky Link Logistics",
  description: "Learn more about Sky Link Logistics, our history, services, and commitment to global air cargo transport.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Management | Sky Link Logistics",
  description: "Manage administrator accounts, user credentials, and security access levels.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

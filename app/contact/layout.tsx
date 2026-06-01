import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Sky Link Logistics",
  description: "Get in touch with the Sky Link Logistics support team and office personnel.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

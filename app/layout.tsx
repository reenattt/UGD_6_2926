import "./ui/global.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Sky Link Dashboard',
  description: 'Cargo shipment monitoring system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden antialiased bg-[#0f172a] text-white`}>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Care Platform Web',
  description: 'A modern care management experience built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-950">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

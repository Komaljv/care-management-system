import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Grace & Goodwill',
  description: 'Grace & Goodwill care platform: elegant, trustworthy care coordination.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy-950 text-gold-100">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

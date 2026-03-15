import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import ConditionalNavbar from '@/components/ConditionalNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Decision Helper',
  description: 'Make better decisions with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConditionalNavbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
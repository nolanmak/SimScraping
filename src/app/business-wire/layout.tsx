import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BusinessWire Articles | Next.js App',
  description: 'View the latest articles from BusinessWire',
};

export default function BusinessWireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">BusinessWire Articles</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} BusinessWire Simulation | Next.js Demo
        </div>
      </footer>
    </div>
  );
} 
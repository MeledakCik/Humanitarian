// layout.tsx
import React, { ReactNode } from 'react'; // Import ReactNode
import './globals.css'; // Ganti dengan path CSS global Anda jika ada

export const metadata = {
  title: 'CRUD PWA',
  description: 'Contoh aplikasi CRUD PWA',
};

// Define the type for the props
interface RootLayoutProps {
  children: ReactNode; // Specify that children will be of type ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) { // Destructure children with the specified type
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

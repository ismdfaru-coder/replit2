import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Free AI Travel Agent – Create the Perfect Trip Itinerary with Ease',
  description: 'Plan your Travel effortlessly with our Free AI Agent for Travel! Get personalized trip itinerary and explore with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <div className="absolute inset-0 bg-black/20 z-0" />
          <div className="relative z-10">
            <Header />
            <main>
              {children}
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

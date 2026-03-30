import './globals.css';
import { Navbar } from 'src/components/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto min-h-screen max-w-6xl p-4 md:p-8">
        <Navbar />
        <main className="mt-8">{children}</main>
      </body>
    </html>
  );
}

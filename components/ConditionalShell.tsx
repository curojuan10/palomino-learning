'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const HIDE_NAV_FOOTER = ['/admin', '/dashboard', '/auth'];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavFooter = HIDE_NAV_FOOTER.some((r) => pathname.startsWith(r));

  if (hideNavFooter) {
    return (
      <>
        {children}
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

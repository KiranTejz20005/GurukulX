import { ReticleDev } from './reticle-dev';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GurukulX - Next Generation LMS Platform",
  description: "Next Generation Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="clean-bis-skin"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                function clean() {
                  var els = document.querySelectorAll('[bis_skin_checked]');
                  for (var i = 0; i < els.length; i++) {
                    els[i].removeAttribute('bis_skin_checked');
                  }
                }
                clean();
                if (window.MutationObserver) {
                  var obs = new MutationObserver(function(muts) {
                    for (var i = 0; i < muts.length; i++) {
                      if (muts[i].attributeName === 'bis_skin_checked') {
                        muts[i].target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  if (document.documentElement) {
                    obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {process.env.NODE_ENV === 'development' ? <ReticleDev /> : null}
        {children}
      </body>
    </html>
  );
}

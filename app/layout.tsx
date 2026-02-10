import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitter/X Political Analytics",
  description: "Political analytics dashboard for Twitter/X data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 text-gray-900 antialiased transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='twitter-analytics-theme';var s=document.localStorage.getItem(k);var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

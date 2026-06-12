import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIAI - AI 女友",
  description: "定制 AI 女友、聊天陪伴与视频创作的移动 H5 原型。",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "AIAI" },
  icons: { apple: "/icons/apple-touch-icon.png" }
};

export const viewport = {
  themeColor: "#0c0c12"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <style>{".auth-screen .field-block[hidden]{display:none!important}"}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_URL__=${JSON.stringify(supabaseUrl)};window.__SUPABASE_ANON_KEY__=${JSON.stringify(supabaseAnonKey)};`
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

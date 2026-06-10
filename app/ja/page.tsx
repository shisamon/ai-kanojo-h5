import Script from "next/script";
import { getPrototypeBody } from "@/lib/prototype-html";

export const metadata = {
  title: "OpenLover - 投稿広場"
};

export default function JapanesePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='ja';" }} />
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("ja") }} />
      <Script src="/prototype/app.js" strategy="afterInteractive" />
    </>
  );
}

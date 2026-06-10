import Script from "next/script";
import { getPrototypeBody } from "@/lib/prototype-html";

export const metadata = {
  title: "OpenLover - 創作エリア"
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

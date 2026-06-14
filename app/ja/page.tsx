import Script from "next/script";
import { getPrototypeBody } from "@/lib/prototype-html";

export const metadata = {
  title: "soulmate"
};

export default function JapanesePage() {
  return (
    <>
      <Script id="set-ja-lang" strategy="afterInteractive">
        {"document.documentElement.lang='ja';"}
      </Script>
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("ja") }} />
      <Script src="/prototype/app.js?v=20260615-5" strategy="afterInteractive" />
    </>
  );
}

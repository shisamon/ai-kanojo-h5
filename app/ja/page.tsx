import Script from "next/script";
import { getPrototypeBody } from "@/lib/prototype-html";

export const metadata = {
  title: "AIAI - ホーム"
};

export default function JapanesePage() {
  return (
    <>
      <Script id="set-ja-lang" strategy="afterInteractive">
        {"document.documentElement.lang='ja';"}
      </Script>
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("ja") }} />
      <Script src="/prototype/app.js?v=relationship-1" strategy="afterInteractive" />
    </>
  );
}

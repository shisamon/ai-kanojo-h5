import Script from "next/script";
import { getPrototypeBody } from "@/lib/prototype-html";

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("zh") }} />
      <Script src="/prototype/app.js?v=username-register-1" strategy="afterInteractive" />
    </>
  );
}

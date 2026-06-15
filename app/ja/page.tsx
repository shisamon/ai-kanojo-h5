import { getPrototypeBody } from "@/lib/prototype-html";

export const metadata = {
  title: "soulmate"
};

export default function JapanesePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='ja';" }} />
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("ja") }} />
    </>
  );
}

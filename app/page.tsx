import { getPrototypeBody } from "@/lib/prototype-html";

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getPrototypeBody("zh") }} />
    </>
  );
}

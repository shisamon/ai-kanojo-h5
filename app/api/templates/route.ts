import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

type Locale = "zh" | "ja";

function isLocale(value: string | null): value is Locale {
  return value === "zh" || value === "ja";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale: Locale = isLocale(url.searchParams.get("locale"))
    ? (url.searchParams.get("locale") as Locale)
    : "zh";

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("templates")
      .select("id,mode,name_zh,name_ja,cost,image_url,sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ templates: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      templates: (data ?? []).map((template) => ({
        id: template.id,
        mode: template.mode,
        name: locale === "ja" ? template.name_ja : template.name_zh,
        cost: template.cost,
        image: template.image_url || ""
      }))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ templates: [], error: message }, { status: 500 });
  }
}

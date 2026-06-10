import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("characters")
      .select("id,name,age,tag,creator_name,image_url")
      .eq("is_public", true)
      .order("created_at", { ascending: true })
      .limit(60);

    if (error) {
      return NextResponse.json({ characters: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      characters: (data ?? []).map((character) => ({
        id: character.id,
        name: character.name,
        age: character.age,
        tag: character.tag || "",
        vibe: character.creator_name || "",
        image: character.image_url || ""
      }))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ characters: [], error: message }, { status: 500 });
  }
}

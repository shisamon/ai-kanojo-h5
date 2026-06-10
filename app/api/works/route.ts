import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

type WorkMode = "image" | "video";
type WorkSort = "likes" | "latest";

function isWorkMode(value: string | null): value is WorkMode {
  return value === "image" || value === "video";
}

function isWorkSort(value: string | null): value is WorkSort {
  return value === "likes" || value === "latest";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = isWorkMode(url.searchParams.get("mode")) ? url.searchParams.get("mode") : "image";
  const sort = isWorkSort(url.searchParams.get("sort")) ? url.searchParams.get("sort") : "likes";

  try {
    const supabase = getSupabaseClient();
    const query = supabase
      .from("works")
      .select(
        "id,title,mode,media_url,thumbnail_url,cost,likes_count,created_at,characters(name,creator_name)"
      )
      .eq("visibility", "public")
      .eq("mode", mode)
      .order(sort === "latest" ? "created_at" : "likes_count", { ascending: false })
      .limit(60);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ works: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      works: (data ?? []).map((work) => {
        const character = Array.isArray(work.characters) ? work.characters[0] : work.characters;
        return {
          id: work.id,
          title: work.title,
          mode: work.mode,
          image: work.thumbnail_url || work.media_url,
          mediaUrl: work.media_url,
          cost: work.cost,
          likes: work.likes_count,
          character: character?.name || "AI Character",
          creator: character?.creator_name || "@User",
          createdAt: new Date(work.created_at).getTime()
        };
      })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ works: [], error: message }, { status: 500 });
  }
}

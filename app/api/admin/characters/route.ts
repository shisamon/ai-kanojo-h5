import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { service } = auth.ctx;

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") || "").trim();
  const page = Math.max(0, Number(url.searchParams.get("page") || 0));
  const pageSize = 25;

  let query = service
    .from("characters")
    .select(
      "id,name,age,tag,image_url,is_public,created_at,owner_id,profiles!characters_owner_id_fkey(email,display_name)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  if (search) query = query.or(`name.ilike.%${search}%,tag.ilike.%${search}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const characters = data ?? [];
  const ids = characters.map((character) => character.id);
  const metrics = ids.reduce<Record<string, { works: number; chats: number }>>((acc, id) => {
    acc[id] = { works: 0, chats: 0 };
    return acc;
  }, {});

  if (ids.length > 0) {
    const [worksRes, chatsRes] = await Promise.all([
      service.from("works").select("character_id").in("character_id", ids),
      service.from("chat_sessions").select("character_id").in("character_id", ids)
    ]);
    (worksRes.data ?? []).forEach((row) => {
      if (row.character_id && metrics[row.character_id]) metrics[row.character_id].works += 1;
    });
    (chatsRes.data ?? []).forEach((row) => {
      if (row.character_id && metrics[row.character_id]) metrics[row.character_id].chats += 1;
    });
  }

  return NextResponse.json({
    characters: characters.map((character) => ({ ...character, metrics: metrics[character.id] })),
    total: count ?? 0,
    page,
    pageSize
  });
}


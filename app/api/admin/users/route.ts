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
    .from("profiles")
    .select("id,email,display_name,diamond_balance,is_admin,locale,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [], total: count ?? 0, page, pageSize });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { service, userId } = auth.ctx;

  let body: { id?: string; balanceDelta?: number; isAdmin?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (typeof body.balanceDelta === "number" && body.balanceDelta !== 0) {
    const { data: profile } = await service
      .from("profiles")
      .select("diamond_balance")
      .eq("id", body.id)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const newBalance = Math.max(0, profile.diamond_balance + Math.trunc(body.balanceDelta));
    const { error: updateError } = await service
      .from("profiles")
      .update({ diamond_balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", body.id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    await service.from("diamond_transactions").insert({
      user_id: body.id,
      amount: Math.trunc(body.balanceDelta),
      reason: `admin_adjust by ${userId}`
    });
  }

  if (typeof body.isAdmin === "boolean") {
    if (body.id === userId && body.isAdmin === false) {
      return NextResponse.json({ error: "Cannot remove your own admin role" }, { status: 400 });
    }
    const { error: adminError } = await service
      .from("profiles")
      .update({ is_admin: body.isAdmin, updated_at: new Date().toISOString() })
      .eq("id", body.id);
    if (adminError) return NextResponse.json({ error: adminError.message }, { status: 500 });
  }

  const { data: updated } = await service
    .from("profiles")
    .select("id,email,display_name,diamond_balance,is_admin,locale,created_at")
    .eq("id", body.id)
    .maybeSingle();

  return NextResponse.json({ user: updated });
}

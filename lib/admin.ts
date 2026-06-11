import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("服务端未配置 SUPABASE_SERVICE_ROLE_KEY，请在 Vercel 环境变量中添加后重新部署。");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type AdminContext = { service: SupabaseClient; userId: string };

export async function requireAdmin(
  request: Request
): Promise<{ ok: true; ctx: AdminContext } | { ok: false; status: number; message: string }> {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { ok: false, status: 401, message: "Missing token" };

  let service: SupabaseClient;
  try {
    service = getServiceClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server not configured";
    return { ok: false, status: 500, message };
  }

  const { data, error } = await service.auth.getUser(token);
  if (error || !data.user) return { ok: false, status: 401, message: "Invalid token" };

  const { data: profile } = await service
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!profile?.is_admin) return { ok: false, status: 403, message: "Not an admin" };

  return { ok: true, ctx: { service, userId: data.user.id } };
}

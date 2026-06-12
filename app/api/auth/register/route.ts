import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

const LOGIN_DOMAIN = "example.com";
const USERNAME_RE = /^[a-zA-Z0-9]{4,20}$/;

export async function POST(request: Request) {
  let body: { username?: string; password?: string; nickname?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式不正确。" }, { status: 400 });
  }

  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const nickname = String(body.nickname || "").trim() || username;

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json({ error: "用户名需为 4-20 位英文字母或数字。" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少 6 位。" }, { status: 400 });
  }

  let service;
  try {
    service = getServiceClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务端注册未配置。" },
      { status: 500 }
    );
  }

  const { data: existingProfile, error: existingError } = await service
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (existingProfile) return NextResponse.json({ error: "该用户名已被占用。" }, { status: 409 });

  const email = `${username}@${LOGIN_DOMAIN}`;
  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, display_name: nickname }
  });
  if (createError) {
    const message =
      createError.message.includes("already") || createError.message.includes("registered")
        ? "该用户名已被占用。"
        : createError.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const userId = created.user?.id;
  if (!userId) return NextResponse.json({ error: "注册失败，请稍后再试。" }, { status: 500 });

  const { error: profileError } = await service.from("profiles").upsert({
    id: userId,
    email,
    username,
    display_name: nickname,
    locale: "zh",
    updated_at: new Date().toISOString()
  });
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json({ ok: true, email, username });
}

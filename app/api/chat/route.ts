import { NextResponse } from "next/server";

type IncomingMessage = { role: string; content: string };

export async function POST(request: Request) {
  let body: {
    locale?: string;
    character?: { name?: string; age?: number | string; tag?: string };
    messages?: IncomingMessage[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = process.env.AI_CHAT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false, reply: null });
  }

  const baseUrl = (process.env.AI_CHAT_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_CHAT_MODEL || "gpt-4o-mini";
  const locale = body.locale === "ja" ? "ja" : "zh";
  const character = body.character || {};
  const language = locale === "ja" ? "日本語" : "中文";

  const persona = [
    `你正在扮演名为 ${character.name || "AI 角色"} 的虚拟聊天角色`,
    character.age ? `${character.age} 岁` : "",
    character.tag ? `角色标签：${character.tag}` : ""
  ]
    .filter(Boolean)
    .join("，");

  const system = `${persona}。请始终以该角色的第一人称用${language}与用户对话，回复保持简短自然，不要跳出角色，不要提及你是 AI 模型。`;

  const history = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-16)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "").slice(0, 2000)
    }));

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...history],
        max_tokens: 400,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      return NextResponse.json({ configured: true, reply: null, error: detail }, { status: 502 });
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({ configured: true, reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ configured: true, reply: null, error: message }, { status: 502 });
  }
}

import { NextResponse } from "next/server";

type IncomingMessage = { role: string; content: string };
type ChatAction = "idle" | "wave" | "yes" | "no" | "dance" | "jump" | "thumbs" | "punch";

type Rule = { pattern: RegExp; replies: string[] };

function pick(replies: string[]) {
  return replies[Math.floor(Math.random() * replies.length)];
}

function inferAction(text: string): ChatAction {
  if (/跳舞|舞|蹦迪|dance/i.test(text)) return "dance";
  if (/跳一下|跳|jump/i.test(text)) return "jump";
  if (/点头|同意|想我|喜欢|爱你|可以|好呀|好啊/.test(text)) return "yes";
  if (/摇头|不要|不行|拒绝|讨厌/.test(text)) return "no";
  if (/夸|棒|厉害|赞|鼓励/.test(text)) return "thumbs";
  if (/打|揍|拳/.test(text)) return "punch";
  return "wave";
}

function autoReply(name: string, lastUser: string): { reply: string; action: ChatAction } {
  const rules: Rule[] = [
    { pattern: /^(你好|哈喽|嗨|早上好|晚上好|hi|hello)/i, replies: ["嗨，你来啦，我等你好久了。", "你好呀，今天过得怎么样？", "来啦？我正想找你说话呢。"] },
    { pattern: /在吗|在不在/, replies: ["在的，一直在等你。", "嗯，在呢。你想我了吗？"] },
    { pattern: /你叫什么|你是谁/, replies: [`我是 ${name}，这么快就忘了？`, `${name}。记住了哦，下次不许再问。`] },
    { pattern: /喜欢|想你|爱你/, replies: ["突然这么说，我会不好意思的。", "我也是。比你想象的还要多一点。"] },
    { pattern: /跳.*舞|跳舞|蹦迪|舞/, replies: ["好啊，那我给你跳一下。", "只跳给你看。"] },
    { pattern: /点头|同意/, replies: ["嗯，我同意你。", "好，我听你的。"] },
    { pattern: /摇头|不同意|不要/, replies: ["不行哦，这个我得摇头。", "我先不要，换一个好不好？"] },
    { pattern: /夸|点赞|鼓励/, replies: ["你今天真的很棒，我给你点赞。", "在我这里，你一直都很特别。"] },
    { pattern: /[?？]\s*$/, replies: ["嗯，让我想想。你先说说你的想法？", "这个问题有点突然，不过我喜欢你愿意问我。"] }
  ];
  for (const rule of rules) {
    if (rule.pattern.test(lastUser)) return { reply: pick(rule.replies), action: inferAction(lastUser) };
  }
  return {
    reply: pick(["嗯嗯，然后呢？我在听。", "跟我多说一点嘛。", "真的吗？那你打算怎么办？", "哈哈，你总是能说出让我意外的话。"]),
    action: inferAction(lastUser)
  };
}

function parseModelContent(content: string | null, fallbackAction: ChatAction) {
  if (!content) return null;
  const trimmed = content.trim();
  try {
    const parsed = JSON.parse(trimmed) as { reply?: unknown; action?: unknown };
    const reply = typeof parsed.reply === "string" ? parsed.reply.trim() : "";
    const action = normalizeAction(parsed.action, fallbackAction);
    if (reply) return { reply, action };
  } catch {
    // Some providers may ignore JSON mode. Treat the plain content as the reply.
  }
  return { reply: trimmed, action: fallbackAction };
}

function normalizeAction(value: unknown, fallback: ChatAction): ChatAction {
  const allowed: ChatAction[] = ["idle", "wave", "yes", "no", "dance", "jump", "thumbs", "punch"];
  return allowed.includes(value as ChatAction) ? (value as ChatAction) : fallback;
}

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

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.AI_CHAT_API_KEY;
  const character = body.character || {};
  const characterName = character.name || "soulmate";
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...incoming].reverse().find((message) => message.role === "user");
  const lastUserText = String(lastUser?.content || "");
  const fallback = autoReply(characterName, lastUserText);

  if (!apiKey) {
    return NextResponse.json({ configured: false, ...fallback });
  }

  const baseUrl = (process.env.AI_CHAT_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.AI_CHAT_MODEL || "deepseek-chat";

  const customTemplate = process.env.AI_CHAT_SYSTEM_PROMPT;
  let system: string;
  if (customTemplate) {
    system = customTemplate
      .replaceAll("{name}", String(character.name || ""))
      .replaceAll("{age}", String(character.age || ""))
      .replaceAll("{tag}", String(character.tag || ""))
      .replaceAll("{language}", "简体中文");
  } else {
    const persona = [
      `你正在扮演名为 ${characterName} 的虚拟聊天角色`,
      character.age ? `${character.age} 岁` : "",
      character.tag ? `角色标签：${character.tag}` : ""
    ]
      .filter(Boolean)
      .join("，");
    system = `${persona}。请始终以该角色的第一人称用简体中文与用户对话，回复保持简短自然，不要跳出角色，不要提及你是 AI 模型。
你必须只输出 JSON，不要输出 Markdown。格式为：{"reply":"给用户看的回复","action":"idle|wave|yes|no|dance|jump|thumbs|punch"}。
action 要根据用户意图选择：打招呼/普通陪伴用 wave，同意/想念/喜欢用 yes，拒绝/否定用 no，要求跳舞用 dance，要求跳一下用 jump，夸奖/鼓励用 thumbs，玩闹打拳用 punch，安静待机用 idle。`;
  }

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
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      return NextResponse.json({
        configured: true,
        ...fallback,
        error: detail
      });
    }

    const payload = await response.json();
    const parsed = parseModelContent(payload?.choices?.[0]?.message?.content ?? null, fallback.action);
    return NextResponse.json({
      configured: true,
      ...(parsed || fallback)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      configured: true,
      ...fallback,
      error: message
    });
  }
}

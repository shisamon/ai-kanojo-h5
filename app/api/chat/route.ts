import { NextResponse } from "next/server";

type IncomingMessage = { role: string; content: string };

type Rule = { pattern: RegExp; replies: string[] };

function pick(replies: string[]) {
  return replies[Math.floor(Math.random() * replies.length)];
}

function autoReply(locale: "zh" | "ja", name: string, lastUser: string): string {
  const rules: Rule[] =
    locale === "ja"
      ? [
          { pattern: /^(こんにちは|こんばんは|おはよう|やあ|ハロー|hi|hello)/i, replies: ["やっと来た！待ってたよ。", "こんにちは。今日はどんな一日だった？", "来てくれたんだ、嬉しい。"] },
          { pattern: /いる？|いますか|いるの/, replies: ["いるよ、ずっと待ってた。", "うん、ここにいるよ。会いたかった？"] },
          { pattern: /名前|誰|だれ/, replies: [`${name}だよ。もう忘れちゃったの？`, `${name}。ちゃんと覚えててね。`] },
          { pattern: /好き|会いたい|愛してる/, replies: ["急にそんなこと言われたら、照れちゃう……", "私も。あなたが思ってるより、ずっとね。"] },
          { pattern: /動画|写真|画像|アルバム/, replies: ["見たいなら、下の「動画をリクエスト」を押してね。", "アルバムに新しいのがあるよ、見てみて。"] },
          { pattern: /[?？]\s*$/, replies: ["うーん、ちょっと考えさせて。あなたはどう思う？", "いい質問だね。先にあなたの答えを聞きたいな。"] }
        ]
      : [
          { pattern: /^(你好|哈喽|嗨|早上好|晚上好|hi|hello)/i, replies: ["嗨～你来啦，我等你好久了。", "你好呀，今天过得怎么样？", "来啦？我正想找你说话呢。"] },
          { pattern: /在吗|在不在/, replies: ["在的在的，一直在等你。", "嗯，在呢。你想我了吗？"] },
          { pattern: /你叫什么|你是谁/, replies: [`我是 ${name} 呀，这么快就忘了？`, `${name}。记住了哦，下次不许再问。`] },
          { pattern: /喜欢|想你|爱你/, replies: ["突然这么说，我会脸红的……", "我也是。比你想象的还要多一点。"] },
          { pattern: /视频|照片|图片|相册/, replies: ["想看的话，点下面的「请求视频」按钮嘛。", "相册里有新内容哦，点「相册」看看。"] },
          { pattern: /[?？]\s*$/, replies: ["嗯……让我想想。你先说说你的想法？", "这个问题有点突然，不过我喜欢你愿意问我。"] }
        ];

  for (const rule of rules) {
    if (rule.pattern.test(lastUser)) return pick(rule.replies);
  }
  return pick(
    locale === "ja"
      ? ["うんうん、それで？聞いてるよ。", "もっと聞かせて。", "ほんと？どうするつもり？", "ふふ、あなたって面白いね。"]
      : ["嗯嗯，然后呢？我在听。", "跟我多说一点嘛。", "真的吗？那你打算怎么办？", "哈哈，你总是能说出让我意外的话。"]
  );
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

  const apiKey = process.env.AI_CHAT_API_KEY;
  const locale = body.locale === "ja" ? "ja" : "zh";
  const character = body.character || {};
  const characterName = character.name || (locale === "ja" ? "AIキャラ" : "AI 角色");
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...incoming].reverse().find((message) => message.role === "user");
  const lastUserText = String(lastUser?.content || "");

  if (!apiKey) {
    return NextResponse.json({ configured: false, reply: autoReply(locale, characterName, lastUserText) });
  }

  const baseUrl = (process.env.AI_CHAT_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_CHAT_MODEL || "gpt-4o-mini";
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
      return NextResponse.json({
        configured: true,
        reply: autoReply(locale, characterName, lastUserText),
        error: detail
      });
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({
      configured: true,
      reply: reply || autoReply(locale, characterName, lastUserText)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      configured: true,
      reply: autoReply(locale, characterName, lastUserText),
      error: message
    });
  }
}

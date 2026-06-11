import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

type CharacterInput = {
  id?: string;
  name?: string;
  age?: number | string;
  tag?: string;
  image?: string;
};

type TemplateInput = {
  id?: string;
  name?: string;
  cost?: number | string;
  mode?: string;
  image?: string;
};

type GenerateBody = {
  locale?: string;
  character?: CharacterInput;
  template?: TemplateInput;
  cost?: number | string;
  mode?: string;
  prompt?: string;
  previewImage?: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BLOCKED_PROMPT_RE =
  /(未成年|未滿|未满|儿童|兒童|小孩|幼女|萝莉|蘿莉|初中|高中|minor|underage|loli|schoolgirl|rape|强迫|強迫|偷拍|非自愿|非自願|non[-\s]?consensual|celebrity|明星|名人|deepfake)/i;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

function getBearerToken(request: Request) {
  return (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
}

function getAuthedClient(token: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("服务端未配置 Supabase 匿名密钥。");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

function cleanText(value: unknown, fallback = "") {
  const text = typeof value === "string" ? value : fallback;
  return text.replace(/\s+/g, " ").trim().slice(0, 500);
}

function parseCost(body: GenerateBody) {
  const raw = body.cost ?? body.template?.cost ?? 0;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100000, Math.trunc(parsed)));
}

function parseAge(age: CharacterInput["age"]) {
  if (age === undefined || age === null || age === "") return null;
  const parsed = Number(age);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeImageUrl(...values: unknown[]) {
  for (const value of values) {
    if (typeof value !== "string") continue;
    if (value.startsWith("data:image/") || /^https?:\/\//i.test(value)) return value;
  }
  return "";
}

function findMediaUrl(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
    return null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findMediaUrl(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const preferredKeys = ["video_url", "videoUrl", "url", "media_url", "output_url", "file", "mp4"];
    for (const key of preferredKeys) {
      const found = findMediaUrl(record[key]);
      if (found) return found;
    }
    for (const item of Object.values(record)) {
      const found = findMediaUrl(item);
      if (found) return found;
    }
  }
  return null;
}

async function refundDiamonds(service: SupabaseClient, userId: string, amount: number, reason: string) {
  if (amount <= 0) return;
  const { data: profile } = await service
    .from("profiles")
    .select("diamond_balance")
    .eq("id", userId)
    .maybeSingle();
  const currentBalance = Number(profile?.diamond_balance ?? 0);
  await service
    .from("profiles")
    .update({ diamond_balance: currentBalance + amount, updated_at: new Date().toISOString() })
    .eq("id", userId);
  await service.from("diamond_transactions").insert({ user_id: userId, amount, reason });
}

async function callRunpodVideo(input: {
  prompt: string;
  previewImage: string;
  character: CharacterInput;
  template: TemplateInput;
}) {
  const endpoint = process.env.RUNPOD_VIDEO_ENDPOINT;
  const apiKey = process.env.RUNPOD_API_KEY;
  if (!endpoint || !apiKey) {
    return {
      configured: false,
      mediaUrl: input.previewImage,
      thumbnailUrl: input.previewImage,
      providerJobId: null
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      input: {
        prompt: input.prompt,
        image: input.previewImage,
        character: input.character,
        template: input.template
      }
    })
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(detail || `RunPod request failed: ${response.status}`);
  }

  const payload = await response.json();
  const mediaUrl = findMediaUrl(payload?.output) || findMediaUrl(payload);
  const providerJobId = payload?.id || payload?.jobId || payload?.status_url || null;
  return {
    configured: true,
    mediaUrl: mediaUrl || input.previewImage,
    thumbnailUrl: input.previewImage,
    providerJobId
  };
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) return jsonError("Missing token", 401, "AUTH_REQUIRED");

  let service: SupabaseClient;
  try {
    service = getServiceClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server not configured";
    return jsonError(message, 500, "SERVER_NOT_CONFIGURED");
  }

  const { data: authData, error: authError } = await service.auth.getUser(token);
  if (authError || !authData.user) return jsonError("Invalid token", 401, "AUTH_REQUIRED");
  const userId = authData.user.id;

  let body: GenerateBody;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON", 400, "INVALID_JSON");
  }

  if (body.mode && body.mode !== "video") {
    return jsonError("当前接口只支持视频创作。", 400, "VIDEO_ONLY");
  }

  const character = body.character || {};
  const template = body.template || {};
  const characterName = cleanText(character.name, "AI 角色");
  const templateName = cleanText(template.name, "视频风格");
  const age = parseAge(character.age);
  if (age !== null && age < 18) return jsonError("只能使用成年人形象。", 400, "ADULT_ONLY");

  const prompt = cleanText(
    body.prompt,
    `${characterName}，${templateName}风格，保持人物特征一致，生成短视频。`
  );
  const safetyText = [prompt, characterName, character.tag, templateName].filter(Boolean).join(" ");
  if (BLOCKED_PROMPT_RE.test(safetyText)) {
    return jsonError("该创作请求不符合安全规则。", 400, "SAFETY_BLOCKED");
  }

  const previewImage = safeImageUrl(body.previewImage, template.image, character.image);
  if (!previewImage) return jsonError("Missing preview image", 400, "MISSING_PREVIEW");

  const cost = parseCost(body);
  const title = `${characterName} · ${templateName}`;
  const characterId = character.id && UUID_RE.test(character.id) ? character.id : null;

  let jobId: string | null = null;
  let spent = false;
  try {
    const { data: job, error: jobError } = await service
      .from("creation_jobs")
      .insert({
        user_id: userId,
        character_id: characterId,
        template_name: templateName,
        mode: "video",
        prompt,
        status: "queued",
        cost
      })
      .select("id")
      .single();
    if (jobError) throw jobError;
    jobId = job?.id || null;

    if (cost > 0) {
      const userClient = getAuthedClient(token);
      const { data: newBalance, error: spendError } = await userClient.rpc("spend_diamonds", {
        amount: cost,
        reason: `${templateName} · 视频`
      });
      if (spendError) {
        await service
          .from("creation_jobs")
          .update({ status: "failed", completed_at: new Date().toISOString() })
          .eq("id", jobId);
        return jsonError("钻石余额不足。", 402, "INSUFFICIENT_BALANCE");
      }
      spent = true;
      await service.from("creation_jobs").update({ status: "running" }).eq("id", jobId);

      const provider = await callRunpodVideo({ prompt, previewImage, character, template });
      const { data: work, error: workError } = await service
        .from("works")
        .insert({
          user_id: userId,
          character_id: characterId,
          title,
          mode: "video",
          media_url: provider.mediaUrl,
          thumbnail_url: provider.thumbnailUrl,
          cost,
          visibility: "private"
        })
        .select("id,title,mode,media_url,thumbnail_url,cost,visibility,created_at")
        .single();
      if (workError) throw workError;

      await service
        .from("creation_jobs")
        .update({
          status: "completed",
          result_work_id: work?.id || null,
          completed_at: new Date().toISOString()
        })
        .eq("id", jobId);

      return NextResponse.json({
        configured: provider.configured,
        jobId,
        providerJobId: provider.providerJobId,
        balance: typeof newBalance === "number" ? newBalance : null,
        work: {
          id: work.id,
          title: work.title,
          mode: work.mode,
          mediaUrl: work.media_url,
          thumbnailUrl: work.thumbnail_url,
          image: work.thumbnail_url || work.media_url,
          cost: work.cost,
          visibility: work.visibility,
          createdAt: work.created_at
        }
      });
    }

    await service.from("creation_jobs").update({ status: "running" }).eq("id", jobId);
    const provider = await callRunpodVideo({ prompt, previewImage, character, template });
    const { data: profile } = await service
      .from("profiles")
      .select("diamond_balance")
      .eq("id", userId)
      .maybeSingle();
    const { data: work, error: workError } = await service
      .from("works")
      .insert({
        user_id: userId,
        character_id: characterId,
        title,
        mode: "video",
        media_url: provider.mediaUrl,
        thumbnail_url: provider.thumbnailUrl,
        cost,
        visibility: "private"
      })
      .select("id,title,mode,media_url,thumbnail_url,cost,visibility,created_at")
      .single();
    if (workError) throw workError;
    await service
      .from("creation_jobs")
      .update({
        status: "completed",
        result_work_id: work?.id || null,
        completed_at: new Date().toISOString()
      })
      .eq("id", jobId);

    return NextResponse.json({
      configured: provider.configured,
      jobId,
      providerJobId: provider.providerJobId,
      balance: profile?.diamond_balance ?? null,
      work: {
        id: work.id,
        title: work.title,
        mode: work.mode,
        mediaUrl: work.media_url,
        thumbnailUrl: work.thumbnail_url,
        image: work.thumbnail_url || work.media_url,
        cost: work.cost,
        visibility: work.visibility,
        createdAt: work.created_at
      }
    });
  } catch (error) {
    if (jobId) {
      await service
        .from("creation_jobs")
        .update({ status: "failed", completed_at: new Date().toISOString() })
        .eq("id", jobId);
    }
    if (spent) await refundDiamonds(service, userId, cost, "generation_refund");
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message, 500, "GENERATION_FAILED");
  }
}

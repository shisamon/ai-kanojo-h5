const locale = document.documentElement.lang.startsWith("ja") || location.pathname.startsWith("/ja") ? "ja" : "zh";

const supabaseClient =
  window.supabase && window.__SUPABASE_URL__ && window.__SUPABASE_ANON_KEY__
    ? window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__)
    : null;

const isUuid = (value) =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const isVideoUrl = (url) => typeof url === "string" && /\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(url);

const LOGIN_DOMAIN = "example.com";
const LEGACY_LOGIN_DOMAINS = ["aiai.com", "openlover.app"];
const normalizeLoginEmail = (value, domain = LOGIN_DOMAIN) => (value.includes("@") ? value : `${value}@${domain}`);
const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;

const dictionary = {
  zh: {
    ready: "准备就绪",
    generationQueued: "任务已创建",
    generationRunning: "视频生成中",
    generationSaved: "视频已生成，已保存到我的视频。",
    generationFailed: "创作失败，请稍后再试。",
    coins: "钻石",
    complete: "已完成",
    noHistory: "还没有生成过视频。",
    selectedPayment: (payment) => `已选择 ${payment}，下一步进入支付确认。`,
    profileSaved: "昵称已保存。",
    deleteSubmitted: "账户删除请求已提交。",
    login: "登录",
    logout: "退出登录",
    authLoginAction: "登录",
    authRegisterAction: "注册",
    authWelcome: "登录成功。",
    authSignedUp: "注册成功，已自动登录。",
    authConfirmEmail: "注册成功，请到邮箱完成确认后再登录。",
    authRegisterFailed: "注册失败，请稍后再试。",
    authSignedOut: "已退出登录。",
    authRequired: "请先登录。",
    authGateRequired: "请先登录或注册，之后就可以创建你的 soulmate。",
    usernamePlaceholder: "用户名（6-20 位字母或数字）",
    loginPlaceholder: "用户名",
    usernameRule: "用户名需为 6-20 位英文字母或数字。",
    usernameTaken: "该用户名已被占用。",
    passwordMismatch: "两次输入的密码不一致。",
    passwordTooShort: "密码至少 6 位。",
    passwordChanged: "密码已修改。",
    notLoggedIn: "未登录",
    guestName: "游客",
    chatPlaceholderReply: "（角色回复将在接入对话模型后上线）",
    uploadedReady: "已选择上传图片。",
    gfNameRequired: "先给 soulmate 起个名字。",
    gfImageRequired: "选择一个形象或上传图片。",
    gfSaved: "你的 soulmate 已创建。",
    gfOnboardingTitle: "选择你的第一位 soulmate",
    gfOnboardingHint: "选择一个形象或上传图片，保存后进入陪伴首页。",
    gfSwitched: (name) => `已切换到 ${name}。`,
    affinityLevelUp: (level) => `亲密度升级！Lv.${level}`,
    gfDeleted: "已删除该 soulmate。",
    gfDeleteConfirm: (name) => `确定删除 ${name} 吗？`,
    noGirlfriend: "还没有 soulmate，先定制一个吧",
    newGirlfriend: "新建",
    addGirlfriend: "新增 soulmate",
    addGirlfriendHint: "定制新的陪伴对象",
    chatGreeting: (name) => `我是 ${name}，今天想我了吗？`,
    stageMoods: ["今天也在等你。", "点我一下，我会有反应哦。", "想聊天、拍视频，还是换一套形象？", "我会记住你选择的样子。"],
    stageOnline: "在线陪伴中",
    stageCustomizeHint: "先定制我",
    prompt: (template, character) => `${character.name}，${template.name}风格，保持人物特征一致，生成短视频。`
  },
  ja: {
    ready: "準備完了",
    generationQueued: "タスクを作成しました",
    generationRunning: "動画を生成中",
    generationSaved: "動画を生成し、マイ動画に保存しました。",
    generationFailed: "作成に失敗しました。時間をおいて再試行してください。",
    coins: "ダイヤ",
    complete: "完了",
    noHistory: "まだ動画がありません。",
    selectedPayment: (payment) => `${payment} を選択しました。次は支払い確認です。`,
    profileSaved: "ニックネームを保存しました。",
    deleteSubmitted: "アカウント削除リクエストを送信しました。",
    login: "ログイン",
    logout: "ログアウト",
    authLoginAction: "ログイン",
    authRegisterAction: "登録",
    authWelcome: "ログインしました。",
    authSignedUp: "登録が完了し、ログインしました。",
    authConfirmEmail: "登録完了。確認メールをチェックしてください。",
    authRegisterFailed: "登録に失敗しました。時間をおいて再試行してください。",
    authSignedOut: "ログアウトしました。",
    authRequired: "先にログインしてください。",
    authGateRequired: "ログインまたは登録後、soulmateを作成できます。",
    usernamePlaceholder: "ユーザー名（英数字6-20文字）",
    loginPlaceholder: "ユーザー名",
    usernameRule: "ユーザー名は英数字6-20文字にしてください。",
    usernameTaken: "このユーザー名は既に使われています。",
    passwordMismatch: "パスワードが一致しません。",
    passwordTooShort: "パスワードは6文字以上。",
    passwordChanged: "パスワードを変更しました。",
    notLoggedIn: "未ログイン",
    guestName: "ゲスト",
    chatPlaceholderReply: "（キャラクターの返信は対話モデル接続後に対応します）",
    uploadedReady: "アップロード画像を選択しました。",
    gfNameRequired: "先に名前をつけてください。",
    gfImageRequired: "形象を選ぶか画像をアップロードしてください。",
    gfSaved: "soulmateを作成しました。",
    gfOnboardingTitle: "最初のsoulmateを選択",
    gfOnboardingHint: "形象を選ぶか画像をアップロードして、保存後にホームへ進みます。",
    gfSwitched: (name) => `${name} に切り替えました。`,
    affinityLevelUp: (level) => `親密度がアップ！Lv.${level}`,
    gfDeleted: "soulmateを削除しました。",
    gfDeleteConfirm: (name) => `${name} を削除しますか？`,
    noGirlfriend: "まだsoulmateがいません。カスタマイズしましょう",
    newGirlfriend: "新規",
    addGirlfriend: "soulmateを追加",
    addGirlfriendHint: "新しい相手を作成",
    chatGreeting: (name) => `${name}だよ。今日も会いに来てくれたの？`,
    stageMoods: ["今日も待ってたよ。", "タップすると反応するよ。", "チャット、動画、カスタム。何をする？", "選んだ姿を覚えておくね。"],
    stageOnline: "オンライン",
    stageCustomizeHint: "まずカスタム",
    prompt: (template, character) => `${character.name}、${template.name}スタイル、人物の特徴を保った短い動画。`
  }
};

const t = dictionary[locale];

// Keyboard handling: lock the stage to the full (pre-keyboard) viewport height
// so the girlfriend area never moves, and float the chat composer just above
// the keyboard via --kb (keyboard height). On mobile, focusing the composer
// immediately switches the girlfriend into a face-only landscape crop.
(function trackViewportHeight() {
  const vv = window.visualViewport;
  const root = document.documentElement;
  let fullHeight = window.innerHeight;
  let composerFocused = false;

  const shouldUseKeyboardFrame = (kb) => {
    const mobileLike = window.innerWidth <= 720 || (window.navigator?.maxTouchPoints ?? 0) > 0;
    return kb > 90 || (composerFocused && mobileLike);
  };

  const keepStageAtTop = () => {
    if (!document.body.classList.contains("gf-keyboard-active")) return;
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 80);
  };

  const updateKeyboardFrame = (kb) => {
    const home = document.getElementById("view-home");
    const active = shouldUseKeyboardFrame(kb);
    if (home) home.classList.toggle("kb-open", active);
    document.body.classList.toggle("gf-keyboard-active", active);
    if (active) keepStageAtTop();
  };
  const openKeyboardFrame = () => {
    composerFocused = true;
    const home = document.getElementById("view-home");
    if (home) home.classList.add("kb-open");
    document.body.classList.add("gf-keyboard-active");
    keepStageAtTop();
    setKb();
  };
  window.keepStageKeyboardOpen = openKeyboardFrame;
  const isStageInput = (target) => target?.id === "stageChatInput";

  const setFull = () => {
    fullHeight = Math.max(fullHeight, window.innerHeight);
    root.style.setProperty("--full-height", `${Math.round(fullHeight)}px`);
  };
  const setKb = () => {
    const visible = vv ? vv.height : window.innerHeight;
    const kb = Math.max(0, Math.round(fullHeight - visible));
    root.style.setProperty("--kb", `${kb}px`);
    root.style.setProperty("--app-height", `${Math.round(visible)}px`);
    updateKeyboardFrame(kb);
  };

  setFull();
  setKb();
  document.addEventListener("pointerdown", (event) => {
    if (isStageInput(event.target)) openKeyboardFrame();
  });
  document.addEventListener("click", (event) => {
    if (isStageInput(event.target)) openKeyboardFrame();
  });
  document.addEventListener("input", (event) => {
    if (isStageInput(event.target)) openKeyboardFrame();
  });
  document.addEventListener("focusin", (event) => {
    if (event.target?.id === "stageChatInput") {
      openKeyboardFrame();
    }
  });
  document.addEventListener("focusout", (event) => {
    if (event.target?.id === "stageChatInput") {
      composerFocused = false;
      setTimeout(setKb, 120);
    }
  });
  if (vv) {
    vv.addEventListener("resize", setKb);
    vv.addEventListener("scroll", setKb);
  }
  window.addEventListener("orientationchange", () => {
    // On rotation the real full height changes; reset baseline.
    fullHeight = 0;
    setTimeout(() => {
      fullHeight = window.innerHeight;
      setFull();
      setKb();
    }, 250);
  });
})();

// ---------- state ----------
let session = null;
let profile = null;
let balance = 0;
let girlfriends = [];
let activeGirlfriend = null;
let publicCharacters = [];
let videoTemplates = [];
let currentTemplate = null;
let history = [];
let uploadedImage = "";
let customizeSelection = null;
let authScreenMode = "login";
let chatBusy = false;
let moodIndex = 0;
let publicCharactersReady = false;
let onboardingActive = false;
let pendingSignupOnboarding = false;
const chatSessionIds = new Map();
const chatTranscripts = new Map();
const hydratedChats = new Set();

// ---------- helpers ----------
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));
const toast = qs("#toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function seeded(seed) {
  let value = seed * 9301 + 49297;
  return () => {
    value = (value * 233280 + 49297) % 2147483647;
    return value / 2147483647;
  };
}

function makePortrait(seed, name, tag) {
  const rand = seeded(seed);
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  const colors = [
    ["#ff7eb3", "#31d6c8", "#101116"],
    ["#f3c96b", "#73a7ff", "#141019"],
    ["#ff667d", "#b4e35d", "#101417"],
    ["#d947ea", "#ff8abc", "#111116"],
    ["#31d6c8", "#f3c96b", "#121216"]
  ][seed % 5];
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, colors[0]);
  bg.addColorStop(0.48, colors[1]);
  bg.addColorStop(1, colors[2]);
  ctx.save();
  ctx.fillStyle = bg;
  ctx.globalAlpha = 0.42;
  ctx.beginPath();
  ctx.ellipse(260, 340, 178, 280, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + rand() * 0.06})`;
    ctx.beginPath();
    ctx.arc(rand() * 520, rand() * 680, 20 + rand() * 80, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.translate(260, 88);
  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.ellipse(0, 250, 146, 252, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = seed % 2 ? "#342033" : "#241b2f";
  ctx.beginPath();
  ctx.ellipse(0, 178, 100, 146, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd2c5";
  ctx.beginPath();
  ctx.ellipse(0, 126, 72, 84, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = seed % 3 ? "#2b1b2d" : "#59402d";
  ctx.beginPath();
  ctx.arc(0, 94, 78, Math.PI * 0.96, Math.PI * 2.06);
  ctx.lineTo(92, 246);
  ctx.quadraticCurveTo(16, 224, -88, 250);
  ctx.lineTo(-78, 118);
  ctx.fill();
  ctx.fillStyle = "#251720";
  [-28, 30].forEach((x) => {
    ctx.beginPath();
    ctx.ellipse(x, 130, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "rgba(131,54,72,.62)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 154, 18, 0.08, Math.PI - 0.08);
  ctx.stroke();
  const outfit = ctx.createLinearGradient(-88, 246, 88, 438);
  outfit.addColorStop(0, colors[0]);
  outfit.addColorStop(1, colors[1]);
  ctx.fillStyle = outfit;
  ctx.beginPath();
  ctx.moveTo(-86, 284);
  ctx.quadraticCurveTo(0, 228, 86, 284);
  ctx.lineTo(122, 548);
  ctx.lineTo(-122, 548);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.24)";
  ctx.beginPath();
  ctx.moveTo(-32, 270);
  ctx.lineTo(0, 326);
  ctx.lineTo(34, 270);
  ctx.quadraticCurveTo(0, 254, -32, 270);
  ctx.fill();
  ctx.restore();
  return canvas.toDataURL("image/png");
}

function makeScene(seed, title, mode) {
  const rand = seeded(seed);
  const canvas = document.createElement("canvas");
  canvas.width = 560;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  const palette = [
    ["#ff4d9a", "#31d6c8", "#101116"],
    ["#73a7ff", "#f3c96b", "#111116"],
    ["#ff667d", "#b4e35d", "#121216"],
    ["#f3c96b", "#ff8abc", "#0d1015"]
  ][seed % 4];
  const bg = ctx.createLinearGradient(0, 0, 560, 720);
  bg.addColorStop(0, palette[0]);
  bg.addColorStop(0.54, palette[1]);
  bg.addColorStop(1, palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 560, 720);
  for (let i = 0; i < 16; i += 1) {
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + rand() * 0.08})`;
    ctx.lineWidth = 2 + rand() * 4;
    ctx.beginPath();
    ctx.moveTo(rand() * 560, 0);
    ctx.lineTo(rand() * 560, 720);
    ctx.stroke();
  }
  if (mode === "video") {
    ctx.fillStyle = "rgba(49,214,200,.85)";
    ctx.beginPath();
    ctx.moveTo(244, 335);
    ctx.lineTo(244, 405);
    ctx.lineTo(306, 370);
    ctx.closePath();
    ctx.fill();
  }
  return canvas.toDataURL("image/png");
}

function makeUserAvatar(name) {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, 160, 160);
  bg.addColorStop(0, "#73a7ff");
  bg.addColorStop(1, "#ff8abc");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 160, 160);
  ctx.fillStyle = "rgba(255,255,255,.86)";
  ctx.beginPath();
  ctx.arc(80, 58, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(80, 122, 46, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(12,14,20,.72)";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText((name || "我").slice(0, 1).toUpperCase(), 80, 70);
  return canvas.toDataURL("image/png");
}

function hashValue(value) {
  return String(value || "")
    .split("")
    .reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 17);
}

const AFFINITY_MAX_LEVEL = 10;
const affinityLevelCost = (level) => level * 100; // Lv.n -> Lv.n+1 所需点数

function affinityFromPoints(points) {
  let level = 1;
  let remaining = Math.max(0, Number(points) || 0);
  while (level < AFFINITY_MAX_LEVEL && remaining >= affinityLevelCost(level)) {
    remaining -= affinityLevelCost(level);
    level += 1;
  }
  const need = affinityLevelCost(level);
  const percent =
    level >= AFFINITY_MAX_LEVEL ? 100 : Math.min(96, Math.round((remaining / need) * 100));
  return { level, percent: Math.max(4, percent) };
}

function getAffinity(gf) {
  const { level, percent } = affinityFromPoints(gf ? gf.affinity : 0);
  const palettes = [
    ["#ff3f5f", "#ff8a4c"],
    ["#ff7a3d", "#ffd166"],
    ["#ffd166", "#b4e35d"],
    ["#31d6c8", "#73a7ff"],
    ["#9d7cff", "#ff4d9a"]
  ];
  const [start, end] = palettes[Math.min(4, Math.floor((level - 1) / 2))];
  return { level, percent, start, end };
}

async function grantAffinity(gf) {
  if (!supabaseClient || !session || !gf || !isUuid(gf.id)) return;
  try {
    const { data } = await supabaseClient.rpc("add_affinity", { target_character: gf.id });
    if (!data || typeof data.affinity !== "number") return;
    const before = affinityFromPoints(gf.affinity).level;
    gf.affinity = data.affinity;
    const target = girlfriends.find((item) => item.id === gf.id);
    if (target) target.affinity = data.affinity;
    const after = affinityFromPoints(gf.affinity).level;
    renderStage();
    if (after > before) showToast(t.affinityLevelUp(after));
  } catch (error) {
    // Affinity is non-critical; ignore failures.
  }
}

// ---------- data loaders ----------
async function loadPublicCharacters() {
  try {
    const response = await fetch("/api/characters", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("characters");
    const payload = await response.json();
    if (Array.isArray(payload.characters) && payload.characters.length > 0) {
      publicCharacters = payload.characters.map((character, index) => ({
        id: character.id,
        name: character.name,
        age: character.age ?? "",
        tag: character.tag || "",
        image: character.image || makePortrait(index + 8, character.name, character.tag || "")
      }));
    }
  } catch (error) {
    const fallbackNames =
      locale === "ja"
        ? ["Mika", "Yui", "Rina", "Hana", "Sora", "Airi"]
        : ["小夏", "梨奈", "遥香", "美咲", "若澜", "奈奈"];
    const fallbackTags =
      locale === "ja"
        ? ["甘えん坊", "クール", "元気", "癒し系", "大人っぽい", "親友感"]
        : ["甜美陪伴", "冷感姐姐", "元气少女", "温柔治愈", "成熟优雅", "邻家感"];
    publicCharacters = Array.from({ length: 6 }, (_, index) => ({
      id: `local-${index}`,
      name: fallbackNames[index],
      age: "",
      tag: fallbackTags[index],
      image: makePortrait(index + 8, fallbackNames[index], fallbackTags[index])
    }));
  }
  publicCharactersReady = true;
  renderStage();
  renderCustomizeGrid();
  renderGfList();
  renderGfSwitcher();
  maybeStartOnboarding();
}

async function loadTemplates() {
  try {
    const response = await fetch(`/api/templates?locale=${locale}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("templates");
    const payload = await response.json();
    const videos = (Array.isArray(payload.templates) ? payload.templates : []).filter(
      (template) => template.mode === "video"
    );
    if (videos.length > 0) {
      videoTemplates = videos.map((template, index) => ({
        id: template.id,
        name: template.name,
        cost: template.cost,
        image: template.image || makeScene(index + 70, template.name, "video")
      }));
      currentTemplate = videoTemplates[0];
    }
  } catch (error) {
    // keep empty
  }
  renderTemplateGrid();
}

async function loadGirlfriends() {
  if (!supabaseClient || !session) return;
  const { data } = await supabaseClient
    .from("characters")
    .select("id,name,age,tag,image_url,created_at,affinity")
    .eq("owner_id", session.user.id)
    .order("created_at", { ascending: false });
  girlfriends = (Array.isArray(data) ? data : []).map((row, index) => ({
    id: row.id,
    name: row.name,
    age: row.age ?? "",
    tag: row.tag || "",
    affinity: row.affinity || 0,
    image: row.image_url || makePortrait(index + 30, row.name, row.tag || "")
  }));
  const activeId = profile && profile.active_character_id;
  activeGirlfriend = girlfriends.find((gf) => gf.id === activeId) || girlfriends[0] || null;
  renderStage();
  renderGfList();
  updateAuthUi();
  maybeStartOnboarding();
}

async function loadProfile() {
  if (!supabaseClient || !session) return;
  let { data } = await supabaseClient
    .from("profiles")
    .select("id,display_name,diamond_balance,username,active_character_id")
    .eq("id", session.user.id)
    .maybeSingle();
  if (!data) {
    const fallbackUsername = String(session.user.email || "").split("@")[0] || `user${Date.now()}`;
    const fallbackName = session.user.user_metadata?.display_name || fallbackUsername;
    const { data: created } = await supabaseClient
      .from("profiles")
      .insert({
        id: session.user.id,
        email: session.user.email,
        username: fallbackUsername,
        display_name: fallbackName,
        locale
      })
      .select("id,display_name,diamond_balance,username,active_character_id")
      .maybeSingle();
    data = created;
  }
  if (!data) return;
  profile = data;
  balance = data.diamond_balance;
  updateAuthUi();
  updateBalance();
  await loadGirlfriends();
}

async function loadHistory() {
  if (!supabaseClient || !session) return;
  const { data } = await supabaseClient
    .from("works")
    .select("id,title,mode,cost,thumbnail_url,media_url,created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(60);
  history = (Array.isArray(data) ? data : []).map((work, index) => ({
    id: work.id,
    title: work.title,
    mediaUrl: work.media_url,
    image:
      work.thumbnail_url ||
      (isVideoUrl(work.media_url) ? "" : work.media_url) ||
      makeScene(index + 200, work.title, "video")
  }));
  renderHistory();
}

// ---------- stage ----------
function renderStage() {
  const stageImage = qs("#stageImage");
  const stageName = qs("#stageName");
  const stageTag = qs("#stageTag");
  const stageEmpty = qs("#stageEmpty");
  const avatarMini = qs("#activeAvatarMini");
  const userAvatarMini = qs("#userAvatarMini");
  const relationshipLabel = qs("#relationshipLabel");
  const relationshipFill = qs("#relationshipFill");
  const subject = getStageSubject();
  const affinity = getAffinity(subject);
  if (stageImage) stageImage.style.setProperty("--avatar-hue", `${subject ? Math.abs(String(subject.id).length * 29) % 360 : 318}deg`);
  if (avatarMini) avatarMini.src = subject ? subject.image : makePortrait(3, "soulmate", "");
  if (userAvatarMini) userAvatarMini.src = makeUserAvatar(profile?.display_name || profile?.username || t.guestName);
  if (stageName) stageName.textContent = subject ? subject.name : "soulmate";
  if (stageTag) stageTag.textContent = subject && subject.tag ? subject.tag : t.stageCustomizeHint;
  if (relationshipLabel) relationshipLabel.textContent = `Lv.${affinity.level}`;
  if (relationshipFill) {
    relationshipFill.style.setProperty("--bond", `${affinity.percent}%`);
    relationshipFill.style.setProperty("--bond-start", affinity.start);
    relationshipFill.style.setProperty("--bond-end", affinity.end);
  }
  if (stageEmpty) stageEmpty.hidden = Boolean(subject);
  renderStageChatMessages();
}

function getStageSubject() {
  return activeGirlfriend || publicCharacters[0] || null;
}

async function setActiveGirlfriend(gf) {
  activeGirlfriend = gf;
  renderStage();
  renderGfList();
  renderGfSwitcher();
  updateAuthUi();
  if (supabaseClient && session && gf && isUuid(gf.id)) {
    await supabaseClient
      .from("profiles")
      .update({ active_character_id: gf.id, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);
    if (profile) profile.active_character_id = gf.id;
  }
}

// ---------- girlfriend list (me page) ----------
function renderGfList() {
  const list = qs("#gfList");
  if (!list) return;
  const choices = girlfriends.length > 0 ? girlfriends : publicCharacters;
  const cards = choices
    .map(
      (gf) => `
      <div class="gf-card ${activeGirlfriend && gf.id === activeGirlfriend.id ? "is-active" : ""}" data-gf="${gf.id}">
        <img src="${gf.image}" alt="${gf.name}" />
        <strong>${gf.name}</strong>
        ${girlfriends.some((item) => item.id === gf.id) ? `<button class="gf-delete" data-gf-delete="${gf.id}" aria-label="delete">×</button>` : ""}
      </div>
    `
    )
    .join("");
  list.innerHTML = cards || `<p class="legal">${t.noGirlfriend}</p>`;

  list.querySelectorAll("[data-gf]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-gf-delete]")) return;
      const gf = choices.find((item) => item.id === card.dataset.gf);
      if (gf) {
        setActiveGirlfriend(gf);
        switchView("home");
        showToast(t.gfSwitched(gf.name));
      }
    });
  });
  list.querySelectorAll("[data-gf-delete]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const gf = girlfriends.find((item) => item.id === button.dataset.gfDelete);
      if (!gf) return;
      if (!window.confirm(t.gfDeleteConfirm(gf.name))) return;
      if (supabaseClient && session && isUuid(gf.id)) {
        await supabaseClient.from("characters").delete().eq("id", gf.id).eq("owner_id", session.user.id);
      }
      girlfriends = girlfriends.filter((item) => item.id !== gf.id);
      if (activeGirlfriend && activeGirlfriend.id === gf.id) {
        activeGirlfriend = girlfriends[0] || null;
        if (activeGirlfriend) await setActiveGirlfriend(activeGirlfriend);
      }
      renderStage();
      renderGfList();
      showToast(t.gfDeleted);
    });
  });
}

function renderGfSwitcher() {
  const grid = qs("#gfSwitchGrid");
  if (!grid) return;
  const choices = girlfriends.length > 0 ? girlfriends : publicCharacters;
  const cards = choices
    .map((gf) => {
      const affinity = getAffinity(gf);
      return `
        <button class="gf-switch-card ${getStageSubject()?.id === gf.id ? "is-active" : ""}" data-switch-gf="${gf.id}">
          <img src="${gf.image}" alt="${gf.name}" />
          <strong>${gf.name}</strong>
          <small>Lv.${affinity.level}</small>
        </button>
      `;
    })
    .join("");
  const addCard = session
    ? `
        <button class="gf-switch-card gf-switch-add" data-add-gf type="button">
          <span>＋</span>
          <strong>${t.addGirlfriend}</strong>
          <small>${t.addGirlfriendHint}</small>
        </button>
      `
    : "";
  grid.innerHTML = cards + addCard;
  grid.querySelectorAll("[data-switch-gf]").forEach((button) => {
    button.addEventListener("click", () => {
      const gf = choices.find((item) => item.id === button.dataset.switchGf);
      if (!gf) return;
      setActiveGirlfriend(gf);
      closeDialog(qs("#girlfriendSwitchModal"));
      showToast(t.gfSwitched(gf.name));
    });
  });
  const addButton = grid.querySelector("[data-add-gf]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      closeDialog(qs("#girlfriendSwitchModal"));
      openCustomize();
    });
  }
}

// ---------- customize ----------
function renderCustomizeGrid() {
  const grid = qs("#personGrid");
  if (!grid) return;
  grid.innerHTML = publicCharacters
    .map(
      (character) => `
      <button class="person-card ${customizeSelection && customizeSelection.id === character.id ? "is-active" : ""}" data-id="${character.id}">
        <img src="${character.image}" alt="${character.name}" />
        <strong>${character.name}</strong>
      </button>
    `
    )
    .join("");
  grid.querySelectorAll(".person-card").forEach((card) => {
    card.addEventListener("click", () => {
      customizeSelection = publicCharacters.find((item) => item.id === card.dataset.id) || null;
      uploadedImage = "";
      const uploadCard = qs("#uploadCard");
      if (uploadCard) uploadCard.classList.remove("is-active");
      renderCustomizeGrid();
    });
  });
}

function updateCustomizeOnboardingUi() {
  const modal = qs("#customizeModal");
  if (!modal) return;
  modal.dataset.onboarding = onboardingActive ? "true" : "false";
  document.body.classList.toggle("onboarding-active", onboardingActive);
  const account = qs("#onboardingAccount");
  const accountName = qs("#onboardingAccountName");
  if (account) account.hidden = !onboardingActive;
  if (accountName) {
    accountName.textContent =
      profile?.display_name || profile?.username || session?.user?.email || (locale === "ja" ? "ログイン済み" : "已登录");
  }
  const title = modal.querySelector(".modal-head h2");
  if (title) title.textContent = onboardingActive ? t.gfOnboardingTitle : locale === "ja" ? "soulmateをカスタマイズ" : "定制 soulmate";
  const hint = modal.querySelector(".modal-head span");
  if (hint) {
    hint.textContent = onboardingActive
      ? t.gfOnboardingHint
      : locale === "ja"
        ? "形象を選ぶか画像をアップロードして、名前をつけましょう"
        : "选择形象或上传图片，给 soulmate 起个名字";
  }
  const save = qs("#saveGirlfriendButton");
  if (save) save.textContent = onboardingActive ? (locale === "ja" ? "soulmateと始める" : "开始陪伴") : locale === "ja" ? "保存" : "保存";
}

function openCustomize(options = {}) {
  onboardingActive = Boolean(options.onboarding);
  customizeSelection = null;
  uploadedImage = "";
  const nameInput = qs("#gfNameInput");
  if (nameInput) nameInput.value = "";
  const errorEl = qs("#customizeError");
  if (errorEl) errorEl.textContent = "";
  const uploadCard = qs("#uploadCard");
  if (uploadCard) uploadCard.classList.remove("is-active");
  updateCustomizeOnboardingUi();
  renderCustomizeGrid();
  openDialog(qs("#customizeModal"));
}

function closeCustomize() {
  if (onboardingActive) {
    showToast(t.gfOnboardingHint);
    return;
  }
  closeDialog(qs("#customizeModal"));
}

function onboardingStorageKey() {
  return session && session.user ? `aiai:onboarding:${session.user.id}` : "";
}

function markOnboardingDone() {
  const key = onboardingStorageKey();
  if (key) localStorage.setItem(key, "done");
  pendingSignupOnboarding = false;
  onboardingActive = false;
  updateCustomizeOnboardingUi();
}

function shouldStartOnboarding() {
  if (!supabaseClient || !session || !publicCharactersReady) return false;
  if (girlfriends.length > 0) return false;
  const key = onboardingStorageKey();
  return pendingSignupOnboarding || !key || localStorage.getItem(key) !== "done";
}

function maybeStartOnboarding() {
  if (!shouldStartOnboarding()) return;
  closeDialog(qs("#girlfriendSwitchModal"));
  closeDialog(qs("#chatModal"));
  closeDialog(qs("#videoModal"));
  openCustomize({ onboarding: true });
}

async function saveGirlfriend() {
  const errorEl = qs("#customizeError");
  const name = (qs("#gfNameInput")?.value || "").trim();
  if (!name) {
    if (errorEl) errorEl.textContent = t.gfNameRequired;
    return;
  }
  const image = uploadedImage || (customizeSelection ? customizeSelection.image : "");
  if (!image) {
    if (errorEl) errorEl.textContent = t.gfImageRequired;
    return;
  }
  const saveButton = qs("#saveGirlfriendButton");
  if (saveButton) saveButton.disabled = true;
  try {
    if (!supabaseClient || !session) {
      const gf = {
        id: `guest-${Date.now()}`,
        name,
        age: customizeSelection && customizeSelection.age ? customizeSelection.age : "",
        tag: customizeSelection && customizeSelection.tag ? customizeSelection.tag : "custom",
        image
      };
      girlfriends.unshift(gf);
      await setActiveGirlfriend(gf);
      markOnboardingDone();
      closeDialog(qs("#customizeModal"));
      switchView("home");
      showToast(t.gfSaved);
      return;
    }
    const { data, error } = await supabaseClient
      .from("characters")
      .insert({
        owner_id: session.user.id,
        name,
        age: customizeSelection && customizeSelection.age ? customizeSelection.age : null,
        tag: customizeSelection && customizeSelection.tag ? customizeSelection.tag : "custom",
        creator_name: profile && profile.display_name ? `@${profile.display_name}` : null,
        image_url: image,
        is_public: false
      })
      .select("id,name,age,tag,image_url")
      .single();
    if (error) throw error;
    const gf = {
      id: data.id,
      name: data.name,
      age: data.age ?? "",
      tag: data.tag || "",
      image: data.image_url
    };
    girlfriends.unshift(gf);
    await setActiveGirlfriend(gf);
    markOnboardingDone();
    closeDialog(qs("#customizeModal"));
    switchView("home");
    showToast(t.gfSaved);
  } catch (error) {
    if (errorEl) errorEl.textContent = error.message || String(error);
  } finally {
    if (saveButton) saveButton.disabled = false;
  }
}

// ---------- chat ----------
function getTranscript(gf) {
  if (!chatTranscripts.has(gf.id)) chatTranscripts.set(gf.id, []);
  return chatTranscripts.get(gf.id);
}

function appendChatMessage(sender, content) {
  const container = qs("#chatMessages");
  if (!container) return null;
  const div = document.createElement("div");
  div.className = sender === "user" ? "message user" : "message";
  div.textContent = content;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function renderChatMessages() {
  const container = qs("#chatMessages");
  if (!container || !activeGirlfriend) return;
  container.innerHTML = `<div class="message">${t.chatGreeting(activeGirlfriend.name)}</div>`;
  getTranscript(activeGirlfriend).forEach((message) =>
    appendChatMessage(message.role === "user" ? "user" : "character", message.content)
  );
}

function appendStageChatMessage(sender, content) {
  const container = qs("#stageChatMessages");
  if (!container) return null;
  const div = document.createElement("div");
  div.className = sender === "user" ? "stage-chat-message user" : "stage-chat-message";
  div.textContent = content;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function setStageAvatarState(state = "idle", duration = 0) {
  const stageTouch = qs("#stageTouch");
  if (!stageTouch) return;
  stageTouch.classList.remove("is-thinking", "is-speaking", "is-touched");
  if (state !== "idle") stageTouch.classList.add(`is-${state}`);
  stageTouch.dispatchEvent(new CustomEvent("avatar-state", { detail: { state, duration } }));
  if (duration > 0) {
    window.clearTimeout(stageTouch._stateTimer);
    stageTouch._stateTimer = window.setTimeout(() => setStageAvatarState("idle"), duration);
  }
}

function renderStageChatMessages() {
  const container = qs("#stageChatMessages");
  const subject = getStageSubject();
  if (!container || !subject) return;
  container.innerHTML = `<div class="stage-chat-message">${t.chatGreeting(subject.name)}</div>`;
  getTranscript(subject)
    .slice(-4)
    .forEach((message) => appendStageChatMessage(message.role === "user" ? "user" : "character", message.content));
}

async function sendStageChatMessage() {
  const subject = getStageSubject();
  if (chatBusy || !subject) return;
  const input = qs("#stageChatInput");
  if (!input) return;
  const content = input.value.trim();
  window.keepStageKeyboardOpen?.();
  input.focus({ preventScroll: true });
  if (!content) return;
  input.value = "";
  input.focus({ preventScroll: true });
  chatBusy = true;
  const transcript = getTranscript(subject);
  appendStageChatMessage("user", content);
  transcript.push({ role: "user", content });
  grantAffinity(subject);

  setStageAvatarState("thinking");
  const typing = appendStageChatMessage("character", "…");
  let reply = null;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        character: { name: subject.name, age: subject.age, tag: subject.tag },
        messages: transcript.slice(-16)
      })
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload && typeof payload.reply === "string" && payload.reply.trim()) reply = payload.reply.trim();
    }
  } catch (error) {
    // use local fallback
  }
  if (typing) typing.remove();
  const finalReply = reply || t.chatPlaceholderReply;
  appendStageChatMessage("character", finalReply);
  if (reply) transcript.push({ role: "assistant", content: reply });
  chatBusy = false;
  setStageAvatarState("speaking", 3000);
  window.keepStageKeyboardOpen?.();
  input.focus({ preventScroll: true });
}

async function ensureChatSession(gf) {
  if (!supabaseClient || !session || !isUuid(gf.id)) return null;
  if (chatSessionIds.has(gf.id)) return chatSessionIds.get(gf.id);
  const { data: existing } = await supabaseClient
    .from("chat_sessions")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("character_id", gf.id)
    .maybeSingle();
  if (existing) {
    chatSessionIds.set(gf.id, existing.id);
    return existing.id;
  }
  const { data: created } = await supabaseClient
    .from("chat_sessions")
    .insert({ user_id: session.user.id, character_id: gf.id, title: gf.name })
    .select("id")
    .single();
  if (!created) return null;
  chatSessionIds.set(gf.id, created.id);
  return created.id;
}

async function hydrateChatMessages() {
  if (!supabaseClient || !session || !activeGirlfriend || !isUuid(activeGirlfriend.id)) return;
  if (hydratedChats.has(activeGirlfriend.id)) return;
  hydratedChats.add(activeGirlfriend.id);
  const gfId = activeGirlfriend.id;
  const sessionId = await ensureChatSession(activeGirlfriend);
  if (!sessionId) return;
  const { data: messages } = await supabaseClient
    .from("chat_messages")
    .select("sender,content,created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (!Array.isArray(messages)) return;
  chatTranscripts.set(
    gfId,
    messages.map((message) => ({
      role: message.sender === "user" ? "user" : "assistant",
      content: message.content
    }))
  );
  if (activeGirlfriend && activeGirlfriend.id === gfId) renderChatMessages();
}

function openChat() {
  if (!activeGirlfriend) {
    openCustomize();
    return;
  }
  const avatar = qs("#chatAvatar");
  if (avatar) avatar.src = activeGirlfriend.image;
  const name = qs("#chatName");
  if (name) name.textContent = activeGirlfriend.name;
  renderChatMessages();
  hydrateChatMessages();
  openDialog(qs("#chatModal"));
  const input = qs("#chatInputField");
  if (input) input.focus();
}

async function sendChatMessage() {
  if (chatBusy || !activeGirlfriend) return;
  const input = qs("#chatInputField");
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;
  input.value = "";
  chatBusy = true;
  const gf = activeGirlfriend;
  const transcript = getTranscript(gf);
  appendChatMessage("user", content);
  transcript.push({ role: "user", content });

  let sessionId = null;
  if (supabaseClient && session && isUuid(gf.id)) {
    sessionId = await ensureChatSession(gf);
    if (sessionId) {
      supabaseClient
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "user", content })
        .then(() => {});
    }
  }
  grantAffinity(gf);

  const typing = appendChatMessage("character", "…");
  let reply = null;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        character: { name: gf.name, age: gf.age, tag: gf.tag },
        messages: transcript.slice(-16)
      })
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload && typeof payload.reply === "string" && payload.reply.trim()) reply = payload.reply.trim();
    }
  } catch (error) {
    // fall through to placeholder
  }
  if (typing) typing.remove();
  const finalReply = reply || t.chatPlaceholderReply;
  if (activeGirlfriend && activeGirlfriend.id === gf.id) appendChatMessage("character", finalReply);
  if (reply) {
    transcript.push({ role: "assistant", content: reply });
    if (sessionId && supabaseClient && session) {
      supabaseClient
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "character", content: reply })
        .then(() => {});
    }
  }
  chatBusy = false;
}

// ---------- video generation ----------
function renderTemplateGrid() {
  const grid = qs("#styleGrid");
  if (!grid) return;
  grid.innerHTML = videoTemplates
    .map(
      (template) => `
      <button class="style-card ${currentTemplate && template.id === currentTemplate.id ? "is-active" : ""}" data-id="${template.id}">
        <img src="${template.image}" alt="${template.name}" />
        <strong>${template.name}</strong>
        <em>${template.cost} ${t.coins}</em>
      </button>
    `
    )
    .join("");
  grid.querySelectorAll(".style-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentTemplate = videoTemplates.find((template) => template.id === card.dataset.id) || currentTemplate;
      renderTemplateGrid();
    });
  });
  updateVideoSummary();
}

function updateVideoSummary() {
  const poseName = qs("#poseName");
  if (poseName) poseName.textContent = currentTemplate ? currentTemplate.name : "";
  const generateCost = qs("#generateCost");
  if (generateCost) generateCost.textContent = currentTemplate ? currentTemplate.cost : "";
}

function openVideo() {
  if (!requireAuth()) return;
  const previewState = qs("#previewState");
  if (previewState) previewState.textContent = t.ready;
  renderTemplateGrid();
  openDialog(qs("#videoModal"));
}

async function generateVideo() {
  try {
    await runGenerate();
  } catch (error) {
    const previewState = qs("#previewState");
    const generateButton = qs("#generateButton");
    if (previewState) previewState.textContent = t.ready;
    if (generateButton) generateButton.disabled = false;
    showToast((error && error.message) || String(error) || t.generationFailed);
  }
}

async function runGenerate() {
  const subject = getStageSubject();
  if (!supabaseClient || !session || !subject || !currentTemplate) return;
  const cost = currentTemplate.cost;
  if (balance < cost) {
    closeDialog(qs("#videoModal"));
    openDialog(qs("#upgradeModal"));
    return;
  }
  const previewState = qs("#previewState");
  const generateButton = qs("#generateButton");
  if (previewState) previewState.textContent = t.generationRunning;
  if (generateButton) generateButton.disabled = true;
  const previewImage =
    subject.image && (/^https?:\/\//i.test(subject.image) || subject.image.startsWith("data:image/"))
      ? subject.image
      : makePortrait(12, subject.name, subject.tag);

  try {
    const response = await fetch("/api/generate-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        locale,
        mode: "video",
        cost,
        prompt: t.prompt(currentTemplate, subject),
        previewImage,
        character: {
          id: subject.id,
          name: subject.name,
          age: subject.age,
          tag: subject.tag,
          image: subject.image
        },
        template: {
          id: currentTemplate.id,
          name: currentTemplate.name,
          cost,
          mode: "video",
          image: currentTemplate.image
        }
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || t.generationFailed);
      error.code = payload.code || "";
      throw error;
    }
    if (typeof payload.balance === "number") balance = payload.balance;
    else balance = Math.max(0, balance - cost);
    if (profile) profile.diamond_balance = balance;
    updateBalance();
    if (previewState) previewState.textContent = t.complete;
    showToast(t.generationSaved);
    closeDialog(qs("#videoModal"));
    await loadHistory();
    const work = payload.work || {};
    openWorkViewer({
      mediaUrl: work.mediaUrl || "",
      image: work.image || work.thumbnailUrl || previewImage,
      title: work.title || ""
    });
  } catch (error) {
    if (previewState) previewState.textContent = t.ready;
    if (error.code === "INSUFFICIENT_BALANCE") {
      closeDialog(qs("#videoModal"));
      openDialog(qs("#upgradeModal"));
    } else {
      showToast(error.message || t.generationFailed);
    }
  } finally {
    if (generateButton) generateButton.disabled = false;
  }
}

// ---------- history / viewer ----------
function renderHistory() {
  const container = qs("#profileHistory");
  if (!container) return;
  container.innerHTML = history.length
    ? `<div class="profile-works-grid">${history
        .map(
          (item) => `
      <button class="profile-work-card" data-profile-work="${item.id}">
        <img src="${item.image}" alt="${item.title}" />
        <span>▶</span>
      </button>
    `
        )
        .join("")}</div>`
    : `<p class="legal">${t.noHistory}</p>`;
  container.querySelectorAll("[data-profile-work]").forEach((button, index) => {
    button.addEventListener("click", () => {
      const item = history[index];
      if (item) openWorkViewer(item);
    });
  });
}

function ensureWorkViewer() {
  let viewer = qs("#workViewer");
  if (viewer) return viewer;
  viewer = document.createElement("div");
  viewer.id = "workViewer";
  viewer.className = "work-viewer";
  viewer.hidden = true;
  viewer.innerHTML = `<button class="icon-button work-viewer-back">‹</button><div class="work-viewer-stage"></div>`;
  document.body.appendChild(viewer);
  viewer.querySelector(".work-viewer-back").addEventListener("click", closeWorkViewer);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeWorkViewer();
  });
  return viewer;
}

function openWorkViewer(item) {
  const viewer = ensureWorkViewer();
  const stage = viewer.querySelector(".work-viewer-stage");
  stage.innerHTML = isVideoUrl(item.mediaUrl)
    ? `<video src="${item.mediaUrl}" poster="${item.image || ""}" controls autoplay loop playsinline></video>`
    : `<img src="${item.image}" alt="${item.title || ""}" />`;
  viewer.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeWorkViewer() {
  const viewer = qs("#workViewer");
  if (!viewer) return;
  const video = viewer.querySelector("video");
  if (video) video.pause();
  viewer.querySelector(".work-viewer-stage").innerHTML = "";
  viewer.hidden = true;
  document.body.style.overflow = "";
}

// ---------- profile / balance ----------
function updateAuthUi() {
  const profileAuthButton = qs("#profileAuthButton");
  if (profileAuthButton) profileAuthButton.textContent = session ? t.logout : t.login;
  const profileTitle = qs("#profileTitle");
  const profileId = qs("#profileId");
  const profileAvatar = qs("#profileAvatar");
  if (session) {
    if (profileTitle && profile && profile.display_name) profileTitle.textContent = profile.display_name;
    if (profileId) profileId.textContent = profile && profile.username ? `ID: ${profile.username}` : "";
  } else {
    if (profileTitle) profileTitle.textContent = t.guestName;
    if (profileId) profileId.textContent = t.notLoggedIn;
  }
  if (profileAvatar) {
    profileAvatar.src = makeUserAvatar(profile?.display_name || profile?.username || t.guestName);
  }
  const userAvatarMini = qs("#userAvatarMini");
  if (userAvatarMini) userAvatarMini.src = makeUserAvatar(profile?.display_name || profile?.username || t.guestName);
}

function updateBalance() {
  const coinBalance = qs("#coinBalance");
  if (coinBalance) coinBalance.textContent = session ? String(balance) : "—";
  const topBalance = qs("#topBalance");
  if (topBalance) topBalance.textContent = session ? String(balance) : "充值";
}

function resetUserState() {
  profile = null;
  balance = 0;
  girlfriends = [];
  activeGirlfriend = null;
  history = [];
  chatSessionIds.clear();
  chatTranscripts.clear();
  hydratedChats.clear();
  renderStage();
  renderGfList();
  renderHistory();
  updateAuthUi();
  updateBalance();
  switchView("home");
}

// ---------- views ----------
function switchView(view) {
  qsa(".view").forEach((item) => item.classList.toggle("is-visible", item.id === `view-${view}`));
  qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  // Lock scroll only on the home stage so the keyboard overlays instead of
  // scrolling the page; allow scrolling on the profile page.
  document.body.classList.toggle("gf-home-active", view === "home");
}

// ---------- auth ----------
const authScreen = qs("#authScreen");

function setAuthScreenMode(nextMode) {
  authScreenMode = nextMode;
  if (!authScreen) return;
  authScreen.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.authTab === authScreenMode);
  });
  const confirmRow = qs("#authConfirmRow");
  if (confirmRow) confirmRow.hidden = authScreenMode !== "register";
  const nicknameRow = qs("#authNicknameRow");
  if (nicknameRow) nicknameRow.hidden = authScreenMode !== "register";
  const submit = qs("#authScreenSubmit");
  if (submit) submit.textContent = authScreenMode === "login" ? t.authLoginAction : t.authRegisterAction;
  const password = qs("#authScreenPassword");
  if (password) password.autocomplete = authScreenMode === "login" ? "current-password" : "new-password";
  const emailInput = qs("#authScreenEmail");
  if (emailInput) emailInput.placeholder = authScreenMode === "register" ? t.usernamePlaceholder : t.loginPlaceholder;
  const errorEl = qs("#authScreenError");
  if (errorEl) errorEl.textContent = "";
}

function showAuthScreen(mode = "login") {
  if (!authScreen || !supabaseClient) return;
  setAuthScreenMode(mode);
  authScreen.hidden = false;
  document.body.classList.add("auth-locked");
}

function hideAuthScreen() {
  if (authScreen) authScreen.hidden = true;
  if (session) document.body.classList.remove("auth-locked");
}

function requireAuth() {
  if (!supabaseClient || session) return true;
  showAuthScreen("login");
  showToast(t.authGateRequired);
  return false;
}

async function handleAuthScreenSubmit() {
  if (!supabaseClient) return;
  const rawValue = (qs("#authScreenEmail")?.value || "").trim();
  const password = qs("#authScreenPassword")?.value || "";
  const confirm = qs("#authScreenConfirm")?.value || "";
  const errorEl = qs("#authScreenError");
  if (!rawValue || !password) return;
  const submit = qs("#authScreenSubmit");
  if (submit) submit.disabled = true;
  try {
    if (authScreenMode === "login") {
      let { error } = await supabaseClient.auth.signInWithPassword({
        email: normalizeLoginEmail(rawValue),
        password
      });
      if (error && !rawValue.includes("@")) {
        for (const domain of LEGACY_LOGIN_DOMAINS) {
          const legacy = await supabaseClient.auth.signInWithPassword({
            email: normalizeLoginEmail(rawValue, domain),
            password
          });
          if (!legacy.error) {
            error = null;
            break;
          }
          error = legacy.error;
        }
      }
      if (error) throw error;
      hideAuthScreen();
      showToast(t.authWelcome);
    } else {
      if (!usernameRegex.test(rawValue)) {
        if (errorEl) errorEl.textContent = t.usernameRule;
        return;
      }
      if (password.length < 6) {
        if (errorEl) errorEl.textContent = t.passwordTooShort;
        return;
      }
      if (password !== confirm) {
        if (errorEl) errorEl.textContent = t.passwordMismatch;
        return;
      }
      const username = rawValue.toLowerCase();
      const { data: existing } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();
      if (existing) {
        if (errorEl) errorEl.textContent = t.usernameTaken;
        return;
      }
      const nickname = (qs("#authScreenNickname")?.value || "").trim() || username;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, nickname })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || t.authRegisterFailed);
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: normalizeLoginEmail(username),
        password
      });
      if (error) throw error;
      pendingSignupOnboarding = true;
      hideAuthScreen();
      showToast(t.authSignedUp);
    }
  } catch (error) {
    if (errorEl) errorEl.textContent = error.message || String(error);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function handleAuthButtonClick() {
  if (!supabaseClient) return;
  const settingsModal = qs("#settingsModal");
  if (settingsModal && settingsModal.open) closeDialog(settingsModal);
  if (session) {
    await supabaseClient.auth.signOut();
    window.location.reload();
  } else {
    showAuthScreen("login");
  }
}

// ---------- wiring ----------
qsa("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    switchView(view);
  });
});

const stageVideoButton = qs("#stageVideoButton");
if (stageVideoButton) stageVideoButton.addEventListener("click", openVideo);
const stageGirlfriendButton = qs("#stageGirlfriendButton");
if (stageGirlfriendButton) {
  stageGirlfriendButton.addEventListener("click", () => {
    renderGfSwitcher();
    openDialog(qs("#girlfriendSwitchModal"));
  });
}
qsa("[data-close-switcher]").forEach((button) =>
  button.addEventListener("click", () => closeDialog(qs("#girlfriendSwitchModal")))
);
const stageChatInput = qs("#stageChatInput");
const stageChatSend = qs("#stageChatSend");
if (stageChatSend) {
  let sendHandledAt = 0;
  stageChatSend.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    window.keepStageKeyboardOpen?.();
    stageChatInput?.focus({ preventScroll: true });
  });
  stageChatSend.addEventListener("pointerup", (event) => {
    event.preventDefault();
    sendHandledAt = Date.now();
    sendStageChatMessage();
  });
  stageChatSend.addEventListener("click", (event) => {
    if (Date.now() - sendHandledAt < 500) {
      event.preventDefault();
      return;
    }
    sendStageChatMessage();
  });
}
if (stageChatInput) {
  stageChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendStageChatMessage();
    }
  });
}
const stageEmptyEl = qs("#stageEmpty");
if (stageEmptyEl) stageEmptyEl.addEventListener("click", openCustomize);
const stageTouch = qs("#stageTouch");
if (stageTouch) {
  stageTouch.addEventListener("click", () => {
    setStageAvatarState("speaking", 900);
  });
}
const profileCreateGirlfriend = qs("#profileCreateGirlfriend");
if (profileCreateGirlfriend) profileCreateGirlfriend.addEventListener("click", openCustomize);

// Tap outside the dialog content (on the backdrop) to close, mobile-style.
qsa("dialog.modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return; // only the backdrop, not inner content
    if (dialog.id === "customizeModal") {
      closeCustomize();
    } else {
      closeDialog(dialog);
    }
  });
});

qsa("[data-close-chat]").forEach((button) => button.addEventListener("click", () => closeDialog(qs("#chatModal"))));
qsa("[data-close-video]").forEach((button) => button.addEventListener("click", () => closeDialog(qs("#videoModal"))));
qsa("[data-close-customize]").forEach((button) =>
  button.addEventListener("click", closeCustomize)
);
qsa("[data-close-upgrade]").forEach((button) =>
  button.addEventListener("click", () => closeDialog(qs("#upgradeModal")))
);
qsa("[data-open-upgrade]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    openDialog(qs("#upgradeModal"));
  });
});
qsa("[data-payment]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(t.selectedPayment(button.dataset.payment));
    closeDialog(qs("#upgradeModal"));
  });
});

const chatSendButton = qs("#chatSendButton");
if (chatSendButton) chatSendButton.addEventListener("click", sendChatMessage);
const chatInputField = qs("#chatInputField");
if (chatInputField) {
  chatInputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendChatMessage();
  });
}

const generateButtonEl = qs("#generateButton");
if (generateButtonEl) generateButtonEl.addEventListener("click", generateVideo);

const saveGirlfriendButtonEl = qs("#saveGirlfriendButton");
if (saveGirlfriendButtonEl) saveGirlfriendButtonEl.addEventListener("click", saveGirlfriend);

const uploadInput = qs("#personUploadInput");
if (uploadInput) {
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      uploadedImage = String(reader.result);
      customizeSelection = null;
      const uploadHint = qs("#uploadHint");
      if (uploadHint) uploadHint.textContent = file.name;
      const uploadCard = qs("#uploadCard");
      if (uploadCard) uploadCard.classList.add("is-active");
      renderCustomizeGrid();
      showToast(t.uploadedReady);
    });
    reader.readAsDataURL(file);
  });
}

qsa("[data-open-profile-edit]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    const nicknameInput = qs("#nicknameInput");
    if (nicknameInput) nicknameInput.value = (profile && profile.display_name) || "";
    const profileIdInput = qs("#profileIdInput");
    if (profileIdInput) profileIdInput.value = (profile && profile.username) || "";
    openDialog(qs("#profileEditModal"));
  });
});
qsa("[data-close-profile-edit]").forEach((button) =>
  button.addEventListener("click", () => closeDialog(qs("#profileEditModal")))
);
qsa("[data-save-profile]").forEach((button) => {
  button.addEventListener("click", async () => {
    const nickname = (qs("#nicknameInput")?.value || "").trim();
    if (nickname && supabaseClient && session) {
      await supabaseClient
        .from("profiles")
        .update({ display_name: nickname, updated_at: new Date().toISOString() })
        .eq("id", session.user.id);
      if (profile) profile.display_name = nickname;
      updateAuthUi();
    }
    closeDialog(qs("#profileEditModal"));
    showToast(t.profileSaved);
  });
});

const settingsModalEl = qs("#settingsModal");
qsa("[data-open-settings]").forEach((button) => button.addEventListener("click", () => openDialog(settingsModalEl)));
qsa("[data-close-settings]").forEach((button) => button.addEventListener("click", () => closeDialog(settingsModalEl)));

const profileAuthButtonEl = qs("#profileAuthButton");
if (profileAuthButtonEl) profileAuthButtonEl.addEventListener("click", handleAuthButtonClick);

const onboardingSwitchAccount = qs("#onboardingSwitchAccount");
if (onboardingSwitchAccount) {
  onboardingSwitchAccount.addEventListener("click", async () => {
    onboardingActive = false;
    updateCustomizeOnboardingUi();
    closeDialog(qs("#customizeModal"));
    if (supabaseClient) await supabaseClient.auth.signOut();
    showAuthScreen("login");
  });
}

const passwordModalEl = qs("#passwordModal");
const changePasswordButton = qs("#changePasswordButton");
if (changePasswordButton) {
  changePasswordButton.addEventListener("click", () => {
    if (!requireAuth()) return;
    if (settingsModalEl && settingsModalEl.open) closeDialog(settingsModalEl);
    ["#newPasswordInput", "#confirmPasswordInput"].forEach((selector) => {
      const input = qs(selector);
      if (input) input.value = "";
    });
    const errorEl = qs("#passwordError");
    if (errorEl) errorEl.textContent = "";
    openDialog(passwordModalEl);
  });
}
qsa("[data-close-password]").forEach((button) => button.addEventListener("click", () => closeDialog(passwordModalEl)));
const savePasswordButton = qs("#savePasswordButton");
if (savePasswordButton) {
  savePasswordButton.addEventListener("click", async () => {
    if (!supabaseClient || !session) return;
    const newPassword = qs("#newPasswordInput")?.value || "";
    const confirmPassword = qs("#confirmPasswordInput")?.value || "";
    const errorEl = qs("#passwordError");
    if (newPassword.length < 6) {
      if (errorEl) errorEl.textContent = t.passwordTooShort;
      return;
    }
    if (newPassword !== confirmPassword) {
      if (errorEl) errorEl.textContent = t.passwordMismatch;
      return;
    }
    savePasswordButton.disabled = true;
    try {
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
      closeDialog(passwordModalEl);
      showToast(t.passwordChanged);
    } catch (error) {
      if (errorEl) errorEl.textContent = error.message || String(error);
    } finally {
      savePasswordButton.disabled = false;
    }
  });
}

qsa("[data-open-delete]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    if (settingsModalEl && settingsModalEl.open) closeDialog(settingsModalEl);
    openDialog(qs("#deleteConfirmModal"));
  });
});
qsa("[data-close-delete]").forEach((button) =>
  button.addEventListener("click", () => closeDialog(qs("#deleteConfirmModal")))
);
qsa("[data-confirm-delete]").forEach((button) => {
  button.addEventListener("click", () => {
    closeDialog(qs("#deleteConfirmModal"));
    showToast(t.deleteSubmitted);
  });
});

if (authScreen) {
  authScreen.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.addEventListener("click", () => setAuthScreenMode(tab.dataset.authTab));
  });
  const authScreenSubmit = qs("#authScreenSubmit");
  if (authScreenSubmit) authScreenSubmit.addEventListener("click", handleAuthScreenSubmit);
  ["#authScreenPassword", "#authScreenConfirm"].forEach((selector) => {
    const field = qs(selector);
    if (field) {
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter") handleAuthScreenSubmit();
      });
    }
  });
}

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, newSession) => {
    const hadSession = Boolean(session);
    session = newSession;
    if (session) {
      hideAuthScreen();
      updateAuthUi();
      updateBalance();
      loadProfile().then(() => loadHistory());
    } else if (hadSession) {
      resetUserState();
    } else {
      updateAuthUi();
      updateBalance();
      showAuthScreen("login");
    }
  });
} else {
  document.body.classList.remove("auth-locked");
}

// boot
document.body.classList.add("gf-home-active");
if (supabaseClient) showAuthScreen("login");
renderStage();
updateAuthUi();
updateBalance();
loadPublicCharacters();
loadTemplates();

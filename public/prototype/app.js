const locale = document.documentElement.lang.startsWith("ja") || location.pathname.startsWith("/ja") ? "ja" : "zh";

const supabaseClient =
  window.supabase && window.__SUPABASE_URL__ && window.__SUPABASE_ANON_KEY__
    ? window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__)
    : null;

const isUuid = (value) =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const dictionary = {
  zh: {
    activePlan: "标准版",
    ageSuffix: "岁",
    coins: "钻石",
    complete: "已完成",
    download: "下载",
    galleryTag: "灵感",
    generating: "创作中",
    modeLabel: { image: "创作图片", video: "创作视频" },
    modeName: { image: "图片", video: "视频" },
    noHistory: "还没有创作记录。",
    ready: "准备就绪",
    resultLabel: (count) => `作品 #${count}`,
    selectedPayment: (payment) => `已选择 ${payment}，下一步进入支付确认。`,
    profileSaved: "昵称已保存。",
    uploadedName: "上传图片",
    uploadedReady: "已选择上传图片。",
    deleteSubmitted: "账户删除请求已提交。",
    share: "分享",
    shareDone: "分享链接已创建，作品已加入首页。",
    shareOpened: "选择要分享的聊天软件。",
    shareCopied: (platform) => `已为 ${platform} 准备分享链接。`,
    sharePlatforms: ["微信", "QQ", "Telegram", "LINE", "WhatsApp"],
    chatStarted: (name) => `已为 ${name} 新开聊天。`,
    liked: "已点赞。",
    unliked: "已取消点赞。",
    thousand: "K",
    toastDone: "创作已完成，并保存到历史。",
    login: "登录",
    logout: "退出登录",
    authLoginTitle: "登录",
    authRegisterTitle: "注册",
    authLoginAction: "登录",
    authRegisterAction: "注册",
    authToLogin: "已有账号？登录",
    authToRegister: "没有账号？注册",
    authWelcome: "登录成功。",
    authSignedUp: "注册成功，已自动登录。",
    authConfirmEmail: "注册成功，请到邮箱完成确认后再登录。",
    authSignedOut: "已退出登录。",
    authRequired: "请先登录。",
    passwordMismatch: "两次输入的密码不一致。",
    notLoggedIn: "未登录",
    guestName: "游客",
    copyLink: "复制链接",
    linkCopied: "链接已复制。",
    chatPlaceholderReply: "（角色回复将在接入对话模型后上线）",
    prompt: (template, character) =>
      `${character.name}，${template.name}风格，保持人物特征一致，生成短视频。`,
    chatMessages: [
      "星期日中午。你坐在床边等待，出租屋今天显得格外安静。",
      "门铃响了。你打开门，站在门口的人是 Lina Hsu。",
      "Lina 看着手机上的地址，一时间愣住，努力装作只是顺路来确认你的情况。",
      "你可以继续输入消息，也可以直接请求图片、视频或打开相册。"
    ],
    conversations: [
      ["Lina Hsu", "3 小时前", "你……怎么会是你？"],
      ["Lucy", "9 小时前", "[视频]"],
      ["Kim", "9 小时前", "老师，可以帮我改一下成绩吗？"],
      ["Emily", "9 小时前", "糟了……家里好像没人……"],
      ["Hinata Hyuga", "9 小时前", "[视频]"]
    ],
    characters: [
      ["Emily", 19, "Stepsis", "Live"],
      ["Yumi Haven", 20, "Asian", "@Ol's_Erotes"],
      ["Sera Muse", 23, "Caucasian", "@Ol's_Erotes"],
      ["Tessa Thorn", 18, "Asian", "@Ol's_Erotes"],
      ["Cathaleen", 33, "Asian", "@NTRMaster"],
      ["Bitchy Stepmom", 26, "MILF", "@NTRMaster"],
      ["Kim Kung", 21, "VIP", "400"],
      ["Your Depressed Mom", 42, "family", "@TheBurritoQueen274"],
      ["Lina Hsu", 21, "Asian", "@Ol's_Erotes"],
      ["Hazel 40-Year-Old...", 40, "milf", "@TheBurritoQueen274"],
      ["Priya Srisuk", 25, "Asian", "@Ol's_Erotes"],
      ["Jenna", 25, "Asian", "@Ol's_Erotes"],
      ["Nilsson", 24, "Asian", "@Ol's_Erotes"],
      ["Freya", 22, "Caucasian", "@Ol's_Erotes"],
      ["Vivienne", 29, "Caucasian", "@Ol's_Erotes"],
      ["Clara White", 35, "Asian", "@NTRMaster"]
    ],
    imageTemplates: [
      ["脱衣", "图片", 40],
      ["俯身姿势", "图片", 40],
      ["骑乘姿势", "图片", 40],
      ["亲密口部", "图片", 40],
      ["正面姿势", "图片", 40],
      ["侧身亲密", "图片", 40],
      ["胸部亲密", "图片", 40],
      ["手部亲密", "图片", 40],
      ["足部亲密", "图片", 40],
      ["雨衣", "图片", 20],
      ["情趣酒店", "图片", 20],
      ["豪宅", "图片", 20],
      ["蒙眼", "图片", 20],
      ["自定义姿势", "图片", 40],
      ["淋浴", "图片", 40],
      ["俯身", "图片", 40]
    ],
    videoTemplates: [
      ["脱衣", "视频", 96],
      ["亲密口部", "视频", 96],
      ["道具演示", "视频", 96],
      ["胸部按摩", "视频", 96],
      ["私密展示", "视频", 96],
      ["俯身姿势", "视频", 96],
      ["手部亲密", "视频", 96],
      ["侧身亲密", "视频", 96],
      ["骑乘姿势", "视频", 96],
      ["胸部亲密", "视频", 96],
      ["正面姿势", "视频", 96],
      ["淋浴", "视频", 96],
      ["自定义视频", "视频", 120]
    ],
    gallery: [
      ["Ol's_Erotes 灵感作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes 灵感作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes 灵感作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes 灵感作品", "@Ol's_Erotes", "image", 80],
      ["NTR Dreamer 灵感作品", "@NTR Dreamer", "video", 160],
      ["NTRMaster 灵感作品", "@NTRMaster", "video", 160],
      ["Ol's_Erotes 灵感作品", "@Ol's_Erotes", "video", 160],
      ["NTR Dreamer 灵感作品", "@NTR Dreamer", "video", 160]
    ]
  },
  ja: {
    activePlan: "スタンダード",
    ageSuffix: "歳",
    coins: "ダイヤ",
    complete: "完了",
    download: "ダウンロード",
    galleryTag: "ギャラリー",
    generating: "創作中",
    modeLabel: { image: "画像創作", video: "動画創作" },
    modeName: { image: "画像", video: "動画" },
    noHistory: "創作履歴はまだありません。",
    ready: "準備完了",
    resultLabel: (count) => `作品 #${count}`,
    selectedPayment: (payment) => `${payment} を選択しました。次は支払い確認です。`,
    profileSaved: "ニックネームを保存しました。",
    uploadedName: "アップロード画像",
    uploadedReady: "アップロード画像を選択しました。",
    deleteSubmitted: "アカウント削除リクエストを送信しました。",
    share: "共有",
    shareDone: "共有リンクを作成し、作品をホームに追加しました。",
    shareOpened: "共有先のチャットアプリを選択してください。",
    shareCopied: (platform) => `${platform} の共有リンクを準備しました。`,
    sharePlatforms: ["LINE", "Telegram", "WhatsApp", "Messenger", "X"],
    chatStarted: (name) => `${name} の新規チャットを開きました。`,
    liked: "いいねしました。",
    unliked: "いいねを取り消しました。",
    thousand: "K",
    toastDone: "創作が完了し、履歴に保存しました。",
    login: "ログイン",
    logout: "ログアウト",
    authLoginTitle: "ログイン",
    authRegisterTitle: "新規登録",
    authLoginAction: "ログイン",
    authRegisterAction: "登録",
    authToLogin: "アカウントをお持ちの方はログイン",
    authToRegister: "アカウント未登録？新規登録",
    authWelcome: "ログインしました。",
    authSignedUp: "登録が完了し、ログインしました。",
    authConfirmEmail: "登録完了。確認メールをチェックしてください。",
    authSignedOut: "ログアウトしました。",
    authRequired: "先にログインしてください。",
    passwordMismatch: "パスワードが一致しません。",
    notLoggedIn: "未ログイン",
    guestName: "ゲスト",
    copyLink: "リンクをコピー",
    linkCopied: "リンクをコピーしました。",
    chatPlaceholderReply: "（キャラクターの返信は対話モデル接続後に対応します）",
    prompt: (template, character) =>
      `${character.name}、${template.name}スタイル、人物の特徴を保った短い動画。`,
    chatMessages: [
      "日曜の昼。あなたはベッドに座って待っていた。部屋はいつもより静かに感じた。",
      "ドアベルが鳴った。扉を開けると、そこに立っていたのは Lina Hsu だった。",
      "Lina はスマホの住所を見て固まり、ただ様子を見に来ただけだと装おうとした。",
      "このままメッセージを続けるか、画像・動画・アルバムを開けます。"
    ],
    conversations: [
      ["Lina Hsu", "3時間前", "えっ……あなたなの？"],
      ["Lucy", "9時間前", "[動画]"],
      ["Kim", "9時間前", "先生、成績を直してくれますか？"],
      ["Emily", "9時間前", "あれ……誰もいないみたい……"],
      ["Hinata Hyuga", "9時間前", "[動画]"]
    ],
    characters: [
      ["Emily", 19, "Stepsis", "Live"],
      ["Yumi Haven", 20, "Asian", "@Ol's_Erotes"],
      ["Sera Muse", 23, "Caucasian", "@Ol's_Erotes"],
      ["Tessa Thorn", 18, "Asian", "@Ol's_Erotes"],
      ["Cathaleen", 33, "Asian", "@NTRMaster"],
      ["Bitchy Stepmom", 26, "MILF", "@NTRMaster"],
      ["Kim Kung", 21, "VIP", "400"],
      ["Your Depressed Mom", 42, "family", "@TheBurritoQueen274"],
      ["Lina Hsu", 21, "Asian", "@Ol's_Erotes"],
      ["Hazel 40-Year-Old...", 40, "milf", "@TheBurritoQueen274"],
      ["Priya Srisuk", 25, "Asian", "@Ol's_Erotes"],
      ["Jenna", 25, "Asian", "@Ol's_Erotes"],
      ["Nilsson", 24, "Asian", "@Ol's_Erotes"],
      ["Freya", 22, "Caucasian", "@Ol's_Erotes"],
      ["Vivienne", 29, "Caucasian", "@Ol's_Erotes"],
      ["Clara White", 35, "Asian", "@NTRMaster"]
    ],
    imageTemplates: [
      ["脱衣", "画像", 40],
      ["バックポーズ", "画像", 40],
      ["騎乗ポーズ", "画像", 40],
      ["口元シーン", "画像", 40],
      ["正面ポーズ", "画像", 40],
      ["横向き口元", "画像", 40],
      ["胸元シーン", "画像", 40],
      ["手元シーン", "画像", 40],
      ["足元シーン", "画像", 40],
      ["レインコート", "画像", 20],
      ["ラブホテル", "画像", 20],
      ["邸宅", "画像", 20],
      ["目隠し", "画像", 20],
      ["カスタムポーズ", "画像", 40],
      ["シャワー", "画像", 40],
      ["前かがみ", "画像", 40]
    ],
    videoTemplates: [
      ["脱衣", "動画", 96],
      ["口元シーン", "動画", 96],
      ["道具シーン", "動画", 96],
      ["胸元マッサージ", "動画", 96],
      ["プライベート表示", "動画", 96],
      ["バックポーズ", "動画", 96],
      ["手元シーン", "動画", 96],
      ["横向き口元", "動画", 96],
      ["騎乗ポーズ", "動画", 96],
      ["胸元シーン", "動画", 96],
      ["正面ポーズ", "動画", 96],
      ["シャワー", "動画", 96],
      ["カスタム動画", "動画", 120]
    ],
    gallery: [
      ["Ol's_Erotes インスピレーション作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes インスピレーション作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes インスピレーション作品", "@Ol's_Erotes", "image", 80],
      ["Ol's_Erotes インスピレーション作品", "@Ol's_Erotes", "image", 80],
      ["NTR Dreamer インスピレーション作品", "@NTR Dreamer", "video", 160],
      ["NTRMaster インスピレーション作品", "@NTRMaster", "video", 160],
      ["Ol's_Erotes インスピレーション作品", "@Ol's_Erotes", "video", 160],
      ["NTR Dreamer インスピレーション作品", "@NTR Dreamer", "video", 160]
    ]
  }
};

const t = dictionary[locale];

let characters = t.characters.map((item, index) => ({
  id: `char-${index}`,
  name: item[0],
  age: item[1],
  tag: item[2],
  vibe: item[3],
  image: makePortrait(index + 8, item[0], item[2])
}));

let imageTemplates = t.imageTemplates.map((item, index) => ({
  id: `image-${index}`,
  name: item[0],
  category: item[1],
  cost: item[2],
  mode: "image",
  image: makeScene(index + 40, item[0], "image")
}));

let videoTemplates = t.videoTemplates.map((item, index) => ({
  id: `video-${index}`,
  name: item[0],
  category: item[1],
  cost: item[2],
  mode: "video",
  image: makeScene(index + 70, item[0], "video")
}));

const charAt = (index) => characters[index % characters.length];

const gallery = t.gallery.map((item, index) => ({
  id: `gallery-${index}`,
  title: item[0],
  creator: item[1],
  mode: item[2],
  cost: item[3],
  image: makeScene(index + 120, item[0], item[2])
}));

const videoGallery = gallery.filter((item) => item.mode === "video");

let sharedPosts = Array.from({ length: 18 }, (_, index) => {
  const item = videoGallery[index % videoGallery.length];
  return {
    id: `post-${index}`,
    title: item.title,
    creator: item.creator,
    mode: "video",
    cost: item.cost,
    image: makeScene(index + 180, item.title, "video"),
    likes: [1280, 942, 816, 705, 690, 533, 476, 412][index % 8] + index * 9,
    liked: false,
    character: characters[(index + 8) % characters.length].name,
    createdAt: Date.now() - index * 1000 * 60 * 47
  };
});
let fallbackPosts = sharedPosts.map((post) => ({ ...post }));
let worksRequestId = 0;

let currentView = "explore";
let mode = "video";
let expanded = false;
let exploreSort = "latest";
let exploreType = "video";
let currentTemplate = videoTemplates[0];
let currentCharacter = characters[0];
let uploadedCharacterImage = "";
let balance = 570;
let history = [];
let activeChat = charAt(8);
let chatScreen = "list";
let session = null;
let profile = null;
let authMode = "login";
let likedWorkIds = new Set();
const chatSessionIds = new Map();
const chatTranscripts = new Map();
const hydratedChats = new Set();
let chatBusy = false;

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

const templateGrid = qs("#templateGrid");
const galleryGrid = qs("#galleryGrid");
const exploreGrid = qs("#exploreGrid");
const personGrid = qs("#personGrid");
const styleGrid = qs("#styleGrid");
const uploadInput = qs("#personUploadInput");
const characterModalGrid = qs("#characterModalGrid");
const characterModal = qs("#characterModal");
const upgradeModal = qs("#upgradeModal");
const deleteConfirmModal = qs("#deleteConfirmModal");
const profileEditModal = qs("#profileEditModal");
const shareModal = qs("#shareModal");
const sharePlatformGrid = qs("#sharePlatformGrid");
const toast = qs("#toast");
const authModal = qs("#authModal");
const authButton = qs("#authButton");
const authScreen = qs("#authScreen");
let authScreenMode = "login";

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
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + rand() * 0.06})`;
    ctx.beginPath();
    ctx.arc(rand() * 520, rand() * 680, 20 + rand() * 80, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(7,7,10,.24)";
  ctx.fillRect(0, 430, 520, 250);

  const skin = ["#f4c4aa", "#ddb08f", "#f1c9b9", "#cfa083", "#f5d0bc"][seed % 5];
  const hair = ["#2a1b1a", "#e7c176", "#121318", "#6d3a28", "#f4e2c0"][Math.floor(rand() * 5)];

  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.ellipse(260, 210, 128, 156, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(260, 220, 86, 106, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.ellipse(207, 190, 48, 112, -0.26, 0, Math.PI * 2);
  ctx.ellipse(313, 190, 48, 112, 0.26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = skin;
  ctx.fillRect(229, 303, 62, 74);
  ctx.beginPath();
  ctx.ellipse(260, 480, 154, 138, 0, Math.PI, 0);
  ctx.fill();

  const dress = ctx.createLinearGradient(110, 360, 410, 660);
  dress.addColorStop(0, colors[0]);
  dress.addColorStop(1, colors[2]);
  ctx.fillStyle = dress;
  ctx.beginPath();
  ctx.moveTo(142, 680);
  ctx.quadraticCurveTo(182, 348, 260, 360);
  ctx.quadraticCurveTo(344, 348, 382, 680);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#17181d";
  ctx.beginPath();
  ctx.ellipse(226, 228, 9, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(294, 228, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(90,40,50,.5)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(260, 270, 26, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = "rgba(0,0,0,.33)";
  ctx.fillRect(0, 568, 520, 112);
  ctx.fillStyle = "#fff";
  ctx.font = "800 36px system-ui, sans-serif";
  ctx.fillText(name, 26, 622);
  ctx.fillStyle = "rgba(255,255,255,.74)";
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText(tag, 28, 652);

  return canvas.toDataURL("image/png");
}

function makeScene(seed, title, sceneMode) {
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

  ctx.fillStyle = "rgba(0,0,0,.26)";
  ctx.fillRect(0, 0, 560, 720);

  for (let i = 0; i < 16; i += 1) {
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + rand() * 0.08})`;
    ctx.lineWidth = 2 + rand() * 4;
    ctx.beginPath();
    ctx.moveTo(rand() * 560, 0);
    ctx.lineTo(rand() * 560, 720);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,.12)";
  ctx.beginPath();
  ctx.ellipse(280, 330, 96, 150, rand() * 0.4 - 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.2)";
  ctx.beginPath();
  ctx.ellipse(280, 190, 62, 72, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,.22)";
  ctx.beginPath();
  ctx.roundRect(130, 102 + rand() * 28, 300, 470, 42);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.moveTo(160, 590);
  ctx.quadraticCurveTo(280, 430, 400, 590);
  ctx.lineTo(430, 720);
  ctx.lineTo(130, 720);
  ctx.closePath();
  ctx.fill();

  if (sceneMode === "video") {
    ctx.fillStyle = "rgba(49,214,200,.85)";
    ctx.beginPath();
    ctx.moveTo(244, 335);
    ctx.lineTo(244, 405);
    ctx.lineTo(306, 370);
    ctx.closePath();
    ctx.fill();
  }

  const bottomShade = ctx.createLinearGradient(0, 500, 0, 720);
  bottomShade.addColorStop(0, "rgba(0,0,0,0)");
  bottomShade.addColorStop(1, "rgba(0,0,0,.45)");
  ctx.fillStyle = bottomShade;
  ctx.fillRect(0, 500, 560, 220);

  return canvas.toDataURL("image/png");
}

function makeResultImage(template, character, count) {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  const templateImage = new Image();
  const characterImage = new Image();
  templateImage.src = template.image;
  characterImage.src = character.image;
  ctx.fillStyle = "#101116";
  ctx.fillRect(0, 0, 960, 680);
  ctx.drawImage(templateImage, 0, 0, 570, 680);
  ctx.drawImage(characterImage, 530, 0, 430, 680);
  const overlay = ctx.createLinearGradient(0, 0, 960, 680);
  overlay.addColorStop(0, "rgba(255,77,154,.18)");
  overlay.addColorStop(0.5, "rgba(49,214,200,.12)");
  overlay.addColorStop(1, "rgba(8,8,10,.52)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, 960, 680);
  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.fillRect(0, 560, 960, 120);
  ctx.fillStyle = "#fff";
  ctx.font = "800 38px system-ui, sans-serif";
  ctx.fillText(`${character.name} · ${template.name}`, 34, 622);
  ctx.fillStyle = "#31d6c8";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText(t.resultLabel(count), 36, 655);
  return canvas.toDataURL("image/png");
}

function renderAll() {
  const optionalImages = [
    ["#userAvatar", charAt(2).image],
    ["#profileAvatar", charAt(2).image],
    ["#albumHero", charAt(8).image],
    ["#albumThumbOne", charAt(8).image],
    ["#albumThumbTwo", charAt(1).image],
    ["#albumThumbThree", charAt(2).image]
  ];
  optionalImages.forEach(([selector, image]) => {
    const element = qs(selector);
    if (element) element.src = image;
  });
  renderCreatorFlow();
  renderExplore();
  renderCharacterModal();
  renderChat();
  renderHistory();
  updateBalance();
}

function renderCreatorFlow() {
  renderPersonChoices();
  renderStyleChoices();
  renderCreatorPreview();
}

function renderPersonChoices() {
  if (!personGrid) return;
  personGrid.innerHTML = characters
    .slice(0, 8)
    .map((character) => personCard(character))
    .join("");
  personGrid.querySelectorAll(".person-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentCharacter = characters.find((item) => item.id === card.dataset.id) || characters[0];
      renderCreatorFlow();
    });
  });
  const uploadCard = qs("#uploadCard");
  if (uploadCard) uploadCard.classList.toggle("is-active", currentCharacter.id === "uploaded");
}

function personCard(character) {
  return `
    <button class="person-card ${character.id === currentCharacter.id ? "is-active" : ""}" data-id="${character.id}">
      <img src="${character.image}" alt="${character.name}" />
      <strong>${character.name}</strong>
    </button>
  `;
}

function renderStyleChoices() {
  if (!styleGrid) return;
  styleGrid.innerHTML = videoTemplates
    .map(
      (template) => `
      <button class="style-card ${template.id === currentTemplate.id ? "is-active" : ""}" data-id="${template.id}">
        <img src="${template.image}" alt="${template.name}" />
        <span>${template.category}</span>
        <strong>${template.name}</strong>
        <em>${template.cost} ${t.coins}</em>
      </button>
    `
    )
    .join("");
  styleGrid.querySelectorAll(".style-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentTemplate = videoTemplates.find((template) => template.id === card.dataset.id) || videoTemplates[0];
      renderCreatorFlow();
    });
  });
}

function renderCreatorPreview() {
  const preview = qs("#composePreview");
  if (preview) preview.src = makeResultImage(currentTemplate, currentCharacter, history.length + 1);
  const poseName = qs("#poseName");
  if (poseName) poseName.textContent = currentTemplate.name;
  const characterName = qs("#characterName");
  if (characterName) characterName.textContent = currentCharacter.name;
  const generateCost = qs("#generateCost");
  if (generateCost) generateCost.textContent = currentTemplate.cost;
  const previewState = qs("#previewState");
  if (previewState) previewState.textContent = t.ready;
}

function renderExplore() {
  const visiblePosts = sharedPosts
    .filter((post) => post.mode === "video");
  exploreGrid.innerHTML = visiblePosts
    .map((post) => shareCard(post))
    .join("");
  exploreGrid.querySelectorAll("[data-share-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.sharePost);
      openShareModal(post);
    });
  });
  exploreGrid.querySelectorAll("[data-like-post]").forEach((button) => {
    button.addEventListener("click", async () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.likePost);
      if (!post) return;
      if (supabaseClient && !requireAuth()) return;
      if (supabaseClient && session && isUuid(post.id)) {
        await toggleLikeRemote(post);
      }
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      renderExplore();
      showToast(post.liked ? t.liked : t.unliked);
    });
  });
}

async function loadWorksFromApi() {
  const requestId = (worksRequestId += 1);
  try {
    const response = await fetch(`/api/works?mode=${exploreType}&sort=${exploreSort}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Failed to load works");
    const payload = await response.json();
    if (requestId !== worksRequestId) return;
    if (Array.isArray(payload.works) && payload.works.length > 0) {
      const loadedPosts = payload.works.map((post) => ({
        id: post.id,
        title: post.title,
        creator: post.creator,
        mode: "video",
        cost: post.cost || 0,
        image: post.image,
        mediaUrl: post.mediaUrl,
        likes: post.likes || 0,
        liked: likedWorkIds.has(post.id),
        character: post.character,
        createdAt: post.createdAt || Date.now()
      }));
      sharedPosts =
        loadedPosts.length >= 8
          ? loadedPosts
          : Array.from({ length: 18 }, (_, index) => ({
              ...loadedPosts[index % loadedPosts.length],
              id: `${loadedPosts[index % loadedPosts.length].id}-feed-${index}`,
              likes: loadedPosts[index % loadedPosts.length].likes + index
            }));
    } else {
      sharedPosts = fallbackPosts.map((post) => ({ ...post }));
    }
  } catch (error) {
    sharedPosts = fallbackPosts.map((post) => ({ ...post }));
  }
  renderExplore();
  handleWorkDeepLink();
}

let deepLinkHandled = false;
function handleWorkDeepLink() {
  if (deepLinkHandled) return;
  const workId = new URLSearchParams(window.location.search).get("work");
  if (!workId) {
    deepLinkHandled = true;
    return;
  }
  const card = exploreGrid && exploreGrid.querySelector(`[data-work-id="${CSS.escape(workId)}"]`);
  if (!card) return;
  deepLinkHandled = true;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.add("is-highlighted");
  setTimeout(() => card.classList.remove("is-highlighted"), 2600);
}

async function loadCharactersFromApi() {
  try {
    const response = await fetch("/api/characters", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Failed to load characters");
    const payload = await response.json();
    if (!Array.isArray(payload.characters) || payload.characters.length === 0) return;
    characters = payload.characters.map((character, index) => ({
      id: character.id,
      name: character.name,
      age: character.age ?? "",
      tag: character.tag || "",
      vibe: character.vibe || "",
      image: character.image || makePortrait(index + 8, character.name, character.tag || "")
    }));
    currentCharacter = characters[0];
    activeChat = charAt(8);
    renderAll();
  } catch (error) {
    // Keep the local fallback data when the API is unavailable.
  }
}

async function loadTemplatesFromApi() {
  try {
    const response = await fetch(`/api/templates?locale=${locale}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Failed to load templates");
    const payload = await response.json();
    if (!Array.isArray(payload.templates) || payload.templates.length === 0) return;
    const imageRows = payload.templates.filter((template) => template.mode === "image");
    const videoRows = payload.templates.filter((template) => template.mode === "video");
    if (imageRows.length > 0) {
      imageTemplates = imageRows.map((template, index) => ({
        id: template.id,
        name: template.name,
        category: t.modeName.image,
        cost: template.cost,
        mode: "image",
        image: template.image || makeScene(index + 40, template.name, "image")
      }));
    }
    if (videoRows.length > 0) {
      videoTemplates = videoRows.map((template, index) => ({
        id: template.id,
        name: template.name,
        category: t.modeName.video,
        cost: template.cost,
        mode: "video",
        image: template.image || makeScene(index + 70, template.name, "video")
      }));
      currentTemplate = videoTemplates[0];
    }
    renderCreatorFlow();
  } catch (error) {
    // Keep the local fallback data when the API is unavailable.
  }
}

function shareCard(post) {
  return `
    <article class="share-card" data-work-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" />
      <div class="video-play">▶</div>
      <div class="share-card-body">
        <span>${post.creator} · ${post.character}</span>
        <strong>${post.title}</strong>
        <div class="share-actions">
          <button class="like-button ${post.liked ? "is-liked" : ""}" data-like-post="${post.id}" aria-pressed="${post.liked}">
            <span>♥</span><b>${post.likes.toLocaleString()}</b>
          </button>
          <button data-share-post="${post.id}">${t.share}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCharacterModal() {
  if (!characterModalGrid) return;
  characterModalGrid.innerHTML = characters
    .map((character) => characterCard(character))
    .join("");
  characterModalGrid.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentCharacter = characters.find((item) => item.id === card.dataset.id);
      closeDialog(characterModal);
      renderCreatorFlow();
    });
  });
}

function characterCard(character) {
  return `
    <button class="character-card" data-id="${character.id}">
      <img src="${character.image}" alt="${character.name}" />
      <span>${character.vibe}</span>
      <strong>${character.name}, ${character.age}</strong>
      <em>${character.tag}</em>
    </button>
  `;
}

function renderChat() {
  const conversations = t.conversations;
  qs("#conversationList").innerHTML = conversations
    .map(
      (row, index) => {
        const character = charAt(index === 0 ? 8 : index);
        return `
      <button class="conversation-item ${character.id === activeChat.id ? "is-active" : ""}" data-id="${character.id}">
        <img src="${character.image}" alt="${character.name}" />
        <div><strong>${row[0]}</strong><small>${row[1]}</small><span>${row[2]}</span></div>
      </button>
    `;
      }
    )
    .join("");
  qsa(".conversation-item").forEach((item) => {
    item.addEventListener("click", () => {
      activeChat = characters.find((character) => character.id === item.dataset.id);
      chatScreen = "detail";
      renderChat();
    });
  });

  qs("#chatAvatar").src = activeChat.image;
  qs("#chatName").textContent = activeChat.name;
  renderChatMessages();
  qs("#albumHero").src = activeChat.image;
  qs("#albumThumbOne").src = activeChat.image;
  qs("#albumThumbTwo").src = characters[(characters.indexOf(activeChat) + 1) % characters.length].image;
  qs("#albumThumbThree").src = characters[(characters.indexOf(activeChat) + 2) % characters.length].image;
  qs("#albumName").textContent = `${activeChat.name}, ${activeChat.age}`;
  updateChatScreen();
  hydrateChatMessages();
}

function beginTemplate(id) {
  currentTemplate = videoTemplates.find((template) => template.id === id);
  renderCreatorFlow();
}

function showCompose() {
  renderCreatorFlow();
}

function showTemplates() {
  renderCreatorFlow();
}

function setMode(nextMode, shouldRender = true) {
  mode = "video";
  expanded = false;
  qsa(".mode-tab").forEach((item) => item.classList.toggle("is-active", item.dataset.mode === mode));
  if (shouldRender) renderCreatorFlow();
}

function openCreateFlow(template, character) {
  currentTemplate = template.mode === "video" ? template : videoTemplates[0];
  currentCharacter = character;
  setMode("video", true);
  switchView("generate");
  renderCreatorFlow();
}

async function shareToExplore(item, characterName = currentCharacter.name) {
  if (supabaseClient && session && item.workId) {
    await supabaseClient
      .from("works")
      .update({ visibility: "public" })
      .eq("id", item.workId)
      .eq("user_id", session.user.id);
    item.visibility = "public";
    await loadWorksFromApi();
    switchView("explore");
    showToast(t.shareDone);
    return;
  }
  sharedPosts.unshift({
    id: `post-${Date.now()}`,
    title: item.title,
    creator: profile && profile.display_name ? `@${profile.display_name}` : "@User",
    mode: "video",
    cost: item.cost,
    image: item.image,
    likes: 0,
    liked: false,
    character: characterName,
    createdAt: Date.now()
  });
  renderExplore();
  switchView("explore");
  showToast(t.shareDone);
}

function updateChatScreen() {
  const layout = qs("#chatLayout");
  if (!layout) return;
  layout.classList.toggle("chat-list-mode", chatScreen === "list");
  layout.classList.toggle("chat-detail-mode", chatScreen === "detail");
}

function shareUrl(post) {
  const basePath = locale === "ja" ? "/ja" : "/";
  return `${window.location.origin}${basePath}?work=${encodeURIComponent(post.id)}`;
}

function shareLink(platform, post) {
  const pageUrl = encodeURIComponent(shareUrl(post));
  const text = encodeURIComponent(`${post.title} - OpenLover`);
  const urls = {
    Telegram: `https://t.me/share/url?url=${pageUrl}&text=${text}`,
    LINE: `https://social-plugins.line.me/lineit/share?url=${pageUrl}`,
    WhatsApp: `https://wa.me/?text=${text}%20${pageUrl}`,
    Messenger: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    X: `https://twitter.com/intent/tweet?text=${text}&url=${pageUrl}`,
    QQ: `https://connect.qq.com/widget/shareqq/index.html?url=${pageUrl}&title=${text}`
  };
  return urls[platform] || "";
}

async function copyShareLink(post) {
  try {
    await navigator.clipboard.writeText(shareUrl(post));
    showToast(t.linkCopied);
  } catch (error) {
    window.prompt("URL", shareUrl(post));
  }
}

function openShareModal(post) {
  if (!post) return;
  if (navigator.share) {
    navigator
      .share({ title: `${post.title} - OpenLover`, url: shareUrl(post) })
      .catch(() => {});
    return;
  }
  qs("#shareModalSubtitle").textContent = t.shareOpened;
  sharePlatformGrid.innerHTML =
    `<button class="share-platform" data-copy-link>${t.copyLink}</button>` +
    t.sharePlatforms
      .map((platform) => `<button class="share-platform" data-platform="${platform}">${platform}</button>`)
      .join("");
  const copyButton = sharePlatformGrid.querySelector("[data-copy-link]");
  if (copyButton) {
    copyButton.addEventListener("click", () => {
      copyShareLink(post);
      closeDialog(shareModal);
    });
  }
  sharePlatformGrid.querySelectorAll("[data-platform]").forEach((button) => {
    button.addEventListener("click", () => {
      const platform = button.dataset.platform;
      const url = shareLink(platform, post);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      showToast(t.shareCopied(platform));
      closeDialog(shareModal);
    });
  });
  openDialog(shareModal);
}

function renderHistory() {
  const rows = history.length
    ? history
        .map(
          (item) => `
        <div class="history-item">
          <img src="${item.image}" alt="${item.title}" />
          <div><strong>${item.title}</strong><br /><span>${t.modeName[item.mode]} · ${item.cost} ${t.coins}</span></div>
          <button class="ghost-button">${t.download}</button>
          <button class="ghost-button" data-history-share="${item.id}">${t.share}</button>
        </div>
      `
        )
        .join("")
    : `<p class="legal">${t.noHistory}</p>`;
  qs("#historyList").innerHTML = rows;
  qs("#historyList").querySelectorAll("[data-history-share]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = history.find((entry) => entry.id === button.dataset.historyShare);
      if (item) shareToExplore(item, item.character || currentCharacter.name);
    });
  });
  const profileHistory = qs("#profileHistory");
  if (profileHistory) profileHistory.innerHTML = rows;
}

async function generateMock() {
  if (!requireAuth()) return;
  const cost = currentTemplate.cost;
  if (balance < cost) {
    openDialog(upgradeModal);
    return;
  }
  qs("#previewState").textContent = t.generating;
  qs("#generateButton").disabled = true;

  if (supabaseClient && session) {
    try {
      const { data: newBalance, error } = await supabaseClient.rpc("spend_diamonds", {
        amount: cost,
        reason: `${currentTemplate.name} · ${t.modeName[mode]}`
      });
      if (error) throw error;
      balance = typeof newBalance === "number" ? newBalance : balance - cost;
      if (profile) profile.diamond_balance = balance;

      const title = `${currentCharacter.name} · ${currentTemplate.name}`;
      const remoteImage =
        currentCharacter.image && currentCharacter.image.startsWith("http") ? currentCharacter.image : "";
      const { data: work } = await supabaseClient
        .from("works")
        .insert({
          user_id: session.user.id,
          character_id: isUuid(currentCharacter.id) ? currentCharacter.id : null,
          title,
          mode,
          cost,
          media_url: remoteImage,
          thumbnail_url: remoteImage || null,
          visibility: "private"
        })
        .select("id")
        .single();

      const result = {
        id: `history-${Date.now()}`,
        workId: work ? work.id : null,
        title,
        mode,
        cost,
        character: currentCharacter.name,
        visibility: "private",
        image: makeResultImage(currentTemplate, currentCharacter, history.length + 1)
      };
      history.unshift(result);
      const composePreview = qs("#composePreview");
      if (composePreview) composePreview.src = result.image;
      qs("#previewState").textContent = t.complete;
      updateBalance();
      renderHistory();
      showToast(t.toastDone);
    } catch (error) {
      qs("#previewState").textContent = t.ready;
      if (String(error.message || error).includes("insufficient")) openDialog(upgradeModal);
    } finally {
      qs("#generateButton").disabled = false;
    }
    return;
  }

  window.setTimeout(() => {
    balance -= cost;
    const result = {
      id: `history-${Date.now()}`,
      title: `${currentCharacter.name} · ${currentTemplate.name}`,
      mode,
      cost,
      character: currentCharacter.name,
      image: makeResultImage(currentTemplate, currentCharacter, history.length + 1)
    };
    history.unshift(result);
    const composePreview = qs("#composePreview");
    if (composePreview) composePreview.src = result.image;
    qs("#previewState").textContent = t.complete;
    qs("#generateButton").disabled = false;
    updateBalance();
    renderHistory();
    showToast(t.toastDone);
  }, 760);
}

function updateBalance() {
  const coinBalance = qs("#coinBalance");
  if (!coinBalance) return;
  if (supabaseClient && !session) {
    coinBalance.textContent = "—";
    return;
  }
  coinBalance.textContent = balance >= 1000 ? `${(balance / 1000).toFixed(1)}${t.thousand}` : String(balance);
}

function updateAuthUi() {
  if (authButton) authButton.textContent = session ? t.logout : t.login;
  const profileAuthButton = qs("#profileAuthButton");
  if (profileAuthButton) profileAuthButton.textContent = session ? t.logout : t.login;
  const profileTitle = qs("#profileTitle");
  const profileId = qs("#profileId");
  if (session) {
    if (profileTitle && profile && profile.display_name) profileTitle.textContent = profile.display_name;
    if (profileId) profileId.textContent = (session.user && session.user.email) || "";
  } else {
    if (profileTitle) profileTitle.textContent = t.guestName;
    if (profileId) profileId.textContent = t.notLoggedIn;
  }
}

function setAuthMode(nextMode) {
  authMode = nextMode;
  const title = qs("#authModalTitle");
  const submit = qs("#authSubmit");
  const toggle = qs("#authToggleMode");
  if (title) title.textContent = authMode === "login" ? t.authLoginTitle : t.authRegisterTitle;
  if (submit) submit.textContent = authMode === "login" ? t.authLoginAction : t.authRegisterAction;
  if (toggle) toggle.textContent = authMode === "login" ? t.authToRegister : t.authToLogin;
  const authError = qs("#authError");
  if (authError) authError.textContent = "";
}

function setAuthScreenMode(nextMode) {
  authScreenMode = nextMode;
  if (!authScreen) return;
  authScreen.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.authTab === authScreenMode);
  });
  const confirmRow = qs("#authConfirmRow");
  if (confirmRow) confirmRow.hidden = authScreenMode !== "register";
  const submit = qs("#authScreenSubmit");
  if (submit) submit.textContent = authScreenMode === "login" ? t.authLoginAction : t.authRegisterAction;
  const password = qs("#authScreenPassword");
  if (password) password.autocomplete = authScreenMode === "login" ? "current-password" : "new-password";
  const errorEl = qs("#authScreenError");
  if (errorEl) errorEl.textContent = "";
}

function showAuthScreen(mode = "login") {
  if (!authScreen || !supabaseClient) return;
  setAuthScreenMode(mode);
  authScreen.hidden = false;
}

function hideAuthScreen() {
  if (authScreen) authScreen.hidden = true;
}

async function handleAuthScreenSubmit() {
  if (!supabaseClient) return;
  const email = (qs("#authScreenEmail")?.value || "").trim();
  const password = qs("#authScreenPassword")?.value || "";
  const confirm = qs("#authScreenConfirm")?.value || "";
  const errorEl = qs("#authScreenError");
  if (!email || !password) return;
  if (authScreenMode === "register" && password !== confirm) {
    if (errorEl) errorEl.textContent = t.passwordMismatch;
    return;
  }
  const submit = qs("#authScreenSubmit");
  if (submit) submit.disabled = true;
  try {
    if (authScreenMode === "login") {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      hideAuthScreen();
      showToast(t.authWelcome);
    } else {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        hideAuthScreen();
        showToast(t.authSignedUp);
      } else {
        setAuthScreenMode("login");
        if (errorEl) errorEl.textContent = t.authConfirmEmail;
      }
    }
  } catch (error) {
    if (errorEl) errorEl.textContent = error.message || String(error);
  } finally {
    if (submit) submit.disabled = false;
  }
}

function requireAuth() {
  if (!supabaseClient || session) return true;
  showAuthScreen("login");
  showToast(t.authRequired);
  return false;
}

async function handleAuthSubmit() {
  if (!supabaseClient) return;
  const email = (qs("#authEmail")?.value || "").trim();
  const password = qs("#authPassword")?.value || "";
  const authError = qs("#authError");
  if (!email || !password) return;
  const submit = qs("#authSubmit");
  if (submit) submit.disabled = true;
  try {
    if (authMode === "login") {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      closeDialog(authModal);
      showToast(t.authWelcome);
    } else {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      closeDialog(authModal);
      showToast(data.session ? t.authSignedUp : t.authConfirmEmail);
    }
  } catch (error) {
    if (authError) authError.textContent = error.message || String(error);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function loadProfile() {
  if (!supabaseClient || !session) return;
  const { data } = await supabaseClient
    .from("profiles")
    .select("id,display_name,diamond_balance,locale")
    .eq("id", session.user.id)
    .maybeSingle();
  if (!data) return;
  profile = data;
  balance = data.diamond_balance;
  updateAuthUi();
  updateBalance();
}

async function loadUserHistory() {
  if (!supabaseClient || !session) return;
  const { data } = await supabaseClient
    .from("works")
    .select("id,title,mode,cost,thumbnail_url,media_url,visibility,created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(40);
  if (!Array.isArray(data)) return;
  history = data.map((work, index) => ({
    id: `db-${work.id}`,
    workId: work.id,
    title: work.title,
    mode: work.mode,
    cost: work.cost,
    visibility: work.visibility,
    image: work.thumbnail_url || work.media_url || makeScene(index + 200, work.title, work.mode)
  }));
  renderHistory();
}

async function loadUserLikes() {
  if (!supabaseClient || !session) return;
  const { data } = await supabaseClient
    .from("work_likes")
    .select("work_id")
    .eq("user_id", session.user.id);
  likedWorkIds = new Set(Array.isArray(data) ? data.map((row) => row.work_id) : []);
  let changed = false;
  sharedPosts.forEach((post) => {
    const liked = likedWorkIds.has(post.id);
    if (post.liked !== liked) {
      post.liked = liked;
      changed = true;
    }
  });
  if (changed) renderExplore();
}

async function toggleLikeRemote(post) {
  if (post.liked) {
    likedWorkIds.delete(post.id);
    await supabaseClient
      .from("work_likes")
      .delete()
      .eq("work_id", post.id)
      .eq("user_id", session.user.id);
  } else {
    likedWorkIds.add(post.id);
    await supabaseClient
      .from("work_likes")
      .insert({ work_id: post.id, user_id: session.user.id });
  }
}

async function ensureChatSession(character) {
  if (!supabaseClient || !session || !isUuid(character.id)) return null;
  if (chatSessionIds.has(character.id)) return chatSessionIds.get(character.id);
  const { data: existing } = await supabaseClient
    .from("chat_sessions")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("character_id", character.id)
    .maybeSingle();
  if (existing) {
    chatSessionIds.set(character.id, existing.id);
    return existing.id;
  }
  const { data: created } = await supabaseClient
    .from("chat_sessions")
    .insert({ user_id: session.user.id, character_id: character.id, title: character.name })
    .select("id")
    .single();
  if (!created) return null;
  chatSessionIds.set(character.id, created.id);
  return created.id;
}

function getTranscript(character) {
  if (!chatTranscripts.has(character.id)) chatTranscripts.set(character.id, []);
  return chatTranscripts.get(character.id);
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
  if (!container) return;
  container.innerHTML = `
    <div class="story-time">03:38</div>
    <div class="message">${t.chatMessages[0]}</div>
    <div class="message">${t.chatMessages[1]}</div>
    <div class="message user">${t.chatMessages[2]}</div>
    <div class="message">${t.chatMessages[3]}</div>
  `;
  getTranscript(activeChat).forEach((message) =>
    appendChatMessage(message.role === "user" ? "user" : "character", message.content)
  );
}

async function hydrateChatMessages() {
  if (!supabaseClient || !session || !isUuid(activeChat.id)) return;
  if (hydratedChats.has(activeChat.id)) return;
  hydratedChats.add(activeChat.id);
  if (!chatSessionIds.has(activeChat.id)) {
    const { data } = await supabaseClient
      .from("chat_sessions")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("character_id", activeChat.id)
      .maybeSingle();
    if (!data) return;
    chatSessionIds.set(activeChat.id, data.id);
  }
  const sessionId = chatSessionIds.get(activeChat.id);
  const characterId = activeChat.id;
  const { data: messages } = await supabaseClient
    .from("chat_messages")
    .select("sender,content,created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (!Array.isArray(messages)) return;
  chatTranscripts.set(
    characterId,
    messages.map((message) => ({
      role: message.sender === "user" ? "user" : "assistant",
      content: message.content
    }))
  );
  if (characterId === activeChat.id) renderChatMessages();
}

function introContext() {
  return [
    { role: "assistant", content: t.chatMessages[0] },
    { role: "assistant", content: t.chatMessages[1] },
    { role: "user", content: t.chatMessages[2] },
    { role: "assistant", content: t.chatMessages[3] }
  ];
}

async function sendChatMessage() {
  if (!requireAuth()) return;
  if (chatBusy) return;
  const input = qs(".chat-input input");
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;
  input.value = "";
  chatBusy = true;
  const character = activeChat;
  const transcript = getTranscript(character);
  appendChatMessage("user", content);
  transcript.push({ role: "user", content });

  let sessionId = null;
  if (supabaseClient && session && isUuid(character.id)) {
    sessionId = await ensureChatSession(character);
    if (sessionId) {
      supabaseClient
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "user", content })
        .then(() => {});
    }
  }

  const typing = appendChatMessage("character", "…");
  let reply = null;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        character: { name: character.name, age: character.age, tag: character.tag },
        messages: [...introContext(), ...transcript.slice(-16)]
      })
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload && typeof payload.reply === "string" && payload.reply.trim()) reply = payload.reply.trim();
    }
  } catch (error) {
    // Fall through to placeholder reply.
  }
  if (typing) typing.remove();

  const finalReply = reply || t.chatPlaceholderReply;
  if (character.id === activeChat.id) appendChatMessage("character", finalReply);
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

function resetUserState() {
  profile = null;
  balance = 570;
  history = [];
  likedWorkIds = new Set();
  chatSessionIds.clear();
  chatTranscripts.clear();
  hydratedChats.clear();
  renderChatMessages();
  sharedPosts.forEach((post) => {
    post.liked = false;
  });
  renderHistory();
  renderExplore();
  updateAuthUi();
  updateBalance();
  switchView("explore");
}

function switchView(view) {
  currentView = view;
  qsa(".view").forEach((item) => item.classList.toggle("is-visible", item.id === `view-${view}`));
  qsa("[data-view]").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  qs(".sidebar").classList.remove("is-open");
  qs("#historyDrawer").classList.remove("is-open");
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

qsa("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (view !== "explore" && !requireAuth()) return;
    if (view === "chat") {
      chatScreen = "list";
      updateChatScreen();
    }
    switchView(view);
  });
});

qsa("[data-open-upgrade]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    openDialog(upgradeModal);
  });
});

qsa("[data-close-upgrade]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(upgradeModal));
});
qsa("[data-open-delete]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    openDialog(deleteConfirmModal);
  });
});
qsa("[data-open-profile-edit]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireAuth()) return;
    const nicknameInput = qs("#nicknameInput");
    if (nicknameInput) nicknameInput.value = qs("#profileTitle").textContent.trim();
    const profileIdInput = qs("#profileIdInput");
    if (profileIdInput) profileIdInput.value = session && session.user ? session.user.email || "" : "";
    openDialog(profileEditModal);
  });
});
qsa("[data-close-profile-edit]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(profileEditModal));
});
qsa("[data-save-profile]").forEach((button) => {
  button.addEventListener("click", async () => {
    const nicknameInput = qs("#nicknameInput");
    const nickname = nicknameInput ? nicknameInput.value.trim() : "";
    if (nickname) {
      qs("#profileTitle").textContent = nickname;
      if (supabaseClient && session) {
        await supabaseClient
          .from("profiles")
          .update({ display_name: nickname, updated_at: new Date().toISOString() })
          .eq("id", session.user.id);
        if (profile) profile.display_name = nickname;
      }
    }
    closeDialog(profileEditModal);
    showToast(t.profileSaved);
  });
});
qsa("[data-close-delete]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(deleteConfirmModal));
});
qsa("[data-confirm-delete]").forEach((button) => {
  button.addEventListener("click", () => {
    closeDialog(deleteConfirmModal);
    showToast(t.deleteSubmitted);
  });
});
qsa("[data-close-share]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(shareModal));
});
const closeCharacterModal = qs("[data-close-modal]");
if (closeCharacterModal) closeCharacterModal.addEventListener("click", () => closeDialog(characterModal));

const sortFilter = qs("#sortFilter");
if (sortFilter) {
  sortFilter.addEventListener("change", (event) => {
    exploreSort = event.target.value;
    loadWorksFromApi();
  });
}

const typeFilter = qs("#typeFilter");
if (typeFilter) {
  typeFilter.addEventListener("change", (event) => {
    exploreType = event.target.value;
    loadWorksFromApi();
  });
}

qsa(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    setMode(tab.dataset.mode);
  });
});

const loadMoreButton = qs("#loadMoreButton");
if (loadMoreButton) {
  loadMoreButton.addEventListener("click", () => {
    expanded = true;
    renderCreatorFlow();
  });
}

const backToTemplates = qs("#backToTemplates");
if (backToTemplates) backToTemplates.addEventListener("click", showTemplates);
const historyButton = qs("#historyButton");
if (historyButton) historyButton.addEventListener("click", () => qs("#historyDrawer").classList.add("is-open"));
const closeHistory = qs("#closeHistory");
if (closeHistory) closeHistory.addEventListener("click", () => qs("#historyDrawer").classList.remove("is-open"));
const selectCharacterAgain = qs("#selectCharacterAgain");
if (selectCharacterAgain) selectCharacterAgain.addEventListener("click", () => openDialog(characterModal));
const removeCharacter = qs("#removeCharacter");
if (removeCharacter) {
  removeCharacter.addEventListener("click", () => {
    currentCharacter = characters[0];
    renderCreatorFlow();
    openDialog(characterModal);
  });
}
qs("#generateButton").addEventListener("click", generateMock);
qsa("[data-chat-create]").forEach((button) => {
  button.addEventListener("click", () => {
    openCreateFlow(videoTemplates[0], activeChat);
  });
});

if (uploadInput) {
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      uploadedCharacterImage = String(reader.result);
      currentCharacter = {
        id: "uploaded",
        name: t.uploadedName,
        age: "",
        tag: t.uploadedName,
        vibe: t.uploadedName,
        image: uploadedCharacterImage
      };
      const uploadHint = qs("#uploadHint");
      if (uploadHint) uploadHint.textContent = file.name;
      renderCreatorFlow();
      showToast(t.uploadedReady);
    });
    reader.readAsDataURL(file);
  });
}

const chatAlbumButton = qs("[data-chat-album]");
if (chatAlbumButton) {
  chatAlbumButton.addEventListener("click", () => {
    qs(".album-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

const backToConversations = qs("#backToConversations");
if (backToConversations) {
  backToConversations.addEventListener("click", () => {
    chatScreen = "list";
    updateChatScreen();
  });
}

qsa(".segmented-control button").forEach((button) => {
  button.addEventListener("click", () => {
    qsa(".segmented-control button").forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

qsa("[data-payment]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(t.selectedPayment(button.dataset.payment));
    closeDialog(upgradeModal);
  });
});

const globalSearch = qs("#globalSearch");
if (globalSearch) {
  globalSearch.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    qsa(".template-card, .gallery-card, .character-card, .share-card, .conversation-item").forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });
}

async function handleAuthButtonClick() {
  if (!supabaseClient) return;
  if (session) {
    await supabaseClient.auth.signOut();
    showToast(t.authSignedOut);
  } else {
    showAuthScreen("login");
  }
}

if (authButton) authButton.addEventListener("click", handleAuthButtonClick);
const profileAuthButtonEl = qs("#profileAuthButton");
if (profileAuthButtonEl) profileAuthButtonEl.addEventListener("click", handleAuthButtonClick);

const authToggleMode = qs("#authToggleMode");
if (authToggleMode) {
  authToggleMode.addEventListener("click", () => setAuthMode(authMode === "login" ? "register" : "login"));
}
const authSubmit = qs("#authSubmit");
if (authSubmit) authSubmit.addEventListener("click", handleAuthSubmit);
qsa("[data-close-auth]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(authModal));
});
const authPassword = qs("#authPassword");
if (authPassword) {
  authPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleAuthSubmit();
  });
}

const chatSendButton = qs(".chat-input button");
if (chatSendButton) chatSendButton.addEventListener("click", sendChatMessage);
const chatInput = qs(".chat-input input");
if (chatInput) {
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendChatMessage();
  });
}

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
  const authGuestLink = qs("#authGuestLink");
  if (authGuestLink) {
    authGuestLink.addEventListener("click", () => hideAuthScreen());
  }
}

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, newSession) => {
    const hadSession = Boolean(session);
    session = newSession;
    if (session) {
      hideAuthScreen();
      updateAuthUi();
      loadProfile();
      loadUserHistory();
      loadUserLikes();
    } else if (hadSession) {
      resetUserState();
    } else {
      updateAuthUi();
    }
  });
}

renderAll();
loadWorksFromApi();
loadCharactersFromApi();
loadTemplatesFromApi();

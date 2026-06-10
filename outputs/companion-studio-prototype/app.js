const locale = document.documentElement.lang.startsWith("ja") || location.pathname.startsWith("/ja") ? "ja" : "zh";

const dictionary = {
  zh: {
    activePlan: "标准版",
    ageSuffix: "岁",
    chatCompanion: "新聊天",
    coins: "钻石",
    complete: "已完成",
    download: "下载",
    galleryTag: "灵感",
    generating: "创作中",
    modeLabel: { image: "创作图片", video: "创作视频" },
    modeName: { image: "图片", video: "视频" },
    noHistory: "还没有创作记录。",
    ready: "准备就绪",
    repeat: "复用",
    resultLabel: (count) => `作品 #${count}`,
    selectedPlan: (plan) => `已选择 ${plan}，下一步进入支付确认。`,
    share: "分享",
    shareDone: "分享链接已创建，作品已加入作品广场。",
    shareOpened: "选择要分享的聊天软件。",
    shareCopied: (platform) => `已为 ${platform} 准备分享链接。`,
    sharePlatforms: ["微信", "QQ", "Telegram", "LINE", "WhatsApp"],
    chatStarted: (name) => `已为 ${name} 新开聊天。`,
    liked: "已点赞。",
    unliked: "已取消点赞。",
    thousand: "K",
    toastDone: "创作已完成，并保存到历史。",
    prompt: (template, character) =>
      `${template.name}，${character.name}，保持角色一致，OpenLover 创作风格，替换素材版本。`,
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
    chatCompanion: "新規チャット",
    coins: "ダイヤ",
    complete: "完了",
    download: "ダウンロード",
    galleryTag: "ギャラリー",
    generating: "創作中",
    modeLabel: { image: "画像創作", video: "動画創作" },
    modeName: { image: "画像", video: "動画" },
    noHistory: "創作履歴はまだありません。",
    ready: "準備完了",
    repeat: "再利用",
    resultLabel: (count) => `作品 #${count}`,
    selectedPlan: (plan) => `${plan} を選択しました。次は支払い確認です。`,
    share: "共有",
    shareDone: "共有リンクを作成し、作品を投稿広場に追加しました。",
    shareOpened: "共有先のチャットアプリを選択してください。",
    shareCopied: (platform) => `${platform} の共有リンクを準備しました。`,
    sharePlatforms: ["LINE", "Telegram", "WhatsApp", "Messenger", "X"],
    chatStarted: (name) => `${name} の新規チャットを開きました。`,
    liked: "いいねしました。",
    unliked: "いいねを取り消しました。",
    thousand: "K",
    toastDone: "創作が完了し、履歴に保存しました。",
    prompt: (template, character) =>
      `${template.name}、${character.name}、キャラクターの一貫性、OpenLover創作スタイル、差し替え素材版。`,
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

const characters = t.characters.map((item, index) => ({
  id: `char-${index}`,
  name: item[0],
  age: item[1],
  tag: item[2],
  vibe: item[3],
  image: makePortrait(index + 8, item[0], item[2])
}));

const imageTemplates = t.imageTemplates.map((item, index) => ({
  id: `image-${index}`,
  name: item[0],
  category: item[1],
  cost: item[2],
  mode: "image",
  image: makeScene(index + 40, item[0], "image")
}));

const videoTemplates = t.videoTemplates.map((item, index) => ({
  id: `video-${index}`,
  name: item[0],
  category: item[1],
  cost: item[2],
  mode: "video",
  image: makeScene(index + 70, item[0], "video")
}));

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
let balance = 570;
let history = [];
let activeChat = characters[8];
let chatScreen = "list";

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

const templateGrid = qs("#templateGrid");
const galleryGrid = qs("#galleryGrid");
const exploreGrid = qs("#exploreGrid");
const characterModalGrid = qs("#characterModalGrid");
const characterModal = qs("#characterModal");
const upgradeModal = qs("#upgradeModal");
const shareModal = qs("#shareModal");
const sharePlatformGrid = qs("#sharePlatformGrid");
const toast = qs("#toast");

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
    ["#userAvatar", characters[2].image],
    ["#profileAvatar", characters[2].image],
    ["#albumHero", characters[8].image],
    ["#albumThumbOne", characters[8].image],
    ["#albumThumbTwo", characters[1].image],
    ["#albumThumbThree", characters[2].image]
  ];
  optionalImages.forEach(([selector, image]) => {
    const element = qs(selector);
    if (element) element.src = image;
  });
  renderTemplates();
  renderGallery();
  renderExplore();
  renderCharacterModal();
  renderChat();
  renderHistory();
  updateBalance();
}

function renderTemplates() {
  const source = videoTemplates;
  const visible = expanded ? source : source.slice(0, 8);
  templateGrid.innerHTML = visible.map(templateCard).join("");
  templateGrid.querySelectorAll(".template-card").forEach((card) => {
    card.addEventListener("click", () => beginTemplate(card.dataset.id));
  });
  qs("#loadMoreButton").hidden = visible.length === source.length;
}

function templateCard(item) {
  return `
    <button class="template-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" />
      <strong>${item.name}</strong>
    </button>
  `;
}

function renderGallery() {
  galleryGrid.innerHTML = gallery
    .filter((item) => item.mode === "video")
    .map(
      (item) => `
      <article class="gallery-card">
        <img src="${item.image}" alt="${item.title}" />
        <span>${item.creator}</span>
        <button class="repeat-button" data-repeat="${item.id}">${t.repeat}</button>
      </article>
    `
    )
    .join("");
  galleryGrid.querySelectorAll("[data-repeat]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const item = gallery.find((entry) => entry.id === button.dataset.repeat);
      const template = {
        id: item.id,
        name: item.title,
        category: t.galleryTag,
        cost: item.cost,
        mode: item.mode,
        image: item.image
      };
      openCreateFlow(template, characters[(gallery.indexOf(item) + 4) % characters.length]);
    });
  });
}

function renderExplore() {
  const visiblePosts = sharedPosts
    .filter((post) => post.mode === "video");
  exploreGrid.innerHTML = visiblePosts
    .map((post) => shareCard(post))
    .join("");
  exploreGrid.querySelectorAll("[data-repeat-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.repeatPost);
      const template = {
        id: post.id,
        name: post.title,
        category: t.galleryTag,
        cost: post.cost,
        mode: post.mode,
        image: post.image
      };
      openCreateFlow(template, characters.find((item) => item.name === post.character) || characters[0]);
    });
  });
  exploreGrid.querySelectorAll("[data-chat-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.chatPost);
      activeChat = characters.find((item) => item.name === post.character) || characters[8];
      chatScreen = "detail";
      renderChat();
      switchView("chat");
      showToast(t.chatStarted(activeChat.name));
    });
  });
  exploreGrid.querySelectorAll("[data-share-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.sharePost);
      openShareModal(post);
    });
  });
  exploreGrid.querySelectorAll("[data-like-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = sharedPosts.find((item) => item.id === button.dataset.likePost);
      if (!post) return;
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
    const response = await fetch("/api/works?mode=video&sort=latest", {
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
        liked: false,
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
}

function shareCard(post) {
  return `
    <article class="share-card">
      <img src="${post.image}" alt="${post.title}" />
      <div class="video-play">▶</div>
      <div class="share-card-body">
        <span>${post.creator} · ${post.character}</span>
        <strong>${post.title}</strong>
        <div class="share-actions">
          <button class="like-button ${post.liked ? "is-liked" : ""}" data-like-post="${post.id}" aria-pressed="${post.liked}">
            <span>♥</span><b>${post.likes.toLocaleString()}</b>
          </button>
          <button data-repeat-post="${post.id}">${t.repeat}</button>
          <button data-chat-post="${post.id}">${t.chatCompanion}</button>
          <button data-share-post="${post.id}">${t.share}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCharacterModal() {
  characterModalGrid.innerHTML = characters
    .map((character) => characterCard(character))
    .join("");
  characterModalGrid.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentCharacter = characters.find((item) => item.id === card.dataset.id);
      closeDialog(characterModal);
      showCompose();
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
        const character = characters[index === 0 ? 8 : index];
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
  qs("#chatMessages").innerHTML = `
    <div class="story-time">03:38</div>
    <div class="message">${t.chatMessages[0]}</div>
    <div class="message">${t.chatMessages[1]}</div>
    <div class="message user">${t.chatMessages[2]}</div>
    <div class="message">${t.chatMessages[3]}</div>
  `;
  qs("#albumHero").src = activeChat.image;
  qs("#albumThumbOne").src = activeChat.image;
  qs("#albumThumbTwo").src = characters[(characters.indexOf(activeChat) + 1) % characters.length].image;
  qs("#albumThumbThree").src = characters[(characters.indexOf(activeChat) + 2) % characters.length].image;
  qs("#albumName").textContent = `${activeChat.name}, ${activeChat.age}`;
  updateChatScreen();
}

function beginTemplate(id) {
  currentTemplate = videoTemplates.find((template) => template.id === id);
  openDialog(characterModal);
}

function showCompose() {
  qs("#templateScreen").hidden = true;
  qs("#composeScreen").hidden = false;
  qs("#composeModeLabel").textContent = t.modeLabel[mode];
  qs("#posePreview").src = currentTemplate.image;
  qs("#poseName").textContent = currentTemplate.name;
  qs("#characterPreview").src = currentCharacter.image;
  qs("#characterName").textContent = currentCharacter.name;
  qs("#composePreview").src = makeResultImage(currentTemplate, currentCharacter, history.length + 1);
  qs("#promptInput").value = t.prompt(currentTemplate, currentCharacter);
  qs("#generateCost").textContent = currentTemplate.cost;
  qs("#previewState").textContent = t.ready;
}

function showTemplates() {
  qs("#composeScreen").hidden = true;
  qs("#templateScreen").hidden = false;
}

function setMode(nextMode, shouldRender = true) {
  mode = "video";
  expanded = false;
  qsa(".mode-tab").forEach((item) => item.classList.toggle("is-active", item.dataset.mode === mode));
  if (shouldRender) renderTemplates();
}

function openCreateFlow(template, character) {
  currentTemplate = template.mode === "video" ? template : videoTemplates[0];
  currentCharacter = character;
  setMode("video", true);
  switchView("generate");
  showCompose();
}

function shareToExplore(item, characterName = currentCharacter.name) {
  sharedPosts.unshift({
    id: `post-${Date.now()}`,
    title: item.title,
    creator: "@User-mW4X6YPx",
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

function shareLink(platform, post) {
  const pageUrl = encodeURIComponent(window.location.href);
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

function openShareModal(post) {
  if (!post) return;
  qs("#shareModalSubtitle").textContent = t.shareOpened;
  sharePlatformGrid.innerHTML = t.sharePlatforms
    .map((platform) => `<button class="share-platform" data-platform="${platform}">${platform}</button>`)
    .join("");
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

function generateMock() {
  const cost = currentTemplate.cost;
  if (balance < cost) {
    openDialog(upgradeModal);
    return;
  }
  qs("#previewState").textContent = t.generating;
  qs("#generateButton").disabled = true;
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
    qs("#composePreview").src = result.image;
    qs("#previewState").textContent = t.complete;
    qs("#generateButton").disabled = false;
    updateBalance();
    renderHistory();
    showToast(t.toastDone);
  }, 760);
}

function updateBalance() {
  const coinBalance = qs("#coinBalance");
  if (coinBalance) {
    coinBalance.textContent = balance >= 1000 ? `${(balance / 1000).toFixed(1)}${t.thousand}` : String(balance);
  }
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
    if (button.dataset.view === "chat") {
      chatScreen = "list";
      updateChatScreen();
    }
    switchView(button.dataset.view);
  });
});

qsa("[data-open-upgrade]").forEach((button) => {
  button.addEventListener("click", () => openDialog(upgradeModal));
});

qsa("[data-close-upgrade]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(upgradeModal));
});
qsa("[data-close-share]").forEach((button) => {
  button.addEventListener("click", () => closeDialog(shareModal));
});
qs("[data-close-modal]").addEventListener("click", () => closeDialog(characterModal));

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

qs("#loadMoreButton").addEventListener("click", () => {
  expanded = true;
  renderTemplates();
});

qs("#backToTemplates").addEventListener("click", showTemplates);
qs("#historyButton").addEventListener("click", () => qs("#historyDrawer").classList.add("is-open"));
qs("#closeHistory").addEventListener("click", () => qs("#historyDrawer").classList.remove("is-open"));
qs("#selectCharacterAgain").addEventListener("click", () => openDialog(characterModal));
qs("#removeCharacter").addEventListener("click", () => {
  currentCharacter = characters[0];
  showCompose();
  openDialog(characterModal);
});
qs("#generateButton").addEventListener("click", generateMock);
qs("#shareResultButton").addEventListener("click", () => {
  shareToExplore({
    title: `${currentCharacter.name} · ${currentTemplate.name}`,
    mode,
    cost: currentTemplate.cost,
    image: qs("#composePreview").src
  }, currentCharacter.name);
});
qsa("[data-chat-create]").forEach((button) => {
  button.addEventListener("click", () => {
    openCreateFlow(videoTemplates[0], activeChat);
  });
});

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

qsa("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(t.selectedPlan(button.dataset.plan));
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

renderAll();
loadWorksFromApi();

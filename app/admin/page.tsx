"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __SUPABASE_URL__?: string;
    __SUPABASE_ANON_KEY__?: string;
  }
}

type ProfileRef =
  | { email: string | null; display_name: string | null }
  | { email: string | null; display_name: string | null }[]
  | null;

type Stats = {
  users: number;
  works: number;
  publicWorks: number;
  privateWorks: number;
  likes: number;
  chatSessions: number;
  chatMessages: number;
  diamondsSpent: number;
  diamondsGranted: number;
  arppu: number;
  characters: number;
  publicCharacters: number;
  privateCharacters: number;
  jobs: number;
  completedJobs: number;
  failedJobs: number;
  runningJobs: number;
  signupsByDay: { date: string; count: number }[];
  recentTransactions: {
    amount: number;
    reason: string;
    created_at: string;
    profiles: ProfileRef;
  }[];
  recentWorks: {
    id: string;
    title: string;
    mode: string;
    cost: number;
    created_at: string;
    profiles: ProfileRef;
  }[];
};

type AdminUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  diamond_balance: number;
  is_admin: boolean;
  locale: string;
  created_at: string;
  metrics: {
    characters: number;
    works: number;
    chats: number;
    spent: number;
    granted: number;
  };
};

type AdminCharacter = {
  id: string;
  name: string;
  age: number | null;
  tag: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
  owner_id: string | null;
  profiles: ProfileRef;
  metrics: {
    works: number;
    chats: number;
  };
};

type AdminWork = {
  id: string;
  title: string;
  mode: string;
  cost: number;
  visibility: string;
  likes_count: number;
  created_at: string;
  profiles: ProfileRef;
};

type AdminTab = "overview" | "users" | "characters" | "works";

const LOGIN_DOMAIN = "openlover.app";
const pageSize = 25;

const shell: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 20% 0%, rgba(255, 77, 154, 0.16), transparent 32%), #07070a",
  color: "var(--text)"
};

const pageWrap: React.CSSProperties = {
  width: "min(1240px, calc(100% - 32px))",
  margin: "0 auto",
  padding: "24px 0 80px"
};

const card: React.CSSProperties = {
  background: "rgba(18, 18, 22, 0.92)",
  border: "1px solid var(--line)",
  borderRadius: 12,
  boxShadow: "0 18px 60px rgba(0, 0, 0, 0.28)"
};

const sectionCard: React.CSSProperties = {
  ...card,
  padding: 18
};

const inputStyle: React.CSSProperties = {
  minHeight: 42,
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "var(--panel-2)",
  color: "var(--text)",
  padding: "0 12px",
  outline: "none"
};

const buttonStyle: React.CSSProperties = {
  minHeight: 38,
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "var(--panel-3)",
  color: "var(--text)",
  padding: "0 12px",
  cursor: "pointer"
};

const primaryButton: React.CSSProperties = {
  ...buttonStyle,
  background: "linear-gradient(135deg, var(--pink), var(--pink-2))",
  border: 0,
  color: "#fff",
  fontWeight: 800
};

const dangerButton: React.CSSProperties = {
  ...buttonStyle,
  color: "var(--danger)"
};

const muted: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 12
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  color: "var(--muted)",
  fontSize: 12,
  borderBottom: "1px solid var(--line)",
  whiteSpace: "nowrap"
};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderBottom: "1px solid rgba(43, 45, 53, 0.72)",
  fontSize: 13,
  verticalAlign: "middle"
};

function normalizeLoginEmail(value: string) {
  const trimmed = value.trim().toLowerCase();
  return trimmed.includes("@") ? trimmed : `${trimmed}@${LOGIN_DOMAIN}`;
}

function firstProfile(profile: ProfileRef) {
  return Array.isArray(profile) ? profile[0] : profile;
}

function profileName(profile: ProfileRef) {
  const owner = firstProfile(profile);
  return owner?.display_name || owner?.email || "-";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function numberLabel(value: number) {
  return Number(value || 0).toLocaleString("zh-CN");
}

function badge(label: string, tone: "pink" | "blue" | "gold" | "green" | "muted" = "muted"): React.CSSProperties {
  const colors = {
    pink: "rgba(255, 77, 154, 0.18)",
    blue: "rgba(115, 167, 255, 0.16)",
    gold: "rgba(243, 201, 107, 0.16)",
    green: "rgba(49, 214, 200, 0.16)",
    muted: "rgba(255, 255, 255, 0.06)"
  };
  const text = {
    pink: "var(--pink-2)",
    blue: "var(--blue)",
    gold: "var(--gold)",
    green: "var(--teal)",
    muted: "var(--muted)"
  };
  return {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 24,
    padding: "0 8px",
    borderRadius: 999,
    background: colors[tone],
    color: text[tone],
    fontSize: 12,
    fontWeight: 700
  };
}

export default function AdminPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [initFailed, setInitFailed] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [characters, setCharacters] = useState<AdminCharacter[]>([]);
  const [characterTotal, setCharacterTotal] = useState(0);
  const [characterPage, setCharacterPage] = useState(0);
  const [characterSearch, setCharacterSearch] = useState("");
  const [works, setWorks] = useState<AdminWork[]>([]);
  const [workTotal, setWorkTotal] = useState(0);
  const [workPage, setWorkPage] = useState(0);
  const [error, setError] = useState("");
  const [notAdmin, setNotAdmin] = useState(false);

  useEffect(() => {
    const url = window.__SUPABASE_URL__ || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = window.__SUPABASE_ANON_KEY__ || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) setSupabase(createClient(url, key));
    else setInitFailed(true);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      if (!session) throw new Error("Not signed in");
      const response = await fetch(path, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        }
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 403) {
        setNotAdmin(true);
        throw new Error("没有管理员权限");
      }
      if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      return payload;
    },
    [session]
  );

  const loadStats = useCallback(async () => {
    setError("");
    try {
      setStats(await api("/api/admin/stats"));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [api]);

  const loadUsers = useCallback(
    async (page = 0, searchTerm = "") => {
      setError("");
      try {
        const payload = await api(`/api/admin/users?page=${page}&search=${encodeURIComponent(searchTerm)}`);
        setUsers(payload.users);
        setUserTotal(payload.total);
        setUserPage(page);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [api]
  );

  const loadCharacters = useCallback(
    async (page = 0, searchTerm = "") => {
      setError("");
      try {
        const payload = await api(`/api/admin/characters?page=${page}&search=${encodeURIComponent(searchTerm)}`);
        setCharacters(payload.characters);
        setCharacterTotal(payload.total);
        setCharacterPage(page);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [api]
  );

  const loadWorks = useCallback(
    async (page = 0) => {
      setError("");
      try {
        const payload = await api(`/api/admin/works?page=${page}`);
        setWorks(payload.works);
        setWorkTotal(payload.total);
        setWorkPage(page);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [api]
  );

  useEffect(() => {
    if (!session) return;
    if (tab === "overview") loadStats();
    if (tab === "users") loadUsers(0, userSearch);
    if (tab === "characters") loadCharacters(0, characterSearch);
    if (tab === "works") loadWorks(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, tab]);

  const maxSignups = useMemo(
    () => Math.max(1, ...(stats?.signupsByDay.map((day) => day.count) ?? [1])),
    [stats]
  );

  if (initFailed) {
    return <div style={{ padding: 40 }}>缺少 Supabase 环境变量。</div>;
  }

  if (!supabase) {
    return <div style={{ padding: 40 }}>加载中...</div>;
  }

  if (!session) {
    return (
      <main style={{ ...shell, display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ ...sectionCard, width: "min(420px, 100%)", display: "grid", gap: 14 }}>
          <div>
            <p style={{ ...muted, margin: "0 0 6px" }}>运营入口</p>
            <h1 style={{ margin: 0, fontSize: 28 }}>AIAI 管理后台</h1>
          </div>
          <input
            style={inputStyle}
            type="text"
            placeholder="管理员账号"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              document.getElementById("admin-login-button")?.click();
            }}
          />
          {loginError && <p style={{ color: "var(--danger)", margin: 0, fontSize: 13 }}>{loginError}</p>}
          <button
            id="admin-login-button"
            style={primaryButton}
            onClick={async () => {
              setLoginError("");
              const normalized = normalizeLoginEmail(email);
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: normalized,
                password
              });
              if (signInError) setLoginError(signInError.message);
            }}
          >
            登录
          </button>
        </div>
      </main>
    );
  }

  if (notAdmin) {
    return (
      <main style={{ ...shell, display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ ...sectionCard, display: "grid", gap: 12, textAlign: "center" }}>
          <p style={{ margin: 0 }}>当前账号（{session.user.email}）不是管理员。</p>
          <button style={buttonStyle} onClick={() => supabase.auth.signOut().then(() => setNotAdmin(false))}>
            切换账号
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={shell}>
      <div style={pageWrap}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 16,
            marginBottom: 18
          }}
        >
          <div>
            <p style={{ ...muted, margin: "0 0 6px" }}>AIAI Console</p>
            <h1 style={{ margin: 0, fontSize: 28 }}>运营总览</h1>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
            <span style={{ ...muted, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
              {session.user.email}
            </span>
            <button style={buttonStyle} onClick={() => supabase.auth.signOut()}>
              退出
            </button>
          </div>
        </header>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {(
            [
              ["overview", "总览"],
              ["users", "用户统计"],
              ["characters", "女友资产"],
              ["works", "创作记录"]
            ] as const
          ).map(([key, label]) => (
            <button key={key} style={tab === key ? primaryButton : buttonStyle} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </nav>

        {error && (
          <p
            style={{
              margin: "0 0 14px",
              padding: "10px 12px",
              border: "1px solid rgba(255, 102, 125, 0.35)",
              borderRadius: 8,
              color: "var(--danger)",
              background: "rgba(255, 102, 125, 0.08)"
            }}
          >
            {error}
          </p>
        )}

        {tab === "overview" && stats && (
          <Overview stats={stats} maxSignups={maxSignups} onRefresh={loadStats} />
        )}

        {tab === "users" && (
          <UsersTab
            users={users}
            total={userTotal}
            page={userPage}
            search={userSearch}
            setSearch={setUserSearch}
            onSearch={() => loadUsers(0, userSearch)}
            onPage={(page) => loadUsers(page, userSearch)}
            onAdjustBalance={async (user, delta) => {
              const payload = await api("/api/admin/users", {
                method: "PATCH",
                body: JSON.stringify({ id: user.id, balanceDelta: delta })
              });
              setUsers((prev) =>
                prev.map((item) =>
                  item.id === user.id ? { ...item, ...payload.user, metrics: item.metrics } : item
                )
              );
            }}
            onToggleAdmin={async (user) => {
              const payload = await api("/api/admin/users", {
                method: "PATCH",
                body: JSON.stringify({ id: user.id, isAdmin: !user.is_admin })
              });
              setUsers((prev) =>
                prev.map((item) =>
                  item.id === user.id ? { ...item, ...payload.user, metrics: item.metrics } : item
                )
              );
            }}
          />
        )}

        {tab === "characters" && (
          <CharactersTab
            characters={characters}
            total={characterTotal}
            page={characterPage}
            search={characterSearch}
            setSearch={setCharacterSearch}
            onSearch={() => loadCharacters(0, characterSearch)}
            onPage={(page) => loadCharacters(page, characterSearch)}
          />
        )}

        {tab === "works" && (
          <WorksTab
            works={works}
            total={workTotal}
            page={workPage}
            onPage={loadWorks}
            onToggleVisibility={async (work) => {
              const visibility = work.visibility === "public" ? "private" : "public";
              await api("/api/admin/works", {
                method: "PATCH",
                body: JSON.stringify({ id: work.id, visibility })
              });
              setWorks((prev) => prev.map((item) => (item.id === work.id ? { ...item, visibility } : item)));
            }}
            onDelete={async (work) => {
              if (!window.confirm(`确认删除「${work.title}」？不可恢复。`)) return;
              await api(`/api/admin/works?id=${work.id}`, { method: "DELETE" });
              setWorks((prev) => prev.filter((item) => item.id !== work.id));
            }}
          />
        )}
      </div>
    </main>
  );
}

function Overview({ stats, maxSignups, onRefresh }: { stats: Stats; maxSignups: number; onRefresh: () => void }) {
  const jobSuccessRate = stats.jobs ? Math.round((stats.completedJobs / stats.jobs) * 100) : 0;
  const metrics = [
    ["注册用户", stats.users, "用户池规模"],
    ["AI 女友", stats.characters, `${stats.publicCharacters} 公开 / ${stats.privateCharacters} 私密`],
    ["聊天会话", stats.chatSessions, `${stats.chatMessages} 条消息`],
    ["创作总数", stats.works, `${stats.publicWorks} 公开 / ${stats.privateWorks} 私密`],
    ["生成任务", stats.jobs, `${jobSuccessRate}% 完成率`],
    ["钻石消耗", stats.diamondsSpent, `发放 ${numberLabel(stats.diamondsGranted)}`],
    ["点赞总数", stats.likes, "首页互动"],
    ["ARPPU", stats.arppu, "按钻石发放估算"]
  ] as const;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>核心数据</h2>
          <p style={{ ...muted, margin: "4px 0 0" }}>用户、聊天、创作、钻石都放在一个视图里看。</p>
        </div>
        <button style={buttonStyle} onClick={onRefresh}>
          刷新
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {metrics.map(([label, value, note]) => (
          <div key={label} style={{ ...sectionCard, display: "grid", gap: 8 }}>
            <div style={muted}>{label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{numberLabel(value)}</div>
            <div style={{ ...muted, color: "#d5d2da" }}>{note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(320px, 0.75fr)", gap: 14 }}>
        <div style={sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>近 14 天注册</h3>
              <p style={{ ...muted, margin: "4px 0 0" }}>观察投放、自然流量和活动带来的新增变化。</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 170 }}>
            {stats.signupsByDay.map((day) => (
              <div key={day.date} style={{ flex: 1, textAlign: "center" }} title={`${day.date}: ${day.count}`}>
                <div
                  style={{
                    height: Math.max(5, (day.count / maxSignups) * 135),
                    background: "linear-gradient(180deg, var(--pink-2), var(--pink))",
                    borderRadius: 6
                  }}
                />
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}>{day.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={sectionCard}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>生成任务状态</h3>
            {[
              ["进行中", stats.runningJobs, "blue"],
              ["已完成", stats.completedJobs, "green"],
              ["失败", stats.failedJobs, "pink"]
            ].map(([label, value, tone]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginTop: 10 }}>
                <span style={muted}>{label}</span>
                <span style={badge(String(value), tone as "blue" | "green" | "pink")}>{numberLabel(Number(value))}</span>
              </div>
            ))}
          </div>
          <div style={sectionCard}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>最近钻石流水</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {stats.recentTransactions.length === 0 && <span style={muted}>暂无记录</span>}
              {stats.recentTransactions.map((tx, index) => (
                <div key={`${tx.created_at}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {profileName(tx.profiles)}
                    </div>
                    <div style={muted}>{tx.reason}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: tx.amount >= 0 ? "var(--teal)" : "var(--danger)", fontWeight: 800 }}>
                      {tx.amount >= 0 ? "+" : ""}
                      {tx.amount}
                    </div>
                    <div style={muted}>{formatDate(tx.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={sectionCard}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>最近创作</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {stats.recentWorks.length === 0 && <span style={muted}>暂无记录</span>}
          {stats.recentWorks.map((work) => (
            <div
              key={work.id}
              style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12 }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{work.title}</div>
                <div style={muted}>{profileName(work.profiles)}</div>
              </div>
              <span style={badge(work.mode === "video" ? "视频" : "图片", work.mode === "video" ? "pink" : "blue")}>
                {work.mode === "video" ? "视频" : "图片"}
              </span>
              <span style={{ ...muted, textAlign: "right" }}>{formatDate(work.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab({
  users,
  total,
  page,
  search,
  setSearch,
  onSearch,
  onPage,
  onAdjustBalance,
  onToggleAdmin
}: {
  users: AdminUser[];
  total: number;
  page: number;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onPage: (page: number) => void;
  onAdjustBalance: (user: AdminUser, delta: number) => Promise<void>;
  onToggleAdmin: (user: AdminUser) => Promise<void>;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Toolbar
        title="用户统计"
        note="看每个用户的钻石、聊天、创作和女友数量。"
        value={search}
        placeholder="搜索邮箱或昵称"
        setValue={setSearch}
        onSearch={onSearch}
      />
      <div style={{ ...card, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
          <thead>
            <tr>
              <th style={thStyle}>用户</th>
              <th style={thStyle}>余额</th>
              <th style={thStyle}>女友</th>
              <th style={thStyle}>聊天</th>
              <th style={thStyle}>创作</th>
              <th style={thStyle}>消耗/发放</th>
              <th style={thStyle}>注册</th>
              <th style={thStyle}>权限</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 800 }}>{user.display_name || "未命名用户"}</div>
                  <div style={muted}>{user.email || user.id}</div>
                </td>
                <td style={tdStyle}>{numberLabel(user.diamond_balance)}</td>
                <td style={tdStyle}>{numberLabel(user.metrics.characters)}</td>
                <td style={tdStyle}>{numberLabel(user.metrics.chats)}</td>
                <td style={tdStyle}>{numberLabel(user.metrics.works)}</td>
                <td style={tdStyle}>
                  <span style={{ color: "var(--danger)" }}>{numberLabel(user.metrics.spent)}</span>
                  <span style={muted}> / </span>
                  <span style={{ color: "var(--teal)" }}>{numberLabel(user.metrics.granted)}</span>
                </td>
                <td style={tdStyle}>{formatDate(user.created_at)}</td>
                <td style={tdStyle}>
                  <span style={badge(user.is_admin ? "管理员" : "用户", user.is_admin ? "gold" : "muted")}>
                    {user.is_admin ? "管理员" : "用户"}
                  </span>
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  <button
                    style={{ ...buttonStyle, marginRight: 6 }}
                    onClick={async () => {
                      const value = window.prompt("调整余额（正数加，负数减）", "100");
                      if (!value) return;
                      const delta = Number(value);
                      if (!Number.isFinite(delta) || delta === 0) return;
                      await onAdjustBalance(user, delta);
                    }}
                  >
                    调余额
                  </button>
                  <button style={buttonStyle} onClick={() => onToggleAdmin(user)}>
                    {user.is_admin ? "取消管理员" : "设为管理员"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} total={total} onChange={onPage} />
    </div>
  );
}

function CharactersTab({
  characters,
  total,
  page,
  search,
  setSearch,
  onSearch,
  onPage
}: {
  characters: AdminCharacter[];
  total: number;
  page: number;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onPage: (page: number) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Toolbar
        title="女友资产"
        note="查看用户创建或使用的 AI 女友形象，以及它们带来的聊天和创作。"
        value={search}
        placeholder="搜索女友名或标签"
        setValue={setSearch}
        onSearch={onSearch}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {characters.map((character) => (
          <div key={character.id} style={{ ...sectionCard, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  background: character.image_url
                    ? `url(${character.image_url}) center/cover`
                    : "linear-gradient(135deg, var(--pink), var(--teal))",
                  flex: "0 0 auto"
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {character.name}
                </div>
                <div style={muted}>
                  {character.tag || "未设置标签"}
                  {character.age ? ` · ${character.age} 岁` : ""}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={badge(character.is_public ? "公开" : "私密", character.is_public ? "green" : "muted")}>
                    {character.is_public ? "公开" : "私密"}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <MiniStat label="聊天" value={character.metrics.chats} />
              <MiniStat label="创作" value={character.metrics.works} />
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <span style={muted}>所属用户</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profileName(character.profiles)}
              </span>
            </div>
            <div style={muted}>创建于 {formatDate(character.created_at)}</div>
          </div>
        ))}
      </div>
      {characters.length === 0 && <EmptyState label="暂无女友数据" />}
      <Pager page={page} total={total} onChange={onPage} />
    </div>
  );
}

function WorksTab({
  works,
  total,
  page,
  onPage,
  onToggleVisibility,
  onDelete
}: {
  works: AdminWork[];
  total: number;
  page: number;
  onPage: (page: number) => void;
  onToggleVisibility: (work: AdminWork) => Promise<void>;
  onDelete: (work: AdminWork) => Promise<void>;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={sectionCard}>
        <h2 style={{ margin: 0, fontSize: 18 }}>创作记录</h2>
        <p style={{ ...muted, margin: "4px 0 0" }}>管理首页展示内容，可对作品进行上架、下架和删除。</p>
      </div>
      <div style={{ ...card, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
          <thead>
            <tr>
              <th style={thStyle}>标题</th>
              <th style={thStyle}>作者</th>
              <th style={thStyle}>类型</th>
              <th style={thStyle}>消耗</th>
              <th style={thStyle}>点赞</th>
              <th style={thStyle}>可见性</th>
              <th style={thStyle}>创建时间</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id}>
                <td style={tdStyle}>{work.title}</td>
                <td style={tdStyle}>{profileName(work.profiles)}</td>
                <td style={tdStyle}>
                  <span style={badge(work.mode === "video" ? "视频" : "图片", work.mode === "video" ? "pink" : "blue")}>
                    {work.mode === "video" ? "视频" : "图片"}
                  </span>
                </td>
                <td style={tdStyle}>{numberLabel(work.cost)}</td>
                <td style={tdStyle}>{numberLabel(work.likes_count)}</td>
                <td style={tdStyle}>
                  <span style={badge(work.visibility === "public" ? "公开" : "私密", work.visibility === "public" ? "green" : "muted")}>
                    {work.visibility === "public" ? "公开" : "私密"}
                  </span>
                </td>
                <td style={tdStyle}>{formatDate(work.created_at)}</td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  <button style={{ ...buttonStyle, marginRight: 6 }} onClick={() => onToggleVisibility(work)}>
                    {work.visibility === "public" ? "下架" : "上架"}
                  </button>
                  <button style={dangerButton} onClick={() => onDelete(work)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {works.length === 0 && <EmptyState label="暂无创作记录" />}
      <Pager page={page} total={total} onChange={onPage} />
    </div>
  );
}

function Toolbar({
  title,
  note,
  value,
  placeholder,
  setValue,
  onSearch
}: {
  title: string;
  note: string;
  value: string;
  placeholder: string;
  setValue: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <div
      style={{
        ...sectionCard,
        display: "grid",
        gridTemplateColumns: "1fr minmax(240px, 360px) auto",
        alignItems: "center",
        gap: 10
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
        <p style={{ ...muted, margin: "4px 0 0" }}>{note}</p>
      </div>
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && onSearch()}
      />
      <button style={primaryButton} onClick={onSearch}>
        搜索
      </button>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 10, background: "rgba(255,255,255,0.03)" }}>
      <div style={muted}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{numberLabel(value)}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ ...sectionCard, display: "grid", minHeight: 120, placeItems: "center", color: "var(--muted)" }}>
      {label}
    </div>
  );
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button style={buttonStyle} disabled={page <= 0} onClick={() => onChange(page - 1)}>
        上一页
      </button>
      <span style={{ color: "var(--muted)", fontSize: 13 }}>
        {page + 1} / {pages}（共 {total} 条）
      </span>
      <button style={buttonStyle} disabled={page >= pages - 1} onClick={() => onChange(page + 1)}>
        下一页
      </button>
    </div>
  );
}

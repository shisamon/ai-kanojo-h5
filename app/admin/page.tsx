"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";

const supabase =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null;

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
  signupsByDay: { date: string; count: number }[];
};

type AdminUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  diamond_balance: number;
  is_admin: boolean;
  locale: string;
  created_at: string;
};

type AdminWork = {
  id: string;
  title: string;
  mode: string;
  cost: number;
  visibility: string;
  likes_count: number;
  created_at: string;
  profiles: { email: string | null; display_name: string | null } | { email: string | null; display_name: string | null }[] | null;
};

const card: React.CSSProperties = {
  background: "var(--panel)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  padding: 16
};

const inputStyle: React.CSSProperties = {
  minHeight: 40,
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "var(--panel-2)",
  color: "var(--text)",
  padding: "0 12px"
};

const buttonStyle: React.CSSProperties = {
  minHeight: 36,
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
  fontWeight: 700
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  color: "var(--muted)",
  fontSize: 12,
  borderBottom: "1px solid var(--line)"
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid var(--line)",
  fontSize: 13
};

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"stats" | "users" | "works">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [search, setSearch] = useState("");
  const [works, setWorks] = useState<AdminWork[]>([]);
  const [workTotal, setWorkTotal] = useState(0);
  const [workPage, setWorkPage] = useState(0);
  const [error, setError] = useState("");
  const [notAdmin, setNotAdmin] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

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
    if (tab === "stats") loadStats();
    if (tab === "users") loadUsers(0, search);
    if (tab === "works") loadWorks(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, tab]);

  const maxSignups = useMemo(
    () => Math.max(1, ...(stats?.signupsByDay.map((d) => d.count) ?? [1])),
    [stats]
  );

  if (!supabase) {
    return <div style={{ padding: 40 }}>缺少 Supabase 环境变量。</div>;
  }

  if (!session) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ ...card, width: "min(380px, 100%)", display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>OpenLover 管理后台</h1>
          <input
            style={inputStyle}
            type="email"
            placeholder="管理员邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <p style={{ color: "var(--danger)", margin: 0, fontSize: 13 }}>{loginError}</p>}
          <button
            style={primaryButton}
            onClick={async () => {
              setLoginError("");
              const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
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
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ ...card, display: "grid", gap: 12, textAlign: "center" }}>
          <p style={{ margin: 0 }}>当前账号（{session.user.email}）不是管理员。</p>
          <button style={buttonStyle} onClick={() => supabase.auth.signOut().then(() => setNotAdmin(false))}>
            切换账号
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 80px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>OpenLover 管理后台</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{session.user.email}</span>
          <button style={buttonStyle} onClick={() => supabase.auth.signOut()}>
            退出
          </button>
        </div>
      </header>

      <nav style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(
          [
            ["stats", "数据概览"],
            ["users", "用户管理"],
            ["works", "作品管理"]
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            style={tab === key ? primaryButton : buttonStyle}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {tab === "stats" && stats && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {(
              [
                ["注册用户", stats.users],
                ["作品总数", stats.works],
                ["公开作品", stats.publicWorks],
                ["私密作品", stats.privateWorks],
                ["点赞总数", stats.likes],
                ["聊天会话", stats.chatSessions],
                ["聊天消息", stats.chatMessages],
                ["钻石消耗", stats.diamondsSpent],
                ["钻石发放", stats.diamondsGranted]
              ] as const
            ).map(([label, value]) => (
              <div key={label} style={card}>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10 }}>近 14 天注册</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
              {stats.signupsByDay.map((day) => (
                <div key={day.date} style={{ flex: 1, textAlign: "center" }} title={`${day.date}: ${day.count}`}>
                  <div
                    style={{
                      height: Math.max(4, (day.count / maxSignups) * 100),
                      background: "linear-gradient(180deg, var(--pink), var(--pink-2))",
                      borderRadius: 4
                    }}
                  />
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{day.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="搜索邮箱或昵称"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadUsers(0, search)}
            />
            <button style={primaryButton} onClick={() => loadUsers(0, search)}>
              搜索
            </button>
          </div>
          <div style={{ ...card, overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>邮箱</th>
                  <th style={thStyle}>昵称</th>
                  <th style={thStyle}>余额</th>
                  <th style={thStyle}>注册时间</th>
                  <th style={thStyle}>管理员</th>
                  <th style={thStyle}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.display_name}</td>
                    <td style={tdStyle}>{user.diamond_balance}</td>
                    <td style={tdStyle}>{new Date(user.created_at).toLocaleString()}</td>
                    <td style={tdStyle}>{user.is_admin ? "✓" : ""}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <button
                        style={{ ...buttonStyle, marginRight: 6 }}
                        onClick={async () => {
                          const value = window.prompt("调整余额（正数加，负数减）", "100");
                          if (!value) return;
                          const delta = Number(value);
                          if (!Number.isFinite(delta) || delta === 0) return;
                          try {
                            const payload = await api("/api/admin/users", {
                              method: "PATCH",
                              body: JSON.stringify({ id: user.id, balanceDelta: delta })
                            });
                            setUsers((prev) => prev.map((u) => (u.id === user.id ? payload.user : u)));
                          } catch (e) {
                            setError(e instanceof Error ? e.message : String(e));
                          }
                        }}
                      >
                        调余额
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={async () => {
                          try {
                            const payload = await api("/api/admin/users", {
                              method: "PATCH",
                              body: JSON.stringify({ id: user.id, isAdmin: !user.is_admin })
                            });
                            setUsers((prev) => prev.map((u) => (u.id === user.id ? payload.user : u)));
                          } catch (e) {
                            setError(e instanceof Error ? e.message : String(e));
                          }
                        }}
                      >
                        {user.is_admin ? "取消管理员" : "设为管理员"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={userPage} total={userTotal} onChange={(p) => loadUsers(p, search)} />
        </div>
      )}

      {tab === "works" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...card, overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                {works.map((work) => {
                  const author = Array.isArray(work.profiles) ? work.profiles[0] : work.profiles;
                  return (
                    <tr key={work.id}>
                      <td style={tdStyle}>{work.title}</td>
                      <td style={tdStyle}>{author?.display_name || author?.email || "-"}</td>
                      <td style={tdStyle}>{work.mode}</td>
                      <td style={tdStyle}>{work.cost}</td>
                      <td style={tdStyle}>{work.likes_count}</td>
                      <td style={tdStyle}>{work.visibility === "public" ? "公开" : "私密"}</td>
                      <td style={tdStyle}>{new Date(work.created_at).toLocaleString()}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                        <button
                          style={{ ...buttonStyle, marginRight: 6 }}
                          onClick={async () => {
                            const visibility = work.visibility === "public" ? "private" : "public";
                            try {
                              await api("/api/admin/works", {
                                method: "PATCH",
                                body: JSON.stringify({ id: work.id, visibility })
                              });
                              setWorks((prev) =>
                                prev.map((w) => (w.id === work.id ? { ...w, visibility } : w))
                              );
                            } catch (e) {
                              setError(e instanceof Error ? e.message : String(e));
                            }
                          }}
                        >
                          {work.visibility === "public" ? "下架" : "上架"}
                        </button>
                        <button
                          style={{ ...buttonStyle, color: "var(--danger)" }}
                          onClick={async () => {
                            if (!window.confirm(`确认删除「${work.title}」？不可恢复。`)) return;
                            try {
                              await api(`/api/admin/works?id=${work.id}`, { method: "DELETE" });
                              setWorks((prev) => prev.filter((w) => w.id !== work.id));
                            } catch (e) {
                              setError(e instanceof Error ? e.message : String(e));
                            }
                          }}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pager page={workPage} total={workTotal} onChange={loadWorks} />
        </div>
      )}
    </main>
  );
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const pageSize = 25;
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

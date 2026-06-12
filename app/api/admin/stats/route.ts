import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { service } = auth.ctx;

  const count = async (table: string, filter?: (q: any) => any) => {
    let query = service.from(table).select("*", { count: "exact", head: true });
    if (filter) query = filter(query);
    const { count: value } = await query;
    return value ?? 0;
  };

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [
    users,
    works,
    publicWorks,
    characters,
    publicCharacters,
    likes,
    chatSessions,
    chatMessages,
    jobs,
    completedJobs,
    failedJobs,
    runningJobs,
    transactions,
    recentProfiles,
    recentTransactions,
    recentWorks
  ] = await Promise.all([
      count("profiles"),
      count("works"),
      count("works", (q) => q.eq("visibility", "public")),
      count("characters"),
      count("characters", (q) => q.eq("is_public", true)),
      count("work_likes"),
      count("chat_sessions"),
      count("chat_messages"),
      count("creation_jobs"),
      count("creation_jobs", (q) => q.eq("status", "completed")),
      count("creation_jobs", (q) => q.eq("status", "failed")),
      count("creation_jobs", (q) => q.in("status", ["queued", "running"])),
      service.from("diamond_transactions").select("amount"),
      service.from("profiles").select("created_at").gte("created_at", since.toISOString()),
      service
        .from("diamond_transactions")
        .select("amount,reason,created_at,profiles!diamond_transactions_user_id_fkey(email,display_name)")
        .order("created_at", { ascending: false })
        .limit(8),
      service
        .from("works")
        .select("id,title,mode,cost,created_at,profiles!works_user_id_fkey(email,display_name)")
        .order("created_at", { ascending: false })
        .limit(8)
    ]);

  const amounts = (transactions.data ?? []).map((row) => row.amount as number);
  const diamondsSpent = amounts.filter((a) => a < 0).reduce((sum, a) => sum - a, 0);
  const diamondsGranted = amounts.filter((a) => a > 0).reduce((sum, a) => sum + a, 0);
  const paidTransactions = amounts.filter((a) => a > 0).length;
  const arppu = paidTransactions ? Math.round(diamondsGranted / paidTransactions) : 0;

  const signupsByDay: { date: string; count: number }[] = [];
  for (let i = 0; i < 14; i += 1) {
    const day = new Date(since);
    day.setDate(since.getDate() + i);
    signupsByDay.push({ date: day.toISOString().slice(0, 10), count: 0 });
  }
  (recentProfiles.data ?? []).forEach((row) => {
    const date = String(row.created_at).slice(0, 10);
    const bucket = signupsByDay.find((entry) => entry.date === date);
    if (bucket) bucket.count += 1;
  });

  return NextResponse.json({
    users,
    works,
    publicWorks,
    privateWorks: works - publicWorks,
    likes,
    chatSessions,
    chatMessages,
    diamondsSpent,
    diamondsGranted,
    arppu,
    characters,
    publicCharacters,
    privateCharacters: characters - publicCharacters,
    jobs,
    completedJobs,
    failedJobs,
    runningJobs,
    signupsByDay,
    recentTransactions: recentTransactions.data ?? [],
    recentWorks: recentWorks.data ?? []
  });
}

import { BarChart3 } from "lucide-react";

export interface ViewRow {
  path: string;
  referrer: string | null;
  created_at: string;
}

const DAY = 86_400_000;

function topN(rows: ViewRow[], key: (r: ViewRow) => string | null, n = 5) {
  const counts = new Map<string, number>();
  rows.forEach((r) => {
    const k = key(r);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

/** Last-14-days page views, top pages and referrers. Pure server-rendered markup (no chart library). */
export function AnalyticsCard({ rows, unavailable }: { rows: ViewRow[]; unavailable?: boolean }) {
  if (unavailable) {
    return (
      <div className="card-premium rounded-2xl p-5">
        <h2 className="mb-1 flex items-center gap-2 text-base font-extrabold text-gray-900 dark:text-white"><BarChart3 className="h-4 w-4" /> Visitors</h2>
        <p className="text-sm text-gray-500">Analytics isn&apos;t set up yet — run the latest <code className="rounded bg-gray-100 px-1 dark:bg-white/10">supabase/schema.sql</code> in the Supabase SQL Editor to create the <code className="rounded bg-gray-100 px-1 dark:bg-white/10">page_views</code> table.</p>
      </div>
    );
  }

  const now = Date.now();
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => {
    const start = startOfToday.getTime() - (13 - i) * DAY;
    const count = rows.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return t >= start && t < start + DAY;
    }).length;
    return { start, count };
  });
  const max = Math.max(1, ...days.map((d) => d.count));
  const total14 = days.reduce((s, d) => s + d.count, 0);
  const today = days[days.length - 1].count;
  const last30 = rows.filter((r) => now - new Date(r.created_at).getTime() < 30 * DAY).length;
  const pages = topN(rows, (r) => r.path);
  const refs = topN(rows, (r) => r.referrer);

  return (
    <div className="card-premium rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-gray-900 dark:text-white"><BarChart3 className="h-4 w-4 text-brand-500" /> Visitors</h2>
          <p className="text-xs text-gray-500">Page views, last 14 days — no cookies, no IP addresses stored</p>
        </div>
        <dl className="flex gap-6 text-right">
          <div><dd className="text-2xl font-extrabold text-gray-900 dark:text-white">{today}</dd><dt className="text-xs text-gray-500">Today</dt></div>
          <div><dd className="text-2xl font-extrabold text-gray-900 dark:text-white">{total14}</dd><dt className="text-xs text-gray-500">14 days</dt></div>
          <div><dd className="text-2xl font-extrabold text-gray-900 dark:text-white">{last30}</dd><dt className="text-xs text-gray-500">30 days</dt></div>
        </dl>
      </div>

      <div role="img" aria-label={`Daily page views for the last 14 days: ${days.map((d) => d.count).join(", ")}`} className="flex h-32 items-end gap-1.5">
        {days.map((d) => (
          <div key={d.start} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-accent-400 transition-opacity group-hover:opacity-80"
              style={{ height: `${Math.max(d.count === 0 ? 2 : 6, (d.count / max) * 100)}%`, opacity: d.count === 0 ? 0.25 : 1 }}
              title={`${new Date(d.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${d.count}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-gray-500">
        <span>{new Date(days[0].start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        <span>Today</span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {[{ title: "Top pages", data: pages }, { title: "Top referrers", data: refs }].map(({ title, data }) => (
          <div key={title}>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-gray-500">{title}</h3>
            {data.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <ul className="space-y-1.5">
                {data.map(([label, count]) => (
                  <li key={label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="font-mono text-xs text-gray-500">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

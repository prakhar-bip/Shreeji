import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { getVisitorAnalytics, type VisitorAnalytics } from "@/lib/visitor-analytics.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { business } from "@/data/business";

const title = `Visitor reports | ${business.name}`;
const description = "Private visitor, WhatsApp, and customer inquiry reports.";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { user } = Route.useRouteContext();
  const loadReports = useServerFn(getVisitorAnalytics);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [data, setData] = useState<VisitorAnalytics>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (user.email !== "prakharbatwal98@gmail.com") {
      setError("This dashboard is owner-only.");
      return;
    }
    void loadReports().then(setData).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Reports could not be loaded.");
    });
  }, [loadReports, user.email]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <section className="section bg-cream">
      <div className="container-page">
        <div className="flex items-start justify-between gap-4">
          <div><p className="eyebrow">Private dashboard</p><h1 className="mt-1 text-3xl md:text-4xl">Visitors & inquiries</h1></div>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>Sign out</Button>
        </div>
        {error ? <p className="mt-6 rounded-lg border border-destructive p-4 text-sm text-destructive">{error}</p> : null}
        {!data && !error ? <p className="mt-8 text-muted-foreground">Loading reports…</p> : null}
        {data ? <ReportContent data={data} /> : null}
      </div>
    </section>
  );
}

function ReportContent({ data }: { data: VisitorAnalytics }) {
  const stats = [
    ["Total visits", data.totalVisits], ["Unique visitors", data.uniqueVisitors],
    ["Product views", data.productViews], ["WhatsApp clicks", data.whatsappClicks],
    ["Visits today", data.todayVisits], ["Visitors today", data.todayUnique],
  ] as const;
  return (
    <div className="mt-7 space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-1 font-display text-3xl font-semibold">{value}</p></div>)}
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <h2 className="text-xl">Contact inquiries</h2>
        <div className="mt-3 divide-y divide-border">
          {data.inquiries.length ? data.inquiries.map((inquiry) => (
            <article key={inquiry.id} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-sans text-sm font-bold">{inquiry.name} · <a className="text-clay underline" href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></h3>
                <time className="text-xs text-muted-foreground">{new Date(inquiry.created_at).toLocaleString("en-IN")}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{inquiry.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">Alert: {inquiry.notification_status} · From {inquiry.source_page}</p>
            </article>
          )) : <p className="py-4 text-sm text-muted-foreground">No contact inquiries yet</p>}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <h2 className="text-xl">Recent WhatsApp clicks</h2>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[34rem] text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="pb-2">Time</th><th className="pb-2">Page</th><th className="pb-2">Button</th></tr></thead><tbody>{data.recentWhatsappClicks.length ? data.recentWhatsappClicks.map((row, index) => <tr key={`${row.created_at}-${index}`} className="border-b border-border/60"><td className="py-2">{new Date(row.created_at).toLocaleString("en-IN")}</td><td>{row.page}</td><td>{row.context}</td></tr>) : <tr><td className="py-3 text-muted-foreground" colSpan={3}>No WhatsApp clicks yet</td></tr>}</tbody></table></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ReportList title="Popular pages" rows={data.topPages.map((x) => [x.page, x.visits])} />
        <ReportList title="Traffic sources" rows={data.sources.map((x) => [x.source, x.visits])} />
        <ReportList title="Devices" rows={data.devices.map((x) => [x.device, x.visits])} />
      </div>
      <div className="rounded-lg border border-border bg-background p-4">
        <h2 className="text-xl">Last 30 days</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[30rem] text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="pb-2">Date</th><th className="pb-2">Visits</th><th className="pb-2">Visitors</th></tr></thead><tbody>{data.daily.map((row) => <tr key={row.day} className="border-b border-border/60"><td className="py-2">{row.day}</td><td>{row.visits}</td><td>{row.visitors}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}

function ReportList({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return <div className="rounded-lg border border-border bg-background p-4"><h2 className="text-xl">{title}</h2><ul className="mt-3 divide-y divide-border">{rows.length ? rows.map(([name, visits]) => <li key={name} className="flex justify-between gap-3 py-2 text-sm"><span className="truncate">{name}</span><strong>{visits}</strong></li>) : <li className="py-2 text-sm text-muted-foreground">No visits yet</li>}</ul></div>;
}
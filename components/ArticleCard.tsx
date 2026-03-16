import Link from "next/link";

interface ArticleCardProps {
  id: string;
  headline: string;
  summary: string;
  createdAt: string;
}

export default function ArticleCard({ id, headline, summary, createdAt }: ArticleCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-lg font-semibold">{headline}</h3>
      <p className="mt-2 text-sm text-slate-300">{summary}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <time>{new Date(createdAt).toLocaleString()}</time>
        <Link href={`/live?article=${id}`} className="text-brand-500 hover:text-brand-700">
          Watch Broadcast
        </Link>
      </div>
    </article>
  );
}

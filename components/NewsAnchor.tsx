interface NewsAnchorProps {
  videoUrl?: string;
}

export default function NewsAnchor({ videoUrl }: NewsAnchorProps) {
  if (!videoUrl) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">No live broadcast available.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <video src={videoUrl} controls className="h-full w-full" />
    </div>
  );
}

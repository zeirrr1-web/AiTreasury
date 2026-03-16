interface BreakingBannerProps {
  title: string;
  importanceScore: number;
}

const THRESHOLD = 80;

export default function BreakingBanner({ title, importanceScore }: BreakingBannerProps) {
  if (importanceScore <= THRESHOLD) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/15 p-4">
      <span className="mr-2 font-bold text-red-300">BREAKING</span>
      <span>{title}</span>
      <span className="ml-2 text-xs text-red-200">Score: {importanceScore}</span>
    </div>
  );
}

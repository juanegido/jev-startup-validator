import { IdeaAnalyzer } from "@/components/IdeaAnalyzer";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Startup Idea Validator
          </h1>
          <p className="hidden text-sm text-ink-2 sm:block">
            Eight judgments, one score, updated while you type.
          </p>
        </div>
        <p className="font-mono text-xs text-ink-3">
          jev · typesafe system one
        </p>
      </header>

      <IdeaAnalyzer />

      <footer className="flex flex-col gap-1 text-xs text-ink-3 sm:flex-row sm:justify-between">
        <p>
          Scores are calibrated probabilities over a fixed rubric, not advice.
          Weights are code, so the rubric is yours to change.
        </p>
        <p>Next.js · TypeSafe SDK</p>
      </footer>
    </main>
  );
}

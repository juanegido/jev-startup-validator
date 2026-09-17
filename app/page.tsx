import { IdeaAnalyzer } from "@/components/IdeaAnalyzer";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-24 pt-20 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="grid-overlay absolute inset-0" />
        <div className="animate-float absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="animate-float-slow absolute top-40 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="animate-float absolute top-[36rem] -right-40 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[140px] [animation-delay:-7s]" />
      </div>

      <header className="animate-fade-up mb-12 flex max-w-3xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Powered by Jev · TypeSafe System One
        </span>
        <h1 className="text-gradient text-5xl font-semibold tracking-tight sm:text-7xl">
          Validate your startup idea in half a second.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-400 sm:text-xl">
          Type it. Stop. Eight calibrated judgments light up before you finish
          your coffee: problem, market, differentiation, feasibility and more.
        </p>
      </header>

      <IdeaAnalyzer />

      <footer className="mt-20 flex flex-col items-center gap-2 text-sm text-neutral-600">
        <p>
          Scores are probabilities from a System One model, not advice. Weights
          live in code, so the rubric is yours to change.
        </p>
        <p>Built with Next.js and the TypeSafe SDK.</p>
      </footer>
    </main>
  );
}

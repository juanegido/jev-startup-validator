"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult, DimensionResult } from "@/lib/analyze";
import { WEAKNESS_HINTS, verdictFor } from "@/lib/hints";
import { DIMENSIONS } from "@/lib/rubric";
import { DimensionBar } from "./DimensionBar";
import { Gauge } from "./Gauge";

const DEBOUNCE_MS = 500;
const MIN_LENGTH = 12;
const MAX_LENGTH = 2000;
const NOT_AN_IDEA_THRESHOLD = 0.5;

const EXAMPLES = [
  "A marketplace where independent pharmacies in Spain pool purchasing to get wholesale prices, paying a monthly subscription per pharmacy.",
  "An AI copilot for restaurant owners that predicts tomorrow's ingredient orders from POS data, charging per location.",
  "A browser extension that summarizes any privacy policy into three risks before you click accept, free with a pro tier for teams.",
];

type Status = "idle" | "waiting" | "judging" | "done" | "error";

function pickExtremes(dimensions: DimensionResult[]) {
  const sorted = [...dimensions].sort((a, b) => b.value - a.value);
  return { strongest: sorted[0], weakest: sorted[sorted.length - 1] };
}

export function IdeaAnalyzer() {
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const trimmed = idea.trim();
    abortRef.current?.abort();

    if (trimmed.length < MIN_LENGTH) {
      setStatus("idle");
      setResult(null);
      setError(null);
      return;
    }

    setStatus("waiting");
    const timer = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("judging");
      setError(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: trimmed }),
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? `Request failed (${response.status})`);
        }
        setResult(payload as AnalysisResult);
        setStatus("done");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [idea]);

  const notAnIdea = result !== null && result.isIdea < NOT_AN_IDEA_THRESHOLD;
  const showScores = result !== null && !notAnIdea;
  const overall = showScores ? result.overall : null;
  const extremes = showScores ? pickExtremes(result.dimensions) : null;
  const verdict = overall !== null ? verdictFor(overall) : null;

  const statusLine = (() => {
    if (status === "judging") return { text: "Judging…", tone: "text-cyan-300" };
    if (status === "waiting")
      return { text: "Waiting for you to stop typing…", tone: "text-neutral-500" };
    if (status === "error")
      return { text: error ?? "Analysis failed", tone: "text-rose-300" };
    if (notAnIdea)
      return {
        text: "This doesn't read like a startup idea yet.",
        tone: "text-amber-300",
      };
    if (status === "done" && result)
      return {
        text: `Judged by ${result.model} in one request`,
        tone: "text-neutral-500",
      };
    return {
      text: `Judged ${DEBOUNCE_MS} ms after you stop typing`,
      tone: "text-neutral-500",
    };
  })();

  const half = Math.ceil(DIMENSIONS.length / 2);
  const columns = [DIMENSIONS.slice(0, half), DIMENSIONS.slice(half)];

  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <section className="glass animate-fade-up rounded-3xl p-6 sm:p-8">
        <label htmlFor="idea" className="sr-only">
          Describe your startup idea
        </label>
        <textarea
          ref={textareaRef}
          id="idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe your startup idea. Who is it for, what does it do, and why now?"
          rows={5}
          maxLength={MAX_LENGTH}
          spellCheck={false}
          className="w-full resize-none bg-transparent text-xl leading-relaxed text-neutral-50 outline-none placeholder:text-neutral-600 sm:text-2xl"
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
          <span className="flex items-center gap-2 text-neutral-500">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "judging"
                  ? "animate-pulse-dot bg-cyan-400"
                  : status === "done"
                    ? "bg-emerald-400"
                    : status === "error"
                      ? "bg-rose-400"
                      : "bg-neutral-600"
              }`}
            />
            <span className={statusLine.tone}>{statusLine.text}</span>
          </span>
          <span className="tabular-nums text-neutral-500">
            {idea.trim().length} / {MAX_LENGTH}
          </span>
        </div>
      </section>

      {idea.trim().length === 0 && (
        <div className="animate-fade-up flex flex-wrap gap-2 [animation-delay:120ms]">
          <span className="py-1.5 text-sm text-neutral-500">Try one:</span>
          {EXAMPLES.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setIdea(example);
                textareaRef.current?.focus();
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-neutral-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
            >
              {example.split(" ").slice(0, 6).join(" ")}…
            </button>
          ))}
        </div>
      )}

      <section className="glass animate-fade-up rounded-3xl p-6 [animation-delay:200ms] sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Gauge value={overall} />
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Startup potential
            </p>
            <h2
              className={`mt-2 text-3xl font-semibold tracking-tight ${
                verdict ? verdict.tone : "text-neutral-200"
              }`}
            >
              {verdict ? verdict.label : "Awaiting your idea"}
            </h2>
            {extremes && (
              <div className="mt-4 space-y-1.5 text-sm">
                <p className="text-neutral-300">
                  <span className="text-emerald-300">Strongest</span> ·{" "}
                  {extremes.strongest.label}
                </p>
                <p className="text-neutral-300">
                  <span className="text-rose-300">Weakest</span> ·{" "}
                  {extremes.weakest.label}
                </p>
                <p className="max-w-sm pt-1 text-neutral-500">
                  {WEAKNESS_HINTS[extremes.weakest.id]}
                </p>
              </div>
            )}
            {!extremes && (
              <p className="mt-3 max-w-sm text-sm text-neutral-500">
                Eight independent judgments, weighted into one score. Nothing is
                generated; every bar is a calibrated probability.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-5 md:grid-cols-2">
          {columns.map((column, index) => (
            <div key={index} className="flex flex-col gap-5">
              {column.map((dimension) => {
                const judged = result?.dimensions.find(
                  (d) => d.id === dimension.id,
                );
                const highlight =
                  extremes && judged
                    ? judged.id === extremes.weakest.id
                      ? "weak"
                      : judged.id === extremes.strongest.id
                        ? "strong"
                        : null
                    : null;
                return (
                  <DimensionBar
                    key={dimension.id}
                    label={dimension.label}
                    value={showScores && judged ? judged.value : null}
                    confidence={judged?.confidence}
                    highlight={highlight}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

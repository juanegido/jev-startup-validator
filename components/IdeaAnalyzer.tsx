"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/analyze";
import { AssessmentPanel } from "./AssessmentPanel";
import { IdeaPanel } from "./IdeaPanel";

const DEBOUNCE_MS = 500;
const MIN_LENGTH = 12;
const MAX_LENGTH = 2000;
const NOT_AN_IDEA_THRESHOLD = 0.5;

const EXAMPLE_IDEA =
  "A purchasing cooperative for independent pharmacies in Spain. Members pool orders through one platform to negotiate wholesale prices with distributors, and pay a flat monthly subscription per pharmacy.";

type Status = "idle" | "waiting" | "judging" | "done" | "error";

export function IdeaAnalyzer() {
  const [idea, setIdea] = useState(EXAMPLE_IDEA);
  const [isExample, setIsExample] = useState(true);
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

  const statusText = (() => {
    switch (status) {
      case "judging":
        return "Judging";
      case "waiting":
        return "Waiting for you to stop typing";
      case "error":
        return error ?? "Analysis failed";
      case "done":
        return result
          ? `Judged in one request · ${result.usage.inputTokens + result.usage.outputTokens} tokens`
          : "Judged";
      default:
        return idea.trim().length === 0
          ? "Start typing"
          : `Judged ${DEBOUNCE_MS} ms after you stop`;
    }
  })();

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[5fr_7fr] lg:items-start">
      <IdeaPanel
        idea={idea}
        isExample={isExample}
        status={status}
        statusText={statusText}
        maxLength={MAX_LENGTH}
        textareaRef={textareaRef}
        onChange={(value) => {
          setIdea(value);
          setIsExample(false);
        }}
        onClear={() => {
          setIdea("");
          setIsExample(false);
          textareaRef.current?.focus();
        }}
      />
      <AssessmentPanel
        result={result}
        notAnIdea={notAnIdea}
        judging={status === "judging"}
      />
    </div>
  );
}

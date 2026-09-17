"use client";

import type { RefObject } from "react";

type Status = "idle" | "waiting" | "judging" | "done" | "error";

interface IdeaPanelProps {
  idea: string;
  isExample: boolean;
  status: Status;
  statusText: string;
  maxLength: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function IdeaPanel({
  idea,
  isExample,
  status,
  statusText,
  maxLength,
  textareaRef,
  onChange,
  onClear,
}: IdeaPanelProps) {
  const dotTone =
    status === "judging"
      ? "bg-accent animate-pulse"
      : status === "done"
        ? "bg-accent"
        : status === "error"
          ? "bg-critical"
          : "bg-rule-strong";

  return (
    <section
      aria-labelledby="idea-heading"
      className="flex flex-col border border-rule bg-panel lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]"
    >
      <header className="flex items-center justify-between border-b border-rule px-5 py-3">
        <h2
          id="idea-heading"
          className="text-xs font-medium uppercase tracking-[0.14em] text-ink-2"
        >
          Idea
        </h2>
        <div className="flex items-center gap-3 text-xs">
          {isExample && (
            <span className="rounded-sm border border-rule px-1.5 py-0.5 font-mono text-ink-3">
              example
            </span>
          )}
          {idea.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-ink-2 underline-offset-2 hover:text-ink hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <label htmlFor="idea" className="sr-only">
        Describe your startup idea
      </label>
      <textarea
        ref={textareaRef}
        id="idea"
        value={idea}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Who is it for, what does it do, and why now?"
        maxLength={maxLength}
        spellCheck={false}
        className="min-h-56 flex-1 resize-none bg-transparent px-5 py-5 text-lg leading-relaxed text-ink outline-none placeholder:text-ink-3 lg:text-xl"
      />

      <footer className="flex items-center justify-between border-t border-rule px-5 py-3 text-xs">
        <span className="flex items-center gap-2 text-ink-2">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dotTone}`} />
          {statusText}
        </span>
        <span className="font-mono tabular-nums text-ink-3">
          {idea.trim().length}/{maxLength}
        </span>
      </footer>
    </section>
  );
}

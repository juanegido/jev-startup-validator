import { NextResponse } from "next/server";
import { analyzeIdea } from "@/lib/analyze";

const MIN_LENGTH = 12;
const MAX_LENGTH = 2000;

export async function POST(request: Request) {
  let body: { idea?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  if (idea.length < MIN_LENGTH) {
    return NextResponse.json(
      { error: `Idea must be at least ${MIN_LENGTH} characters` },
      { status: 400 },
    );
  }
  if (idea.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Idea must be at most ${MAX_LENGTH} characters` },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeIdea(idea);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("[analyze]", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

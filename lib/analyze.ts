import { TypeSafeClient, noul, score } from "@typesafe-ai/sdk";
import { DIMENSIONS, MAX_LEVEL, type DimensionId } from "./rubric";

export interface LevelProbability {
  level: number;
  description: string;
  probability: number;
}

export interface DimensionResult {
  id: DimensionId;
  label: string;
  /** Normalized 0-1 position on the rubric. */
  value: number;
  /** Raw probability-weighted level, 0-4. */
  score: number;
  confidence: number;
  weight: number;
  /** Full distribution over rubric levels, in level order. */
  levels: LevelProbability[];
}

export interface AnalysisResult {
  /** 0-100 weighted composite. */
  overall: number;
  /** Probability that the text is actually a startup idea. */
  isIdea: number;
  dimensions: DimensionResult[];
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

const client = new TypeSafeClient();

function buildQuestions() {
  const questions = {
    isIdea: noul(
      "Does `idea` describe a business, product, or service concept that someone intends to build, as opposed to unrelated text, a question, a complaint, or gibberish?",
    ),
  } as Record<string, ReturnType<typeof noul> | ReturnType<typeof score>>;

  for (const dimension of DIMENSIONS) {
    questions[dimension.id] = score(dimension.instructions, dimension.criteria);
  }

  return questions;
}

export async function analyzeIdea(idea: string): Promise<AnalysisResult> {
  const response = await client.systemOne({
    state: { idea },
    questions: buildQuestions(),
  });

  const isIdeaAnswer = response.answers.isIdea;
  if (isIdeaAnswer.type !== "noul") {
    throw new Error("Unexpected answer type for isIdea");
  }

  const dimensions: DimensionResult[] = DIMENSIONS.map((dimension) => {
    const answer = response.answers[dimension.id];
    if (answer.type !== "score") {
      throw new Error(`Unexpected answer type for ${dimension.id}`);
    }
    const probabilities = answer.probabilities as Record<string, number>;
    const levels: LevelProbability[] = dimension.criteria.map(
      (description, level) => ({
        level,
        description,
        probability: probabilities[String(level)] ?? 0,
      }),
    );
    return {
      id: dimension.id,
      label: dimension.label,
      score: answer.score,
      value: answer.score / MAX_LEVEL,
      confidence: answer.confidence,
      weight: dimension.weight,
      levels,
    };
  });

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.value * d.weight, 0) * 100,
  );

  return {
    overall,
    isIdea: isIdeaAnswer.noul,
    dimensions,
    model: response.model,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}

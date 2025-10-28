"use client";
import { Evaluation } from "@/lib/types/evaluation";
import { Separator } from "@/components/ui/separator";
import CreativityMetric from "./metrics/creativity-metric";
import SizeMetric from "./metrics/size-metric";
import MoodMetric from "./metrics/mood-metric";
import SemanticsMetric from "./metrics/semantics-metric";
import MetricChip from "./metric-chip";

export default function EvaluationMetrics({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const parseScore = (json: string | null): number | null => {
    if (!json) return null;
    try {
      const obj = JSON.parse(json);
      return typeof obj.score === "number" ? obj.score : null;
    } catch {
      return null;
    }
  };

  return (
    <>
      <Separator />
      <table className="w-full text-xs mb-2 border rounded-md">
        <tbody>
          {[
            { label: "Overall", score: evaluation.endScore },
            { label: "Confidence", score: evaluation.confidence },
            {
              label: "Creativity",
              score: parseScore(
                evaluation.creativity as unknown as string | null
              ),
            },
            {
              label: "Size",
              score: parseScore(evaluation.size as unknown as string | null),
            },
            {
              label: "Mood",
              score: parseScore(evaluation.mood as unknown as string | null),
            },
            {
              label: "Semantics",
              score: parseScore(
                evaluation.semantics as unknown as string | null
              ),
            },
            {
              label: "Evaluator",
              value: evaluation.evaluator,
            },
          ].map(({ label, score, value }) => (
            <tr key={label} className="odd:bg-muted/30">
              <td className="py-1 px-2 text-muted-foreground w-1/2">{label}</td>
              <td className="py-1 px-2">
                {score ? <MetricChip score={score} /> : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreativityMetric evaluation={evaluation} />
      <SizeMetric evaluation={evaluation} />
      <MoodMetric evaluation={evaluation} />
      <SemanticsMetric evaluation={evaluation} />
    </>
  );
}

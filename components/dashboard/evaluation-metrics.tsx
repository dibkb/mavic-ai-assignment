"use client";
import { Evaluation } from "@/lib/types/evaluation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { sourceCodePro } from "@/lib/fonts";

function MetricChip({ score }: { score: number | null }) {
  const color =
    score === null
      ? "bg-gray-300 text-gray-600"
      : score >= 75
        ? "bg-green-200 text-green-800"
        : score >= 50
          ? "bg-yellow-200 text-yellow-800"
          : "bg-red-200 text-red-800";
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", color)}>
      {score ?? "-"}
    </span>
  );
}

export default function EvaluationMetrics({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const metrics = [
    { key: "creativity", label: "Creativity" },
    { key: "size", label: "Size" },
    { key: "mood", label: "Mood" },
    { key: "semantics", label: "Semantics" },
  ];

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
      <table className="w-full text-xs">
        <caption className="text-xs font-medium text-muted-foreground text-center my-2">
          Evaluated by {evaluation.evaluator}
        </caption>
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-1">Metric</th>
            <th className="py-1">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1">Overall</td>
            <td className="py-1">
              <MetricChip score={evaluation.endScore} />
            </td>
          </tr>
          <tr>
            <td className="py-1">Confidence</td>
            <td className="py-1">
              <MetricChip score={evaluation.confidence} />
            </td>
          </tr>
          {metrics.map(({ key, label }) => (
            <tr key={key}>
              <td className="py-1">{label}</td>
              <td className="py-1">
                <MetricChip
                  score={parseScore(
                    evaluation[key as keyof Evaluation] as unknown as
                      | string
                      | null
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {metrics.map(({ key, label }) => {
        const json = evaluation[key as keyof Evaluation] as unknown as
          | string
          | null;
        if (!json) return null;

        let obj: Record<string, unknown>;
        try {
          obj = JSON.parse(json);
        } catch {
          return null;
        }

        const flatten = (
          o: Record<string, unknown>,
          prefix = ""
        ): [string, unknown][] =>
          Object.entries(o).flatMap(([k, v]) => {
            const path = prefix ? `${prefix}.${k}` : k;
            return typeof v === "object" && v !== null
              ? flatten(v as Record<string, unknown>, path)
              : [[path, v]];
          });

        const rows = flatten(obj);

        return (
          <div
            key={key}
            className={cn("mt-4 space-y-1", sourceCodePro.className)}
          >
            <p className="text-xs font-medium text-muted-foreground">
              {label} Details
            </p>
            <table className="w-full text-xs border rounded-md">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k} className="odd:bg-muted/30">
                    <td className="py-1 px-2 text-muted-foreground w-1/2 break-all">
                      {k}
                    </td>
                    <td className="py-1 px-2 break-all">{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

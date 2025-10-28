"use client";
import { Evaluation } from "@/lib/types/evaluation";
import { cn } from "@/lib/utils";
import { sourceCodePro } from "@/lib/fonts";
import {
  CreativityOutput,
  CreativityOutputSchema,
} from "@/lib/types/workflow/creativity";

export default function CreativityMetric({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const json = evaluation.creativity as unknown as string | null;
  if (!json) return null;
  let creativity: CreativityOutput;
  try {
    creativity = CreativityOutputSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
  const obj = {
    "Color Variance": creativity.factors.colorVariance,
    Entropy: creativity.factors.entropy,
    "Prompt Token Variety": creativity.factors.promptTokenVariety,
  };
  const rows = Object.entries(obj);

  return (
    <div className={cn("mt-4 space-y-1", sourceCodePro.className)}>
      <p className="text-xs font-medium text-muted-foreground">Creativity</p>
      <table className="w-full text-xs border rounded-md mt-1">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="odd:bg-muted/30">
              <td className="py-1 px-2 w-1/2 break-all text-muted-foreground">
                {k}
              </td>
              <td className="py-1 px-2 break-all">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";
import { Evaluation } from "@/lib/types/evaluation";
import { cn } from "@/lib/utils";
import { sourceCodePro } from "@/lib/fonts";
import { SizeOutput, SizeOutputSchema } from "@/lib/types/workflow/size";

export default function SizeMetric({ evaluation }: { evaluation: Evaluation }) {
  const json = evaluation.size as unknown as string | null;
  if (!json) return null;
  let size: SizeOutput;
  try {
    size = SizeOutputSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
  const obj = {
    Matches: size.matches,
    Details: size.details,
  };
  const rows = Object.entries(obj);
  return (
    <div className={cn("mt-4 space-y-1", sourceCodePro.className)}>
      <p className="text-xs font-medium text-muted-foreground">Size</p>
      <table className="w-full text-xs border rounded-md mt-1">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="odd:bg-muted/30">
              <td className="py-1 px-2 w-1/2 break-all text-muted-foreground">
                {k}
              </td>
              <td className="py-1 px-2 break-all">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

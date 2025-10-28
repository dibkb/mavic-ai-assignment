"use client";
import { Evaluation } from "@/lib/types/evaluation";
import { cn } from "@/lib/utils";
import { sourceCodePro } from "@/lib/fonts";
import { MoodOutput, MoodOutputSchema } from "@/lib/types/workflow/mood";

export default function MoodMetric({ evaluation }: { evaluation: Evaluation }) {
  const json = evaluation.mood as unknown as string | null;
  if (!json) return null;
  let mood: MoodOutput;
  try {
    mood = MoodOutputSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
  const obj = {
    "Mood Prompt": mood.moodPrompt.join(", "),
    "Mood Image": mood.moodImage.join(", "),
    "Match Score": mood.matchScore,
  };
  const rows = Object.entries(obj);
  return (
    <div className={cn("mt-4 space-y-1", sourceCodePro.className)}>
      <p className="text-xs font-medium text-muted-foreground">Mood</p>
      <table className="w-full text-xs border rounded-md mt-1">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="odd:bg-muted/30">
              <td className="py-1 px-2 w-1/2 break-all text-muted-foreground">
                {k}
              </td>
              <td className="py-1 px-2 break-all">
                {Array.isArray(v) ? v.join(", ") : String(v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

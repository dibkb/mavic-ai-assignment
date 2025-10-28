import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { EvalStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.authorized) return auth.response;

  try {
    const [pending, processing] = await Promise.all([
      prisma.evaluation.count({ where: { status: EvalStatus.pending } }),
      prisma.evaluation.count({ where: { status: EvalStatus.processing } }),
    ]);
    return NextResponse.json({ pending, processing });
  } catch (error) {
    console.error("Failed to count evaluations", error);
    return NextResponse.json({ error: "failed to count" }, { status: 500 });
  }
}

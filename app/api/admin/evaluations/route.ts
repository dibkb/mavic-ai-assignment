import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const evaluations = await prisma.evaluation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        endScore: true,
        confidence: true,
        creativity: true,
        size: true,
        mood: true,
        semantics: true,
        createdAt: true,
        image: {
          select: {
            imagePath: true,
            prompt: true,
            channel: true,
            model: true,
          },
        },
      },
    });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error("Failed to get evaluations", error);
    return NextResponse.json(
      { error: "failed to get evaluations" },
      { status: 500 }
    );
  }
}

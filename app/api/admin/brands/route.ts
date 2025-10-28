import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const brands = await prisma.brand.findMany({
      select: {
        brandName: true,
        brandDescription: true,
        style: true,
        brandVision: true,
        brandVoice: true,
        colors: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Failed to get brands", error);
    return NextResponse.json(
      { error: "failed to get brands" },
      { status: 500 }
    );
  }
}

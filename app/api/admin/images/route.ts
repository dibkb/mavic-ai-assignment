import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const images = await prisma.image.findMany({
      select: {
        id: true,
        imagePath: true,
        prompt: true,
        model: true,
        channel: true,
        timestamp: true,
        userId: true,
        brandId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { evaluations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const models = new Set(images.map((image) => image.model));
    const channels = new Set(images.map((image) => image.channel));

    return NextResponse.json({
      images,
      availableModels: Array.from(models),
      availableChannels: Array.from(channels),
    });
  } catch (error) {
    console.error("Failed to get images", error);
    return NextResponse.json(
      { error: "failed to get images" },
      { status: 500 }
    );
  }
}

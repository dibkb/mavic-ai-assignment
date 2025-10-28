import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      role: string;
    };
    if (payload.role !== "admin")
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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
}

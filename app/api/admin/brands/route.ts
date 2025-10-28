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
}

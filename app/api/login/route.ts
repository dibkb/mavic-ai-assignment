import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password)
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  const user = await prisma.user.findFirst({
    where: { userName: username, password: password, userRole: UserRole.admin },
  });

  console.log(user, username, password);

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const token = jwt.sign(
    { id: user.id, role: user.userRole },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
  return NextResponse.json({ token });
}

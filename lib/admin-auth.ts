import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthCheck =
  | { authorized: true }
  | { authorized: false; response: NextResponse };

export function requireAdmin(req: NextRequest): AuthCheck {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      role?: string;
    };
    if (payload.role !== "admin") {
      return {
        authorized: false,
        response: NextResponse.json({ error: "forbidden" }, { status: 403 }),
      };
    }
    return { authorized: true };
  } catch {
    return {
      authorized: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
}

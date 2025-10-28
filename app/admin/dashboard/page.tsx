"use client";
import { useAdmin } from "@/hooks/useAdmin";

export default function Dashboard() {
  useAdmin();
  return <div className="p-8">dashboard</div>;
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function AdminPage() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const username = fd.get("username") as string;
    const password = fd.get("password") as string;
    try {
      const res = await axios.post("/api/login", { username, password });
      document.cookie = `token=${res.data.token};path=/`;
      router.push("/admin/dashboard");
    } catch {
      toast.error("invalid credentials");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="username">username</Label>
          <Input id="username" name="username" />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        <Button type="submit" className="w-full">
          login
        </Button>
      </form>
    </div>
  );
}

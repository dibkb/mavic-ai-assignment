import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function AdminPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="w-full max-w-sm space-y-4">
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

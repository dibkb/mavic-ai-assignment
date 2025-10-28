import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export const useAdmin = () => {
  const router = useRouter();
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        router.push("/");
      }
    } catch {
      router.push("/");
    }
    ref.current = false;
  }, [router]);

  return { isAdmin: true };
};

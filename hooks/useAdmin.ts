import { useEffect } from "react";

export const useAdmin = () => {
  useEffect(() => {
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        window.location.href = "/";
      }
    } catch {
      window.location.href = "/";
    }
  }, []);

  return { isAdmin: true };
};

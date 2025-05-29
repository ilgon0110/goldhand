"use client";
import { useAuthStore } from "@/src/shared/store";
import { useEffect } from "react";

export const useAuthInit = () => {
  const { accessToken, setAccessToken, setHydrated } = useAuthStore();

  useEffect(() => {
    console.log("useAuthInit");
    const fetchToken = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://localhost:3000";

      try {
        const res = await fetch(`${apiUrl}/api/auth/header`, {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch token:", err);
        setAccessToken(null);
      } finally {
        setHydrated(true);
      }
    };

    fetchToken();
  }, [accessToken]);
};

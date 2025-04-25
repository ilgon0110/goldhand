"use client";
import { useAuthStore } from "@/src/shared/store";
import { useEffect } from "react";

export const useAuthInit = () => {
  const { accessToken, setAccessToken, setHydrated } = useAuthStore();

  useEffect(() => {
    console.log("useAuthInit");
    const fetchToken = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/auth/header", {
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

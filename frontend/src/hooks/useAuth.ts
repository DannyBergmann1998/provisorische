"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SessionUser } from "@/types";

async function fetchCurrentUser(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch user");
  const json = await res.json();
  return json.data ?? null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<SessionUser | null>({
    queryKey: ["current-user"],
    queryFn:  fetchCurrentUser,
    retry:    false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      queryClient.setQueryData(["current-user"], null);
      queryClient.clear();
    }
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  return {
    user:      user ?? null,
    isLoading,
    isError:   !!error,
    isAdmin:   user?.role === "ADMIN" || user?.role === "SUPERADMIN",
    logout,
    invalidate,
  };
}

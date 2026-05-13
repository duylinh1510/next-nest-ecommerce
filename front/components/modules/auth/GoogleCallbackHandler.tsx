"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/store/slices/authSlice";
import type { User } from "@/types/auth.types";

type Props = {
  accessToken?: string;
  refreshToken?: string;
  user?: unknown;
};

function isUser(u: unknown): u is User {
  if (!u || typeof u !== "object") return false;
  const o = u as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.email === "string";
}

export default function GoogleCallbackHandler({
  accessToken,
  refreshToken,
  user,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!accessToken || !refreshToken || !isUser(user)) return;

    handled.current = true;
    dispatch(
      setAuth({
        accessToken,
        refreshToken,
        user,
      }),
    );
    router.replace("/");
  }, [accessToken, refreshToken, user, dispatch, router]);

  return null;
}

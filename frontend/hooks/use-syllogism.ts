"use client";

import { useCallback, useState } from "react";

import {
  postSyllogism,
  type SyllogismPayload,
  type SyllogismResponse,
} from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

type UseSyllogism = {
  status: Status;
  loading: boolean;
  error: string | null;
  result: SyllogismResponse | null;
  analyze: (payload: SyllogismPayload) => Promise<void>;
  reset: () => void;
};

/**
 * Wraps the single `POST /syllogism` call with loading / error / result state.
 * This is the one place the Analyzer talks to the backend.
 */
export function useSyllogism(): UseSyllogism {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyllogismResponse | null>(null);

  const analyze = useCallback(async (payload: SyllogismPayload) => {
    setStatus("loading");
    setError(null);

    try {
      const response = await postSyllogism(payload);
      setResult(response);
      setStatus("success");
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error ? err.message : "Unexpected analysis failure."
      );
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
  }, []);

  return {
    status,
    loading: status === "loading",
    error,
    result,
    analyze,
    reset,
  };
}

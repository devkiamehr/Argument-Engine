"use client";

import { useCallback, useState } from "react";

import {
  createSyllogism,
  type Syllogism,
  type SyllogismPayload,
} from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

type UseSyllogism = {
  status: Status;
  loading: boolean;
  error: string | null;
  result: Syllogism | null;
  analyze: (payload: SyllogismPayload) => Promise<void>;
  reset: () => void;
};

/**
 * Wraps `POST /syllogism` with loading / error / result state. On success the
 * backend has both analyzed and persisted the syllogism to the user's history,
 * returning the saved record.
 */
export function useSyllogism(): UseSyllogism {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Syllogism | null>(null);

  const analyze = useCallback(async (payload: SyllogismPayload) => {
    setStatus("loading");
    setError(null);

    try {
      const syllogism = await createSyllogism(payload);
      setResult(syllogism);
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

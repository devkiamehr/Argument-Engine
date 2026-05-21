const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type SyllogismPayload = {
    lineOne: string;
    lineTwo: string;
};

export type Figure = 1 | 2 | 3 | 4;

/*
 * The backend currently returns only `conclusion`. The engine also computes
 * mood / figure / validity internally, but `POST /syllogism` does not expose
 * them yet. They are typed here as optional so that:
 *   1. the result panel can show them as "beta" placeholders today, and
 *   2. wiring them live later is a single-spot change (just have the backend
 *      include them and they flow straight through `postSyllogism`).
 */
export type SyllogismResponse = {
    conclusion: string;
    mood?: string; // e.g. "AA-1"
    figure?: Figure;
    valid?: boolean;
    subject?: string;
    predicate?: string;
    singular?: boolean;
};

/*
 * Shape of a persisted analysis for the future accounts DB. Used only to type
 * the History / Dashboard placeholder + empty states for now — nothing is
 * actually stored yet (UI shells).
 */
export type SavedSyllogism = {
    id: string;
    lineOne: string;
    lineTwo: string;
    conclusion: string;
    valid: boolean;
    mood?: string;
    figure?: Figure;
    createdAt: string; // ISO timestamp
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const isFigure = (value: unknown): value is Figure =>
    value === 1 || value === 2 || value === 3 || value === 4;

export const postSyllogism = async (payload: SyllogismPayload): Promise<SyllogismResponse> => {
    const res = await fetch(`${API_BASE_URL}/syllogism`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    const data: unknown = await res.json();

    if (!res.ok) {
        const message = isRecord(data) && typeof data.error === "string"
            ? data.error
            : "Unexpected analysis failure.";

        throw new Error(message);
    }

    if (!isRecord(data) || typeof data.conclusion !== "string") {
        throw new Error("Unexpected response from server.");
    }

    // Forward-compatible: pick up the extra engine fields if/when the backend
    // starts returning them. Today these stay undefined.
    const result: SyllogismResponse = { conclusion: data.conclusion };

    if (typeof data.mood === "string") result.mood = data.mood;
    if (isFigure(data.figure)) result.figure = data.figure;
    if (typeof data.valid === "boolean") result.valid = data.valid;
    if (typeof data.subject === "string") result.subject = data.subject;
    if (typeof data.predicate === "string") result.predicate = data.predicate;
    if (typeof data.singular === "boolean") result.singular = data.singular;

    return result;
}

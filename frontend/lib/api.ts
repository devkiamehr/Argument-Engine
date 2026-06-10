const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
};

// Mirrors the Prisma `Syllogism` record. The engine now populates mood
// (e.g. "AA-1") and figure (e.g. "1").
export type Syllogism = {
    id: string;
    lineOne: string;
    lineTwo: string;
    conclusion: string;
    mood: string | null;
    figure: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
};

export type SyllogismPayload = {
    lineOne: string;
    lineTwo: string;
};

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
};

async function request<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_BASE_URL}${path}`, {
            method,
            credentials: "include",
            headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        // Network error / backend unreachable.
        throw new ApiError("Could not reach the server. Is the backend running?", 0);
    }

    const text = await res.text();
    let data: unknown = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (!res.ok) {
        const message =
            isRecord(data) && typeof data.error === "string"
                ? data.error
                : `Request failed (${res.status}).`;
        throw new ApiError(message, res.status);
    }

    return data as T;
}

// The backend's user payloads can include extra fields (e.g. a plaintext
// `password` echo on register/login); keep only what the UI needs.
function pickUser(raw: unknown): User {
    if (!isRecord(raw)) {
        throw new ApiError("Unexpected user response from server.", 0);
    }
    return {
        id: String(raw.id),
        email: String(raw.email),
        name: String(raw.name),
        createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
        updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
    };
}

/* ---------------------------------- auth --------------------------------- */

export async function register(input: {
    email: string;
    name: string;
    password: string;
}): Promise<User> {
    const data = await request<{ user: unknown }>("/user/register", {
        method: "POST",
        body: input,
    });
    return pickUser(data.user);
}

export async function login(input: { email: string; password: string }): Promise<User> {
    const data = await request<{ user: unknown }>("/user/login", {
        method: "POST",
        body: input,
    });
    return pickUser(data.user);
}

export async function logout(): Promise<void> {
    await request("/user/logout", { method: "POST" });
}

export async function getMe(): Promise<User> {
    const data = await request<{ user: unknown }>("/user/me");
    return pickUser(data.user);
}

export async function updateAccount(input: {
    email?: string;
    name?: string;
    password?: string;
}): Promise<User> {
    const data = await request<{ user: unknown }>("/user", {
        method: "PUT",
        body: input,
    });
    return pickUser(data.user);
}

export async function deleteAccount(password: string): Promise<void> {
    await request("/user", { method: "DELETE", body: { password } });
}

/* ------------------------------- syllogisms ------------------------------ */

export async function createSyllogism(payload: SyllogismPayload): Promise<Syllogism> {
    const data = await request<{ syllogism: Syllogism }>("/syllogism", {
        method: "POST",
        body: payload,
    });
    return data.syllogism;
}

export async function listSyllogisms(): Promise<Syllogism[]> {
    const data = await request<{ syllogisms: Syllogism[] }>("/syllogism");
    return data.syllogisms;
}

export async function getSyllogism(id: string): Promise<Syllogism> {
    const data = await request<{ syllogism: Syllogism }>(
        `/syllogism/${encodeURIComponent(id)}`
    );
    return data.syllogism;
}

export async function deleteSyllogism(id: string): Promise<void> {
    await request(`/syllogism/${encodeURIComponent(id)}`, { method: "DELETE" });
}

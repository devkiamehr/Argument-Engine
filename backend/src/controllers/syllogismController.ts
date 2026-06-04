import { type lines } from "../types.js";
import { engine } from "../engine.js";

export const postSyllogism = (data: lines) => {
    try {
        const result = engine(data);

        return { conclusion: result }
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unexpected analysis failure.";
        return { error: message }
    }
}

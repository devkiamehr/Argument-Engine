import type { lines, proposition, quantity, syllogismResolution } from "./types.js";
import { conclusionTypeByMood, qualityTextByState, fullMoodByPartialMood } from "./engine/constants.js";
import { parsePremise } from "./engine/parse-premise.js";
import { resolveSyllogism } from "./engine/resolve-syllogism.js";
import { tokenizePremise } from "./engine/normalize-text.js";

export const engine = (data: lines) => {
    const { lineOne, lineTwo } = data;
    const premiseOne = parseEnginePremise(lineOne, "Line one");
    const premiseTwo = parseEnginePremise(lineTwo, "Line two");
    const resolution = resolveSyllogism(premiseOne, premiseTwo);

    const result = renderConclusion(resolution);
    return result;
}

const parseEnginePremise = (line: string, lineLabel: string): proposition => {
    const premiseTokens = tokenizePremise(line);

    try {
        return parsePremise(premiseTokens);
    } catch(e) {
        const detail = e instanceof Error
            ? e.message
            : "Unexpected parsing failure.";

        throw new Error(`${lineLabel} failed to parse: ${detail}`)
    }
}

const renderConclusion = ({ mood, figure, subject, predicate, singular }: syllogismResolution) => {
    const concPropType = conclusionTypeByMood[mood];
    if (!concPropType) {
        throw new Error("Something went wrong.");
    }

    const [quantity, quality] = concPropType.split('-') as [quantity, "true" | "false"];

    const qualityText = qualityTextByState[`${quality}-${singular}`];

    const fullMood = fullMoodByPartialMood[mood]!;

    if (singular === true) {
        const conclusion = `${subject} ${qualityText} ${predicate}`;
        return { conclusion, figure, mood: fullMood };
    }

    const conclusion = `${quantity} ${subject} ${qualityText} ${predicate}`;
    return { conclusion, figure, mood: fullMood };
}

import { NounInflector } from "natural/lib/natural/inflectors/index.js";

const inflector = new NounInflector();

export const cleanWord = (word: string): string => {
    return word
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:]/g, "");
};

export const normalizeComparisonWord = (word: string): string => {
    const cleaned = cleanWord(word).replace(/men$/, "man");
    if (/[td]es$/.test(cleaned)) {
        return cleaned;
    }

    return inflector.singularize(cleaned);
};

export const tokenizePremise = (premise: string): string[] => {
    return premise
        .split(/\s+/)
        .map(cleanWord)
        .filter(word => word.length > 0);
};

export const normalizeComparisonTerm = (term: string): string => {
    return term
        .split(/\s+/)
        .map(normalizeComparisonWord)
        .filter(word => word.length > 0)
        .join(" ");
};

export const singularizeTermForOutput = (term: string): string => {
    return term
        .split(/\s+/)
        .map(word => inflector.singularize(word))
        .join(" ");
};

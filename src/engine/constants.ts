import type { figure, figureOrder, mood, propType, propositionKey, qualityText, qualityTextTypes, quantity } from "../types.js";

export const propositionTypeByKey: Record<propositionKey, propType> = {
    "all-true": "A",
    "no-true": "E",
    "some-true": "I",
    "some-false": "O",
    "all-false": "E",
    "no-false": "A",
    "singular-true": "A",
    "singular-false": "E"
};

export const quantityByKeyword: Record<string, quantity> = {
    "all": "all",
    "every": "all",
    "each": "all",
    "no": "no",
    "none": "no",
    "some": "some",
    "few": "some",
    "least": "some"
};

export const figureByOrder: Record<figureOrder, figure> = {
    "m-p,s-m": 1,
    "p-m,s-m": 2,
    "m-p,m-s": 3,
    "p-m,m-s": 4
};

export const validMoods: mood[] = [
    "AA-1", "AA-3", "AA-4",
    "EA-1", "EA-2", "EA-3", "EA-4",
    "AI-1", "AI-3",
    "EI-1", "EI-2", "EI-3", "EI-4",
    "AE-2", "AE-4",
    "AO-2",
    "IA-3", "IA-4",
    "OA-3"
];

export const conclusionTypeByMood: Partial<Record<mood, propositionKey>> = {
    "AA-1": "all-true",
    "AA-3": "some-true",
    "AA-4": "some-true",

    "EA-1": "no-false",
    "EA-2": "no-false",
    "EA-3": "some-false",
    "EA-4": "some-false",

    "AI-1": "some-true",
    "AI-3": "some-true",

    "EI-1": "some-false",
    "EI-2": "some-false",
    "EI-3": "some-false",
    "EI-4": "some-false",

    "AE-2": "no-false",
    "AE-4": "no-false",

    "AO-2": "some-false",

    "IA-3": "some-true",
    "IA-4": "some-true",

    "OA-3": "some-false"
};

export const qualityTextByState: Record<qualityText, qualityTextTypes> = {
    "true-true": "is",
    "true-false": "are",
    "false-true": "is not",
    "false-false": "are not"
};

export const affirmativeQualityTerms = ["is", "are"];
export const negativeAddOn = "not";
export const dissentingQualityTerms = ["isnt", "arent"];
export const qualityTerms = ["is", "are", "isnt", "arent"];
export const ignoredWords = new Set(["a", "an", "the", "of", "single"]);
export const quantityTerms = ["all", "every", "each", "no", "none", "some", "few", "least"];

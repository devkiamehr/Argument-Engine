import type { lines, proposition, propType, propositionKey, quantity, quality, termOrder, figureOrder, figure, mood, qualityText, qualityTextTypes } from "./types.js";
import { NounInflector } from "natural/lib/natural/inflectors/index.js";

const inflector = new NounInflector();

const propositionType: Record<propositionKey, propType> = {
    "all-true": "A",
    "no-true": "E",
    "some-true": "I",
    "some-false": "O",
    "all-false": "E",
    "no-false": "A",
    "singular-true": "A",
    "singular-false": "E"
}

const quantityPatternKey: Record<string, quantity> = {
    "all": "all",
    "every": "all",
    "each": "all",
    "no": "no",
    "none": "no",
    "some": "some",
    "few": "some",
    "least": "some"
}

const figureKey: Record<figureOrder, figure> = {
    "m-p,s-m": 1,
    "p-m,s-m": 2,
    "m-p,m-s": 3,
    "p-m,m-s": 4
}

const validMoods: mood[] = [
    "AA-1", "AA-3", "AA-4",
    "EA-1", "EA-2", "EA-3", "EA-4",
    "AI-1", "AI-3",
    "EI-1", "EI-2", "EI-3", "EI-4",
    "AE-2", "AE-4",
    "AO-2",
    "IA-3", "IA-4",
    "OA-3"
]

const concPropTypes: Partial<Record<mood, propositionKey>> = {
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
}

const qualityTextKey: Record<qualityText, qualityTextTypes> = {
    "true-true": "is",
    "true-false":"are",
    "false-true": "is not",
    "false-false": "are not"
}
const affirmativeKey = ["is", "are"];
const negativeAddOn = "not";
const singleDissentingKey = ["isnt", "arent"];
const qualityPattern = ["is", "are", "isnt", "arent"]

const IGNORE = new Set(["a", "an", "the", "of", "single"])

const quantityPattern = ["all", "every", "each", "no", "none", "some", "few", "least"];

const cleanWord = (word: string): string => {
    return word
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:]/g, "");
}

const normalizeComparisonWord = (word: string): string => {
    const cleaned = cleanWord(word).replace(/men$/, "man");
    if (/[td]es$/.test(cleaned)) return cleaned;
    return inflector.singularize(cleaned);
}

const tokenizeTerm = (term: string): string[] => {
    return term
        .split(/\s+/)
        .map(cleanWord)
        .filter(word => word.length > 0);
}

const normalizeComparisonTerm = (term: string): string => {
    return term
        .split(/\s+/)
        .map(normalizeComparisonWord)
        .filter(word => word.length > 0)
        .join(" ");
}

const singularizeForOutput = (term: string): string => {
    return term
        .split(/\s+/)
        .map(word => inflector.singularize(word))
        .join(" ");
}

export const engine = (data: lines) => {
    const { lineOne, lineTwo } = data;

    const premiseOneCheck = tokenizeTerm(lineOne);
    const premiseTwoCheck = tokenizeTerm(lineTwo);
    let premiseOne: proposition;
    let premiseTwo: proposition;
    try {
        premiseOne = parser(premiseOneCheck);
    } catch(e) {
        const detail = e instanceof Error
            ? e.message
            : "Unexpected parsing failure.";

        throw new Error(`Line one failed to parse: ${detail}`)
    }
    try {
        premiseTwo = parser(premiseTwoCheck);
    } catch(e) {
        const detail = e instanceof Error
            ? e.message
            : "Unexpected parsing failure.";

        throw new Error(`Line two failed to parse: ${detail}`)
    }

    const { mood, subject, predicate, singular } = syllogism(premiseOne, premiseTwo);
    const concPropType = concPropTypes[mood];
    if (!concPropType) {
        throw new Error("Something went wrong.");
    }

    const [quantity, quality] = concPropType.split('-') as [quantity, "true" | "false"];

    const qualityText = qualityTextKey[`${quality}-${singular}`];

    if (singular === true) {
        const conclusion = `${subject} ${qualityText} ${predicate}`;
        return conclusion;
    }

    const conclusion = `${quantity} ${subject} ${qualityText} ${predicate}`;
    return conclusion;

}

const parser = (premise: string[]): proposition => {
    let proptype: propType;
    let quality: quality | undefined;
    let quantity: quantity | undefined;
    let subject: string | undefined;
    let predicate: string | undefined;
    if (premise.length < 3) {
        throw new Error("Invalid sentence: premise must be at least 3 words.");
    }

    premise = premise.filter(word => !IGNORE.has(word));
    const quantifierCount = premise.filter(word => quantityPattern.includes(word)).length;

    if (quantifierCount > 1) {
        throw new Error("Invalid premise: repeated quantifier term.");
    }

    if (!premise.some(word => quantityPattern.includes(word))) {
        quantity = "singular";
    }

    for (let i = 0; i < premise.length; i++) {
        if (quantityPattern.includes(premise[i]!)) {
            const cleaned = quantityPatternKey[premise[i]!];
            if (!cleaned) {
                throw new Error("Something went wrong parsing.");
            }
            quantity = cleaned;
            continue;
        }
        
        if (quantity !== undefined && subject === undefined) {
            subject = premise[i];
            continue;
        }

        if (quantity !== undefined && subject !== undefined && quality === undefined) {
            if (qualityPattern.includes(premise[i]!)) {
                if (singleDissentingKey.includes(premise[i]!)) {
                    quality = false;
                    continue;
                }

                if (affirmativeKey.includes(premise[i]!) && negativeAddOn === premise[i+1]) {
                    quality = false;
                    i += 1;
                    continue;
                }

                quality = true;
                continue;
            } else {
                subject += ` ${premise[i]}`;
                continue;
            }
        }

        if (quantity !== undefined && subject !== undefined && quality !== undefined) {
            if (predicate !== undefined) {
                predicate += ` ${premise[i]}`;
                continue;
            }
            predicate = premise[i];
            continue;
        }
    }

    if (quantity === undefined || quality === undefined || subject === undefined || predicate === undefined) {
        throw new Error("Something went wrong parsing quantity and quality.");
    }
    const propTypeKey: propositionKey = `${quantity}-${quality}`;
    proptype = propositionType[propTypeKey];

    const cleanedPropostion: proposition = {
        propType: proptype,
        quantity: quantity,
        quality: quality,
        subject: subject,
        predicate: predicate,
    }
    return cleanedPropostion;
}

const syllogism = (
    premiseOne: proposition,
    premiseTwo: proposition
): { mood: mood; subject: string; predicate: string, singular: boolean } => {
    const p1Terms: [string, string] = [
        premiseOne.subject,
        premiseOne.predicate
    ];
    const p2Terms: [string, string] = [
        premiseTwo.subject,
        premiseTwo.predicate
    ];

    const normalizedP1Terms: [string, string] = [
        normalizeComparisonTerm(premiseOne.subject),
        normalizeComparisonTerm(premiseOne.predicate)
    ];
    const normalizedP2Terms: [string, string] = [
        normalizeComparisonTerm(premiseTwo.subject),
        normalizeComparisonTerm(premiseTwo.predicate)
    ];

    const middleTerm = normalizedP1Terms.find(term => normalizedP2Terms.includes(term));
    if (!middleTerm) {
        throw new Error("Invalid syllogism: no middle term detected.");
    }

    const premiseOneMiddleIndex = normalizedP1Terms.indexOf(middleTerm);
    const premiseTwoMiddleIndex = normalizedP2Terms.indexOf(middleTerm);

    let singular: boolean = false;
    if (premiseOne.quantity === "singular" || premiseTwo.quantity === "singular") {
        singular = true;
    }

    const p1Outer: string = premiseOneMiddleIndex === 0 ? normalizedP1Terms[1] : normalizedP1Terms[0];
    const p2Outer: string = premiseTwoMiddleIndex === 0 ? normalizedP2Terms[1] : normalizedP2Terms[0];
    const canPremiseOneBeMajor = premiseOne.quantity !== "singular" || premiseTwo.quantity === "singular";
    const canPremiseTwoBeMajor = premiseTwo.quantity !== "singular" || premiseOne.quantity === "singular";

    const p1OuterIndex = normalizedP1Terms.indexOf(p1Outer);
    const p2OuterIndex = normalizedP2Terms.indexOf(p2Outer);

    if (canPremiseOneBeMajor) {
        const probOnep1Order: termOrder = premiseOneMiddleIndex === 0 ? "m-p" : "p-m";
        const probOnep2Order: termOrder = premiseTwoMiddleIndex === 0 ? "m-s" : "s-m";

        const probOneFigure: figure = figureKey[`${probOnep1Order},${probOnep2Order}`];

        const probOneMood: mood = `${premiseOne.propType}${premiseTwo.propType}-${probOneFigure}`;

        const predicate: string = singular ? singularizeForOutput(p1Terms[p1OuterIndex]!) : p1Terms[p1OuterIndex]!;
        if (validMoods.includes(probOneMood)) {
            return { mood: probOneMood, subject: p2Terms[p2OuterIndex]!, predicate: predicate, singular: singular };
        }
    }

    if (canPremiseTwoBeMajor) {
        const probTwop1Order: termOrder = premiseOneMiddleIndex === 0 ? "m-s" : "s-m";
        const probTwop2Order: termOrder = premiseTwoMiddleIndex === 0 ? "m-p" : "p-m";

        const probTwoFigure: figure = figureKey[`${probTwop2Order},${probTwop1Order}`];

        const probTwoMood: mood = `${premiseTwo.propType}${premiseOne.propType}-${probTwoFigure}`;

        const predicate: string = singular ? singularizeForOutput(p2Terms[p2OuterIndex]!) : p2Terms[p2OuterIndex]!;
        if (validMoods.includes(probTwoMood)) {
            return { mood: probTwoMood, subject: p1Terms[p1OuterIndex]!, predicate: predicate, singular: singular };
        }
    }

    throw new Error("Syllogism is false.");
}

import type { proposition, propositionKey, propType, quality, quantity } from "../types.js";
import {
    affirmativeQualityTerms,
    dissentingQualityTerms,
    ignoredWords,
    negativeAddOn,
    propositionTypeByKey,
    qualityTerms,
    quantityByKeyword,
    quantityTerms
} from "./constants.js";

export const parsePremise = (premiseTokens: string[]): proposition => {
    let propositionType: propType;
    let propositionQuality: quality | undefined;
    let propositionQuantity: quantity | undefined;
    let subject: string | undefined;
    let predicate: string | undefined;

    if (premiseTokens.length < 3) {
        throw new Error("Invalid sentence: premise must be at least 3 words.");
    }

    const cleanedTokens = premiseTokens.filter(word => !ignoredWords.has(word));
    const quantityCount = cleanedTokens.filter(word => quantityTerms.includes(word)).length;

    if (quantityCount > 1) {
        throw new Error("Invalid premise: repeated quantifier term.");
    }

    if (!cleanedTokens.some(word => quantityTerms.includes(word))) {
        propositionQuantity = "singular";
    }

    for (let index = 0; index < cleanedTokens.length; index++) {
        const token = cleanedTokens[index]!;

        if (quantityTerms.includes(token)) {
            const normalizedQuantity = quantityByKeyword[token];
            if (!normalizedQuantity) {
                throw new Error("Something went wrong parsing.");
            }

            propositionQuantity = normalizedQuantity;
            continue;
        }

        if (propositionQuantity !== undefined && subject === undefined) {
            subject = token;
            continue;
        }

        if (propositionQuantity !== undefined && subject !== undefined && propositionQuality === undefined) {
            if (!qualityTerms.includes(token)) {
                subject += ` ${token}`;
                continue;
            }

            if (dissentingQualityTerms.includes(token)) {
                propositionQuality = false;
                continue;
            }

            if (affirmativeQualityTerms.includes(token) && negativeAddOn === cleanedTokens[index + 1]) {
                propositionQuality = false;
                index += 1;
                continue;
            }

            propositionQuality = true;
            continue;
        }

        if (propositionQuantity !== undefined && subject !== undefined && propositionQuality !== undefined) {
            if (predicate !== undefined) {
                predicate += ` ${token}`;
                continue;
            }

            predicate = token;
        }
    }

    if (propositionQuantity === undefined || propositionQuality === undefined || subject === undefined || predicate === undefined) {
        throw new Error("Something went wrong parsing quantity and quality.");
    }

    const propositionTypeKey: propositionKey = `${propositionQuantity}-${propositionQuality}`;
    propositionType = propositionTypeByKey[propositionTypeKey];

    return {
        propType: propositionType,
        quantity: propositionQuantity,
        quality: propositionQuality,
        subject,
        predicate
    };
};

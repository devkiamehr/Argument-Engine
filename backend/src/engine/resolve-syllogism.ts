import type { figure, mood, proposition, syllogismResolution, termOrder } from "../types.js";
import { figureByOrder, validMoods } from "./constants.js";
import { normalizeComparisonTerm, singularizeTermForOutput } from "./normalize-text.js";

export const resolveSyllogism = (
    premiseOne: proposition,
    premiseTwo: proposition
): syllogismResolution => {
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

        const probOneFigure: figure = figureByOrder[`${probOnep1Order},${probOnep2Order}`];

        const probOneMood: mood = `${premiseOne.propType}${premiseTwo.propType}-${probOneFigure}`;

        const predicate: string = singular ? singularizeTermForOutput(p1Terms[p1OuterIndex]!) : p1Terms[p1OuterIndex]!;
        if (validMoods.includes(probOneMood)) {
            return { mood: probOneMood, subject: p2Terms[p2OuterIndex]!, predicate: predicate, singular: singular };
        }
    }

    if (canPremiseTwoBeMajor) {
        const probTwop1Order: termOrder = premiseOneMiddleIndex === 0 ? "m-s" : "s-m";
        const probTwop2Order: termOrder = premiseTwoMiddleIndex === 0 ? "m-p" : "p-m";

        const probTwoFigure: figure = figureByOrder[`${probTwop2Order},${probTwop1Order}`];

        const probTwoMood: mood = `${premiseTwo.propType}${premiseOne.propType}-${probTwoFigure}`;

        const predicate: string = singular ? singularizeTermForOutput(p2Terms[p2OuterIndex]!) : p2Terms[p2OuterIndex]!;
        if (validMoods.includes(probTwoMood)) {
            return { mood: probTwoMood, subject: p1Terms[p1OuterIndex]!, predicate: predicate, singular: singular };
        }
    }

    throw new Error("Syllogism is false.");
};


type figure = 1 | 2 | 3 | 4;
type propType = "A" | "E" | "I" | "O";
type role = "major" | "minor";
type quantity = "all" | "some" | "no" | "singular";
type quality = true | false;
type propositionKey = "all-true" | "no-true" | "some-true" | "some-false" | "all-false" | "no-false" | "singular-true" | "singular-false";

type qualityText = `${boolean}-${boolean}`;
type qualityTextTypes = "is" | "are" | "is not" | "are not";

type lines = {
    lineOne: string;
    lineTwo: string;
}

type proposition = {
    propType: propType;
    role?: role | undefined;
    quantity: quantity;
    quality: quality;
    subject: string;
    predicate: string;
}

type termOrder = "m-p" | "p-m" | "m-s" | "s-m";
type figureOrder = "m-p,s-m" | "p-m,s-m" | "m-p,m-s" | "p-m,m-s";
type mood = `${propType}${propType}-${figure}`;
type syllogismResolution = {
    mood: mood;
    subject: string;
    predicate: string;
    singular: boolean;
}

export type {proposition, lines, propType, propositionKey, quantity, quality, role, termOrder, figureOrder, figure, mood, qualityText, qualityTextTypes, syllogismResolution };

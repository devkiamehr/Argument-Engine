
type quantifier = "All" | "Some" | "No";
type propType = "A" | "E" | "I" | "O";
type figure = 1 | 2 | 3| 4;
type role = "major" | "minor" | "conclusion";
type propositionKey = "All-true" | "No-true" | "Some-true" | "Some-false" | "All-false" | "No-false";


interface cannon {
    propType?: propType;
    role: role;
    quanitifier: quantifier;
    polarity: boolean;
    subject?: string;
    predicate?: string;
    middle?: string;
}

interface syllogism {
    figure: figure;
}

const propositionType: Record<propositionKey, propType> = {
    "All-true": "A",
    "No-true": "E",
    "Some-true": "I",
    "Some-false": "O",
    "All-false": "E",
    "No-false": "A"
}

const engine = (major: cannon, minor: cannon) => {
    const p = parser(major, minor);

    
} 

const parser = (major: cannon, minor: cannon) => {
    if (!major.middle || !major.predicate) {
        throw new Error("Major premise missing middle or predicate term.");
    }
    if (!minor.subject || !minor.middle) {
        throw new Error("Minor premise missing subject or middle term.");
    }
    if (major.middle !== minor.middle) {
        throw new Error("Major and minor premise middle terms don't match.")
    }

    const majorKey = `${major.quanitifier}-${major.polarity}` as propositionKey;
    const minorKey = `${minor.quanitifier}-${minor.polarity}` as propositionKey;
    
    major.propType = propositionType[majorKey];
    major.propType = propositionType[minorKey];
    
    
}
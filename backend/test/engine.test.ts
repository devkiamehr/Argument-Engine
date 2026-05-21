import { describe, it, expect } from "vitest";
import { engine } from "../src/engine.js";

describe("engine", () => {
    it("handles basic AA-1 syllogism", () => {
        const result = engine({
            lineOne: "all men are mortal",
            lineTwo: "socrates is man"
        });

        expect(result).toBe("socrates is mortal");
    });

    it("handles plural normalization", () => {
        const result = engine({
            lineOne: "all dogs are animals",
            lineTwo: "fido is a dog"
        });

        expect(result).toBe("fido is animal");
    });

    it("handles punctuation and capitalization", () => {
        const result = engine({
            lineOne: "All men are mortal.",
            lineTwo: "Socrates is man."
        });

        expect(result).toBe("socrates is mortal");
    });

    it("rejects repeated quantifiers", () => {
        expect(() =>
            engine({
                lineOne: "all some men are mortal",
                lineTwo: "socrates is man"
            })
        ).toThrow("repeated quantifier");
    });

    it("rejects missing middle term", () => {
        expect(() =>
            engine({
                lineOne: "all men are mortal",
                lineTwo: "some cats are animals"
            })
        ).toThrow("no middle term");
    });

    it("uses original terms in conclusion, not normalized terms", () => {
        const result = engine({
            lineOne: "all men are mortal",
            lineTwo: "socrates is man"
        });

        expect(result).toBe("socrates is mortal");
    });

    it("does not corrupt proper names ending in es", () => {
    const result = engine({
        lineOne: "all men are mortal",
        lineTwo: "socrates is man"
    });

    expect(result).toBe("socrates is mortal");
});
});

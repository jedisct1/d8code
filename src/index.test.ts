import { describe, expect, test } from "bun:test";
import { decode, decodeFromString, encode, encodeToString } from "./index";

describe("encode", () => {
    test("encodes empty input", () => {
        const result = encode(new Uint8Array([]));
        expect(result).toEqual(new Uint8Array([]));
    });

    test("encodes single byte", () => {
        const result = encode(new Uint8Array([0]));
        expect(result.length).toBeGreaterThan(0);
    });

    test("avoids double quote by default", () => {
        const input = new Uint8Array([34 - 32]); // Would produce " after shift
        const result = encodeToString(input);
        expect(result).not.toContain('"');
    });

    test("avoids backslash by default", () => {
        const input = new Uint8Array([92 - 32]); // Would produce \ after shift
        const result = encodeToString(input);
        expect(result).not.toContain("\\");
    });

    test("respects custom s1 parameter", () => {
        const input = new Uint8Array([39 - 32]); // Would produce ' after shift
        const result = encodeToString(input, 39, 92);
        expect(result).not.toContain("'");
    });
});

describe("decode", () => {
    test("decodes empty input", () => {
        const result = decode(new Uint8Array([]));
        expect(result).toEqual(new Uint8Array([]));
    });

    test("throws on invalid input", () => {
        expect(() => decode(new Uint8Array([0xc0]))).toThrow("Parse error");
    });
});

describe("roundtrip", () => {
    test("encode then decode returns original", () => {
        const original = new Uint8Array([0, 1, 2, 127, 128, 255]);
        const encoded = encode(original);
        const decoded = decode(encoded);
        expect(decoded).toEqual(original);
    });

    test("encodeToString then decodeFromString returns original", () => {
        const original = new Uint8Array([0, 50, 100, 150, 200, 255]);
        const encoded = encodeToString(original);
        const decoded = decodeFromString(encoded);
        expect(decoded).toEqual(original);
    });

    test("roundtrip with custom pshift", () => {
        const original = new Uint8Array([0, 127, 255]);
        const pshift = 35;
        const encoded = encode(original, 34, 92, pshift);
        const decoded = decode(encoded, pshift);
        expect(decoded).toEqual(original);
    });

    test("roundtrip with all byte values", () => {
        const original = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            original[i] = i;
        }
        const encoded = encode(original);
        const decoded = decode(encoded);
        expect(decoded).toEqual(original);
    });
});

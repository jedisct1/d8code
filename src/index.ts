const DEFAULT_PSHIFT = 32;

/**
 * Encodes binary data as UTF-8, returns it as a `Uint8Array`
 *
 * Characters `s1` and `s2` will be avoided in the output. By default, these
 * are set to `34` (`"` character) and `92` (`\` character).
 * You may want to set `s1` to `39` if you are using `'` instead of `"` around strings.
 *
 * @returns `bin` encoded as valid UTF-8, in a `Uint8Array`.
 * @param bin Binary input (Uint8Array)
 * @param s1 Character code to avoid in the output
 * @param s2 Second character code to avoid in the output
 * @param pshift Minimum character code to emit (should be >= 32)
 */
export function encode(
    bin: Uint8Array,
    s1: number = 34,
    s2: number = 92,
    pshift = DEFAULT_PSHIFT,
): Uint8Array {
    const encoded: number[] = [];
    bin.forEach((b) => {
        b += pshift;
        if (b === s1 || b === s2) {
            b += 0x100;
        }
        if (b < 0x80) {
            encoded.push(b);
        } else {
            encoded.push((b >>> 6) | 0xc0, (b & 0x3f) | 0x80);
        }
    });
    return new Uint8Array(encoded);
}

/**
 * Encodes binary data as UTF-8, returns it as a `string`
 *
 * Characters `s1` and `s2` will be avoided in the output. By default, these
 * are set to `34` (`"` character) and `92` (`\` character).
 * You may want to set `s1` to `39` if you are using `'` instead of `"` around strings.
 *
 * @returns `bin` encoded as valid UTF-8, in a `string`.
 * @param bin Binary input (Uint8Array)
 * @param s1 Character code to avoid in the output
 * @param s2 Second character code to avoid in the output
 * @param pshift Minimum character code to emit (should be >= 32)
 */
export function encodeToString(
    bin: Uint8Array,
    s1: number = 34,
    s2: number = 92,
    pshift = DEFAULT_PSHIFT,
): string {
    return new TextDecoder("utf-8").decode(encode(bin, s1, s2, pshift));
}

/**
 * Decode binary data encoded as UTF-8
 *
 * @returns Decoded data, as a `Uint8Array`
 * @param encoded Encoded data, as a `Uint8Array`
 * @param pshift Minimum character code to emit (should be >= 32)
 */
export function decode(
    encoded: Uint8Array,
    pshift = DEFAULT_PSHIFT,
): Uint8Array {
    const bin: number[] = [];
    let shift = 0;
    encoded.forEach((c) => {
        if (c >= 0xc0) {
            if (c < 0xc2 || c > 0xc5) {
                throw new Error("Parse error");
            }
            shift = ((c - 0xc2) << 6) + 0x80;
        } else {
            const c2 = (c & 0x7f) + shift;
            if (c2 < pshift || c2 > pshift + 0x17f) {
                throw new Error("Parse error");
            }
            bin.push((c2 - pshift) & 0xff);
            shift = 0;
        }
    });
    return new Uint8Array(bin);
}

/**
 * Decode binary data encoded as UTF-8, provided as a string
 *
 * @returns Decoded data, as a `Uint8Array`
 * @param encoded Encoded data, as a `string`
 * @param pshift Minimum character code to emit (should be >= 32)
 */
export function decodeFromString(
    encoded: string,
    pshift = DEFAULT_PSHIFT,
): Uint8Array {
    return decode(new TextEncoder().encode(encoded), pshift);
}

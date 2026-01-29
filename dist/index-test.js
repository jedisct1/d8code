"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = encode;
exports.encodeToString = encodeToString;
exports.decode = decode;
exports.decodeFromString = decodeFromString;
var DEFAULT_PSHIFT = 32;
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
function encode(bin, s1, s2, pshift) {
    if (s1 === void 0) { s1 = 34; }
    if (s2 === void 0) { s2 = 92; }
    if (pshift === void 0) { pshift = DEFAULT_PSHIFT; }
    var encoded = [];
    bin.forEach(function (b) {
        b += pshift;
        if (b === s1 || b === s2) {
            b += 0x100;
        }
        if (b < 0x80) {
            encoded.push(b);
        }
        else {
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
function encodeToString(bin, s1, s2, pshift) {
    if (s1 === void 0) { s1 = 34; }
    if (s2 === void 0) { s2 = 92; }
    if (pshift === void 0) { pshift = DEFAULT_PSHIFT; }
    return new TextDecoder("utf-8").decode(encode(bin, s1, s2, pshift));
}
/**
 * Decode binary data encoded as UTF-8
 *
 * @returns Decoded data, as a `Uint8Array`
 * @param encoded Encoded data, as a `Uint8Array`
 * @param pshift Minimum character code to emit (should be >= 32)
 */
function decode(encoded, pshift) {
    if (pshift === void 0) { pshift = DEFAULT_PSHIFT; }
    var bin = [];
    var shift = 0;
    encoded.forEach(function (c) {
        if (c >= 0xc0) {
            if (c < 0xc2 || c > 0xc5) {
                throw new Error("Parse error");
            }
            shift = ((c - 0xc2) << 6) + 0x80;
        }
        else {
            var c2 = (c & 0x7f) + shift;
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
function decodeFromString(encoded, pshift) {
    if (pshift === void 0) { pshift = DEFAULT_PSHIFT; }
    return decode(new TextEncoder().encode(encoded), pshift);
}
var fs = __importStar(require("node:fs"));
fs.readFile("/tmp/tanks.wasm", function (err, buf) {
    var encoded = encode(buf, -1);
    console.log(encoded.length);
    fs.writeFile("/tmp/tanks.wasm.d8code", encoded, function (err) {
        if (err != null) {
            console.error(err);
        }
    });
});
//# sourceMappingURL=index-test.js.map
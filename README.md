# d8code

Encode binary data as a UTF-8 string that may compress efficiently.

It may be an interesting alternative to base64 and hex encoding to
inline WebAssembly code in a Javascript module.

## wasm-crypto

wasm-crypto mainly contains code. The data section is small.

|                       | uncompressed | gzip -9 | brotli -9 |
| --------------------- | ------------ | ------- | --------- |
| non encoded           | 230204       | 66807   | 56528     |
| base64 encoded        | 306941       | 78534   | 72305     |
| hex encoded           | 460408       | 73352   | 70044     |
| d8 encoded            | 278523       | 72009   | 65816     |
| d8 encoded, pshift=35 | 268758       | 71737   | 65212     |

## libsodium

libsodium mainly contains optimized code. The data section is small.

|                | uncompressed | gzip -9 | brotli -9 |
| -------------- | ------------ | ------- | --------- |
| original       | 142651       | 73847   | 67085     |
| base64 encoded | 190205       | 91460   | 83944     |
| hex encoded    | 285302       | 84001   | 75940     |
| d8 encoded     | 183114       | 82821   | 71612     |

## tanks

The Tanks game contains code, but also a solid amount of already compressed binary data.

Base64 encoding performs the best here, even though any kind of encoding should be avoided here.

|                | uncompressed | gzip -9 | brotli -9 |
| -------------- | ------------ | ------- | --------- |
| original       | 3773944      | 3751303 | 67085     |
| base64 encoded | 5031929      | 3796237 | 3765105   |
| hex encoded    | 7547888      | 4252953 | 4090581   |
| d8 encoded     | 6162834      | 4648197 | 4108294   |

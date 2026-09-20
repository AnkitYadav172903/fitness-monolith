import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "avatars");

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c;
    }
    return table;
})();

function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, "ascii");
    const body = Buffer.concat([typeBuf, data]);

    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);

    return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
    const signature = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const raw = Buffer.alloc(height * (1 + width * 4));
    let p = 0;
    for (let y = 0; y < height; y++) {
        raw[p++] = 0;
        const rowStart = y * width * 4;
        rgba.copy(raw, p, rowStart, rowStart + width * 4);
        p += width * 4;
    }

    const idat = deflateSync(raw);

    return Buffer.concat([
        signature,
        chunk("IHDR", ihdr),
        chunk("IDAT", idat),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}

const SLATE = [0x64, 0x74, 0x8b, 0xff];
const WHITE = [0xff, 0xff, 0xff, 0xff];

const SIZE = 256;

function render() {
    const img = Buffer.alloc(SIZE * SIZE * 4);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const headDx = x - SIZE / 2;
            const headDy = y - 105;
            const inHead = headDx * headDx + headDy * headDy <= 48 * 48;

            const bodyDx = (x - SIZE / 2) / 88;
            const bodyDy = (y - 235) / 62;
            const inBody = bodyDx * bodyDx + bodyDy * bodyDy <= 1;

            const px = inHead || inBody ? WHITE : SLATE;
            const idx = (y * SIZE + x) * 4;
            img[idx] = px[0];
            img[idx + 1] = px[1];
            img[idx + 2] = px[2];
            img[idx + 3] = px[3];
        }
    }

    return img;
}

mkdirSync(outputDir, { recursive: true });

writeFileSync(
    join(outputDir, "default-avatar.png"),
    encodePNG(SIZE, SIZE, render())
);

console.log("Default avatar generated in", outputDir);
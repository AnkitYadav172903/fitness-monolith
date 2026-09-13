import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "icons");

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
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type: RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const raw = Buffer.alloc(height * (1 + width * 4));
    let p = 0;
    for (let y = 0; y < height; y++) {
        raw[p++] = 0; // filter: none
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

const BLUE = [0x25, 0x63, 0xeb, 0xff];
const WHITE = [0xff, 0xff, 0xff, 0xff];

const shapes = [
    { x: 6, y: 10, w: 12, h: 4 }, // center bar
    { x: 3, y: 6, w: 3, h: 12 }, // inner plate (left)
    { x: 1, y: 8, w: 2, h: 8 }, // outer plate (left)
    { x: 18, y: 6, w: 3, h: 12 }, // inner plate (right)
    { x: 21, y: 8, w: 2, h: 8 }, // outer plate (right)
];

const GRID = 24;

function isShape(gx, gy) {
    for (const s of shapes) {
        if (gx >= s.x && gx < s.x + s.w && gy >= s.y && gy < s.y + s.h) {
            return true;
        }
    }
    return false;
}

function renderIcon(size, inset) {
    const img = Buffer.alloc(size * size * 4);
    const content = size * (1 - 2 * inset);
    const offset = size * inset;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const gx = Math.floor(((x - offset + 0.5) / content) * GRID);
            const gy = Math.floor(((y - offset + 0.5) / content) * GRID);

            const inside =
                gx >= 0 &&
                gx < GRID &&
                gy >= 0 &&
                gy < GRID &&
                isShape(gx, gy);

            const px = inside ? WHITE : BLUE;
            const idx = (y * size + x) * 4;
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
    join(outputDir, "icon-192.png"),
    encodePNG(192, 192, renderIcon(192, 0))
);
writeFileSync(
    join(outputDir, "icon-512.png"),
    encodePNG(512, 512, renderIcon(512, 0))
);
writeFileSync(
    join(outputDir, "maskable-512.png"),
    encodePNG(512, 512, renderIcon(512, 0.1))
);

console.log("PWA icons generated in", outputDir);
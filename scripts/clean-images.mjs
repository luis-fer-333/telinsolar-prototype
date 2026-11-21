#!/usr/bin/env node
/*
 * Neteja les fotos del repositori: elimina les metadades (GPS, càmera, data...) i redueix
 * les que són massa grans. Només reescriu les que ho necessiten, així que es pot executar
 * sempre que es vulgui. L'executa automàticament .github/workflows/clean-images.yml
 * cada cop que es puja una foto (per exemple, des de Pages CMS).
 *
 *   node scripts/clean-images.mjs [carpeta]     (per defecte: media)
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2] || 'media';
const MAX = 2000;
const files = (await readdir(dir, { recursive: true }))
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .map(f => path.join(dir, f));

let changed = 0;
for (const file of files) {
    const input = await readFile(file);
    const meta = await sharp(input).metadata();
    const hasMeta = Boolean(meta.exif || meta.xmp || meta.iptc);
    const tooBig = Math.max(meta.width || 0, meta.height || 0) > MAX;
    if (!hasMeta && !tooBig) continue;

    // rotate() aplica l'orientació EXIF abans d'esborrar-la; sharp no copia metadades a la sortida.
    let img = sharp(input).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
    img = meta.format === 'png' ? img.png({ compressionLevel: 9 })
        : meta.format === 'webp' ? img.webp({ quality: 85 })
        : img.jpeg({ quality: 85, mozjpeg: true });
    await writeFile(file, await img.toBuffer());
    changed++;
    console.log(`✔ ${file}${hasMeta ? ' · metadades eliminades' : ''}${tooBig ? ` · reduïda a ${MAX}px` : ''}`);
}
console.log(`${changed} de ${files.length} fotos netejades`);

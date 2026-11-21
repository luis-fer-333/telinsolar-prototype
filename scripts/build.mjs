#!/usr/bin/env node
/*
 * Build del web.
 *
 *   node scripts/build.mjs          → genera data/projects-index.js (per veure el web en local)
 *   node scripts/build.mjs --dist   → a més, crea _site/ amb el web llest per publicar
 *                                     i les fotos optimitzades (si hi ha `sharp` instal·lat)
 *
 * Les instal·lacions viuen a data/projects/*.json (un fitxer per projecte, editables des de Pages CMS).
 * Un web estàtic no pot llistar una carpeta, així que aquí les ajuntem totes en un sol fitxer.
 */
import { readdir, readFile, writeFile, mkdir, cp, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data', 'projects');
const INDEX_FILE = path.join(ROOT, 'data', 'projects-index.js');
const DIST = path.join(ROOT, '_site');
const DIST_MODE = process.argv.includes('--dist');

const PUBLIC_FILES = ['index.html', 'styles.css', 'script.js', 'i18n.js', 'config.js'];
const PUBLIC_DIRS = ['media', 'docs/projectes'];
const IMAGE_MAX_WIDTH = 1600;

const warn = (msg) => console.warn(`⚠️  ${msg}`);

async function loadProjects() {
    const files = (await readdir(DATA_DIR)).filter(f => f.endsWith('.json')).sort();
    const projects = [];
    for (const file of files) {
        let data;
        try {
            data = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
        } catch (e) {
            warn(`${file}: JSON no vàlid, s'omet (${e.message})`);
            continue;
        }
        if (!data.name_ca || !data.type) {
            warn(`${file}: falta el nom o el tipus, s'omet`);
            continue;
        }
        if (data.published === false) continue;
        for (const p of data.photos || []) {
            try { await stat(path.join(ROOT, p)); } catch { warn(`${file}: no es troba la foto ${p}`); }
        }
        projects.push({ id: file.replace(/\.json$/, ''), ...data });
    }
    // Destacats primer, després els més recents; la resta, en ordre de fitxer.
    projects.sort((a, b) =>
        (b.featured === true) - (a.featured === true) ||
        String(b.date || '').localeCompare(String(a.date || '')));
    return projects;
}

async function writeIndex(projects) {
    const body =
        '/* FITXER GENERAT AUTOMÀTICAMENT per scripts/build.mjs — no l\'editis a mà.\n' +
        ' * Les dades són a data/projects/*.json */\n' +
        `window.TELINSOLAR_PROJECTS = ${JSON.stringify(projects, null, 2)};\n`;
    await writeFile(INDEX_FILE, body);
    console.log(`✔ ${projects.length} projectes → data/projects-index.js`);
}

async function optimizeImages(dir) {
    let sharp;
    try { sharp = (await import('sharp')).default; } catch {
        warn('sharp no està instal·lat: les fotos es copien sense optimitzar');
        return;
    }
    const files = (await readdir(dir, { recursive: true }))
        .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
        .map(f => path.join(dir, f));
    for (const file of files) {
        const before = (await stat(file)).size;
        // rotate() aplica l'orientació EXIF; sharp no copia metadades (s'eliminen GPS, càmera, etc.)
        let img = sharp(await readFile(file)).rotate().resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });
        img = /\.png$/i.test(file) ? img.png({ compressionLevel: 9 })
            : /\.webp$/i.test(file) ? img.webp({ quality: 80 })
            : img.jpeg({ quality: 80, mozjpeg: true });
        const out = await img.toBuffer();
        if (out.length < before) await writeFile(file, out);
        console.log(`  ${path.relative(DIST, file)}: ${Math.round(before / 1024)} KB → ${Math.round(Math.min(out.length, before) / 1024)} KB`);
    }
}

async function buildDist() {
    await rm(DIST, { recursive: true, force: true });
    await mkdir(DIST, { recursive: true });
    for (const f of PUBLIC_FILES) await cp(path.join(ROOT, f), path.join(DIST, f));
    await mkdir(path.join(DIST, 'data'), { recursive: true });
    await cp(INDEX_FILE, path.join(DIST, 'data', 'projects-index.js'));
    for (const d of PUBLIC_DIRS) {
        try { await cp(path.join(ROOT, d), path.join(DIST, d), { recursive: true }); } catch { /* carpeta buida */ }
    }
    await writeFile(path.join(DIST, '.nojekyll'), '');
    console.log('✔ Web copiat a _site/');
    await optimizeImages(path.join(DIST, 'media'));
}

const projects = await loadProjects();
await writeIndex(projects);
if (DIST_MODE) await buildDist();

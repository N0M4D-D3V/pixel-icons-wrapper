import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { extname, basename } from "node:path";

const ICONS_DIR = new URL("../icons/", import.meta.url);
const OUT_DIR = new URL("../dist/", import.meta.url);
const OUT_FILE = new URL("../dist/pixel-icons.css", import.meta.url);

const ASCII = `
███████████████████████████████████████████████████████████████████████████████
Builder

██████  ██ ██   ██ ███████ ██            ██  ██████  ██████  ███    ██ ███████ 
██   ██ ██  ██ ██  ██      ██            ██ ██      ██  ████ ████   ██ ██      
██████  ██   ███   █████   ██      █████ ██ ██      ██ ██ ██ ██ ██  ██ ███████ 
██      ██  ██ ██  ██      ██            ██ ██      ████  ██ ██  ██ ██      ██ 
██      ██ ██   ██ ███████ ███████       ██  ██████  ██████  ██   ████ ███████ 

CSS ICON LIBRARY               v0.0.1
███████████████████████████████████████████████████████████████████████████████

`;
// Clase base
const baseCss =
  `
/* Auto-generated. Do not edit by hand. */

/*
${ASCII}
*/

.i{
  display:inline-block;
  width:1em;
  height:1em;
  background-color: currentColor;

  -webkit-mask-repeat:no-repeat;
  mask-repeat:no-repeat;
  -webkit-mask-position:center;
  mask-position:center;
  -webkit-mask-size:contain;
  mask-size:contain;

  vertical-align:-0.125em;
}
`.trim() + "\n\n";

function normalizeSvg(svg) {
  // Quita saltos/indentación y comentarios básicos
  return svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\r?\n|\r/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function svgToDataUri(svg) {
  // Para data:image/svg+xml URL-encoded (más compatible en CSS)
  // Importante: encodeURIComponent y algunos reemplazos para CSS
  const encoded = encodeURIComponent(svg)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/");
  return `data:image/svg+xml,${encoded}`;
}

function safeName(file) {
  // home.svg -> home ; user-add.svg -> user-add
  // puedes adaptar aquí tu convención
  return basename(file, ".svg")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log(ASCII);
  const files = await readdir(ICONS_DIR);
  const svgs = files.filter((f) => extname(f).toLowerCase() === ".svg");

  if (!svgs.length) {
    console.error("No se encontraron SVG en /icons");
    process.exit(1);
  }

  let css = baseCss;

  for (const file of svgs.sort()) {
    const raw = await readFile(new URL(file, ICONS_DIR), "utf8");
    const svg = normalizeSvg(raw);

    // Consejo: si el SVG no tiene viewBox, mejor arreglarlo en origen.
    // Aquí podrías añadir un check rápido:
    if (!/viewBox=/i.test(svg)) {
      console.warn(
        `⚠️  ${file} no tiene viewBox. Recomendado añadirlo para escalado correcto.`
      );
    }

    const name = safeName(file);
    const uri = svgToDataUri(svg);

    css +=
      `
.i-${name}{
  -webkit-mask-image:url("${uri}");
  mask-image:url("${uri}");
}
`.trim() + "\n\n";
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, css, "utf8");
  console.log(`✅ Generado: ${OUT_FILE.pathname}`);
  console.log(`   Iconos: ${svgs.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

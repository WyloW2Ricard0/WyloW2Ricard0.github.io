/// Outlook ne supporte pas CSS et les scripts dynamique.
/// Donc on ecrit un script pour generer un .htm static

/// comande pour le lancement :
/// node .\signature\outlook-generer.js

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

console.log('🚀 Génération signature Outlook...\n');

/// 1. LIRE LES FICHIERS
const config = JSON.parse(fs.readFileSync(path.join(baseDir, '..', 'assets', 'core', 'placeholders.json'), 'utf8'));

const cssDir = path.join(baseDir, '..', 'assets', 'css');
const cssFiles = fs.readdirSync(cssDir).filter(file => file.toLowerCase().endsWith('.css')).sort();
const css = cssFiles.map(file => fs.readFileSync(path.join(cssDir, file), 'utf8')).join('\n');
if (!cssFiles.length) {
  console.error('❌ Aucun fichier CSS trouvé dans assets/css');
  process.exit(1);
}
console.log(`✓ ${cssFiles.length} fichiers CSS chargés`);

let html = fs.readFileSync(path.join(baseDir, 'signature.html'), 'utf8');

/// 1bis. EXTRAIRE UNIQUEMENT LA TABLE
const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);
if (!tableMatch) {
  console.error('❌ Aucune table trouvée !');
  process.exit(1);
}
html = tableMatch[0];
console.log('✓ Table extraite');

/// 2+3. EXTRAIRE VARIABLES CSS ET CLASSES EN UNE SEULE PASSE
const classStyles = {};
const colors = {};
const sizes = {};

/// ✅ Variables CSS
[...css.matchAll(/--color-(\w+):\s*([^;]+);/g)].forEach(m => colors[m[1]] = m[2].trim());
[...css.matchAll(/--size-(\w+):\s*([^;]+);/g)].forEach(m => sizes[m[1]] = m[2].trim());

/// ✅ Classes et éléments
[...css.matchAll(/([.a-z][\w.-]*(?:\s*,\s*[.a-z][\w.-]*)*)\s*\{([^}]+)\}/gi)].forEach(m => {
  m[1].split(',').map(s => s.trim()).forEach(selector => {
    if (!selector.includes(':') && !selector.includes('@')) {
      const key = selector.startsWith('.') ? selector.substring(1) : selector;
      classStyles[key] = m[2].trim().replace(/\s+/g, ' ');
    }
  });
});

console.log(`✓ ${Object.keys(colors).length} couleurs, ${Object.keys(sizes).length} espacements, ${Object.keys(classStyles).length} classes`);

/// 4. TRAITER TOUTES LES BALISES
const tagRegex = /<([a-z][a-z0-9-]*)([^>]*)>/gi;
html = html.replace(tagRegex, (match, tag, attrs) => {
  attrs = attrs.replace(/\s+/g, ' ').trim();
  const classMatch = attrs.match(/\s*class="([^"]*)"/);
  const styleMatch = attrs.match(/\s*style="([^"]*)"/);

  let cleanAttrs = attrs.replace(/\s*class="[^"]*"/, '').replace(/\s*style="[^"]*"/, '').trim();

  /// ✅ Collecter styles (tag + classes + style existant)
  const allStyles = [
    classStyles[tag],
    ...(classMatch ? classMatch[1].split(/\s+/).filter(c => c && classStyles[c]).map(c => classStyles[c]) : []),
    styleMatch ? styleMatch[1].trim().replace(/;+$/, '') : ''
  ].filter(s => s).map(s => s.trim().replace(/;+$/, ''));

  return allStyles.length
    ? `<${tag}${cleanAttrs ? ' ' + cleanAttrs : ''} style="\n  ${allStyles.join('\n  ; ')}">`
    : `<${tag}${cleanAttrs ? ' ' + cleanAttrs : ''}>`;
});
console.log('✓ Balises traitées');

/// 5. REMPLACER PLACEHOLDERS
const tlphnHref = (config.tlphn || '').replace(/\s/g, '');
Object.entries({ ...config, tlphn_href: tlphnHref }).forEach(([k, v]) => {
  html = html.replaceAll(`{{${k}}}`, v);
});
console.log('✓ Placeholders JSON remplacés');

/// 6. REMPLACER VARIABLES CSS
Object.entries(colors).forEach(([k, v]) => html = html.replaceAll(`var(--color-${k})`, v));
Object.entries(sizes).forEach(([k, v]) => html = html.replaceAll(`var(--size-${k})`, v));
console.log('✓ Variables CSS converties');

/// 7. CORRIGER L'ESPACEMENT FLEX AVEC MARGIN (compatible Outlook)
html = html.replace(/(<a id="githb"[^>]*)>/, '$1 style="margin-right: 1.50em;">');
/// SUPPRIMER LES PROPRIÉTÉS CSS INCOMPATIBLES AVEC OUTLOOK
const incompatibleProps = [
  'animation',
  'transition',
  'transform',
  'filter',
  'display: flex; justify-content: space-around;',
];
incompatibleProps.forEach(prop => {
  const regex = new RegExp(`${prop}[^;]*;?\\s*`, 'gi');
  html = html.replace(regex, '');
});
console.log('✓ Propriétés Outlook incompatibles nettoyées des classes');

/// 8. NETTOYAGE FINAL
html = html.replace(/\s*class=""/g, '').replace(/\s+style=""/g, '');
console.log('✓ Attributs vides nettoyés');

/// 9. ÉCRIRE
fs.writeFileSync(path.join(baseDir, 'outlook-generer.htm'), html);
console.log('\n✅ Fichier généré : outlook-generer.htm\n');

// === PRÉVISUALISATION NAVIGATEUR ===
// Remplace les placeholders {{clé}} dans le DOM depuis placeholders.json
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetch('../assets/core/placeholders.json').then(r => r.json());
  const allData = {
    ...data,
    tlphn_href: (data.tlphn || '').replace(/\s/g, ''),
  };

  document.body.innerHTML = document.body.innerHTML.replace(
    /\{\{([^}]+)\}\}/g,
    (_, key) => allData[key.trim()] ?? ''
  );
});

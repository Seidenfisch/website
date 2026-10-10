/* Render editable article context metadata from Pages CMS content. */
(async () => {
  const panel = document.querySelector('.article-context');
  if (!panel) return;
  const slug = location.pathname.split('/').pop().replace(/\.html$/, '');
  try {
    const response = await fetch('../content/writing-context.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Writing context fetch failed: ' + response.status);
    const entries = await response.json();
    if (!Array.isArray(entries)) throw new Error('Writing context is not a list');
    const entry = entries.find(item => item.slug === slug);
    if (!entry) return;
    const tbody = panel.querySelector('.context-metadata tbody');
    if (tbody) {
      tbody.replaceChildren();
      for (const [label, value] of [
        ['Date / period', entry.period],
        ['Type', entry.type],
        ['Status / whereabouts', entry.status]
      ]) {
        const row = document.createElement('tr');
        const heading = document.createElement('th');
        heading.scope = 'row';
        heading.textContent = label;
        const cell = document.createElement('td');
        cell.textContent = value || 'To be added';
        row.append(heading, cell);
        tbody.append(row);
      }
    }
    const note = panel.querySelector('p');
    if (note) note.textContent = entry.note || '';
  } catch (error) {
    console.error('Unable to load writing context; showing page fallback:', error);
  }
})();

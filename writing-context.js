/* Render Pages CMS writing context, metadata and article titles. */
(async () => {
  const ui = key => window.SDL ? window.SDL.t(key) : key;
  const root = document.documentElement.dataset.assetRoot ?? '../';
  const panel = document.querySelector('.article-context');
  const cards = document.querySelectorAll('a.writing-card');
  if (!panel && !cards.length) return;

  try {
    const language = window.SDL?.language || 'en';
    let translated = language !== 'en';
    let response = await fetch(root + 'content/' + (translated ? `writing-context.${language}.json` : 'writing-context.json'), {cache:'no-store'});
    if (!response.ok && translated) {
      translated = false;
      response = await fetch(root + 'content/writing-context.json', {cache:'no-store'});
    }
    if (!response.ok) throw new Error('Writing context fetch failed: ' + response.status);
    const data = await response.json();
    const entries = Array.isArray(data) ? data : data?.writing_contexts;
    if (!Array.isArray(entries)) throw new Error('Writing context is not a list');
    const entryForSlug = slug => entries.find(item => item.slug === slug);
    const slugFromPath = path => path.split('/').pop().replace(/\.html$/, '');

    // Keep the archive's editorial headlines in sync with the CMS.
    cards.forEach(card => {
      const slug = slugFromPath(new URL(card.href, location.href).pathname);
      const entry = entryForSlug(slug);
      const heading = card.querySelector('.writing-card-copy h2');
      if (heading && entry?.headline?.trim()) heading.textContent = entry.headline;
    });

    if (!panel) return;
    const entry = entryForSlug(slugFromPath(location.pathname));
    if (!entry) return;
    const headline = document.querySelector('.article-header h1');
    if (headline && entry.headline?.trim()) {
      headline.textContent = entry.headline;
      if (language !== 'en' && !translated) headline.lang = 'en';
    }
    if (entry.title?.trim()) document.title = entry.title + ' — SDL';

    const tbody = panel.querySelector('.context-metadata tbody');
    if (tbody) {
      tbody.replaceChildren();
      for (const [label, value, visible] of [
        [ui('Date / period'), entry.period, entry.show_period],
        [ui('Type'), entry.type, entry.show_type],
        [ui('Status / whereabouts'), entry.status, entry.show_status]
      ]) {
        if (visible === false || value == null || !String(value).trim()) continue;
        const row = document.createElement('tr');
        const heading = document.createElement('th');
        heading.scope = 'row';
        heading.textContent = label;
        const cell = document.createElement('td');
        window.SDL.renderMarkdown(cell, value);
        row.append(heading, cell);
        tbody.append(row);
      }
    }
    const note = panel.querySelector('p');
    if (note) {
      const visible = entry.show_note !== false && typeof entry.note === 'string' && !!entry.note.trim();
      note.hidden = !visible;
      if (visible) {
        window.SDL.renderMarkdown(note, entry.note);
        if (language !== 'en' && !translated) note.lang = 'en';
        else note.removeAttribute('lang');
      }
    }
  } catch (error) {
    console.error('Unable to load writing context; showing page fallback:', error);
  }
})();

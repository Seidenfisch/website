/* About and Credits content from Pages CMS, with static HTML as fallback. */
(() => {
  const language = document.documentElement.dataset.sdlLang || 'en';
  const root = document.documentElement.dataset.assetRoot || '';
  const isAbout = document.querySelector('.about-copy');
  const isCredits = document.querySelector('.credits-list');
  if (!isAbout && !isCredits) return;
  const page = isAbout ? 'about' : 'credits';
  const filename = 'content/' + page + (language === 'en' ? '' : '.' + language) + '.json';
  fetch(root + filename, { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Editable page content unavailable');
      return response.json();
    })
    .then(data => {
      if (!data || typeof data !== 'object') return;
      const setText = (node, value) => {
        if (node && typeof value === 'string' && value.trim()) node.textContent = value;
      };
      if (isAbout) {
        // Keep the blue accent on the second line.
        const heading = isAbout.querySelector('h1');
        if (heading && typeof data.headline_first === 'string' && typeof data.headline_accent === 'string') {
          heading.replaceChildren(document.createTextNode(data.headline_first), document.createElement('br'));
          const accent = document.createElement('span');
          accent.className = 'about-accent';
          accent.textContent = data.headline_accent;
          heading.append(accent);
        }
        setText(isAbout.querySelector('.about-copy > p:not(.about-contact):not(.interests-simple)'), data.intro);
        setText(isAbout.querySelector('.interests-simple'), data.interests);
        const portrait = document.querySelector('.about-photo img');
        if (portrait) {
          if (typeof data.portrait === 'string' && data.portrait.trim() &&
              !/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|\.\.)/i.test(data.portrait.trim())) {
            portrait.src = root + data.portrait.trim();
          }
          setTextAlt(portrait, data.portrait_alt);
        }
      }
      if (isCredits) {
        setText(document.querySelector('.credits-page h1'), data.page_title);
        const groups = [
          ['creative', 0], ['code', 1], ['cms', 2],
          ['translation', 3], ['source', 4]
        ];
        const rows = isCredits.querySelectorAll('.credit-row');
        groups.forEach(([name, index]) => {
          const row = rows[index];
          if (!row) return;
          setText(row.querySelector('h2'), data[name + '_heading']);
          const paragraph = row.querySelector('p');
          const value = data[name + '_text'];
          if (paragraph && typeof value === 'string' && value.trim()) {
            if (window.SDL && typeof window.SDL.renderMarkdown === 'function') {
              window.SDL.renderMarkdown(paragraph, value);
            } else {
              paragraph.textContent = value;
            }
          }
        });
      }
    })
    .catch(() => { /* Retain readable, translated HTML while files publish. */ });

  function setTextAlt(image, value) {
    if (typeof value === 'string' && value.trim()) image.alt = value;
  }
})();

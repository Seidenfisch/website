/* SDL language support. English files and content remain the source of truth. */
(() => {
  const language = document.documentElement.dataset.sdlLang || 'en';
  const root = document.documentElement.dataset.assetRoot || '';
  const translations = {
    de: {
      'Bicycles':'Fahrräder','Keyboards':'Tastaturen','Lamps':'Leuchten',
      ' image':' Bild',' images':' Bilder',' photograph':' Foto',' photographs':' Fotos',
      'Project not found.':'Projekt nicht gefunden.',
      '← Back to all projects':'← Zurück zu allen Projekten',
      '← All projects':'← Alle Projekte','Next: ':'Weiter: ',
      'Details':'Details','Overview':'Überblick','Date / period':'Datum / Zeitraum',
      'Category':'Kategorie','Status / whereabouts':'Status / Verbleib',
      'Materials':'Materialien','Fabrication methods':'Fertigungsmethoden',
      'About this project':'Über dieses Projekt','View ':'Bild ansehen: ',' image ':' – Bild ',' enlarged':' vergrößert',
      'Project content could not be loaded. Please refresh the page.':'Projektinhalte konnten nicht geladen werden. Bitte die Seite neu laden.',
      'Type':'Art','To be added':'Noch offen'
    },
    ja: {
      'Bicycles':'自転車','Keyboards':'キーボード','Lamps':'照明',
      ' image':' 枚の画像',' images':' 枚の画像',' photograph':' 枚の写真',' photographs':' 枚の写真',
      'Project not found.':'プロジェクトが見つかりません。',
      '← Back to all projects':'← すべての作品へ戻る',
      '← All projects':'← すべての作品','Next: ':'次の作品：',
      'Details':'詳細','Overview':'概要','Date / period':'日付／期間',
      'Category':'カテゴリー','Status / whereabouts':'状況／所在',
      'Materials':'素材','Fabrication methods':'製作方法',
      'About this project':'このプロジェクトについて','View ':'閲覧：',' image ':' 写真 ',' enlarged':' を拡大',
      'Project content could not be loaded. Please refresh the page.':'作品を読み込めませんでした。ページを更新してください。',
      'Type':'種類','To be added':'未入力'
    },
    fr: {
      'Bicycles':'Vélos','Keyboards':'Claviers','Lamps':'Luminaires',
      ' image':' image',' images':' images',' photograph':' photo',' photographs':' photos',
      'Project not found.':'Projet introuvable.',
      '← Back to all projects':'← Retour aux projets',
      '← All projects':'← Tous les projets','Next: ':'Suivant : ',
      'Details':'Détails','Overview':'Présentation','Date / period':'Date / période',
      'Category':'Catégorie','Status / whereabouts':'Statut / localisation',
      'Materials':'Matériaux','Fabrication methods':'Méthodes de fabrication',
      'About this project':'À propos du projet','View ':'Voir : ',' image ':' – image ',' enlarged':' en grand',
      'Project content could not be loaded. Please refresh the page.':'Impossible de charger les projets. Veuillez actualiser la page.',
      'Type':'Type','To be added':'À compléter'
    }
  };
  // A deliberately small Markdown subset for editable CMS text.
  // DOM nodes and protocol-checked links keep HTML from CMS content inert.
  const renderMarkdown = (element, source) => {
    const text = String(source || '').replace(/\r\n?/g, '\n');
    const token = /\[([^\]\n]+)\]\(|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\n/g;
    element.replaceChildren();
    let cursor = 0;
    let match;
    while ((match = token.exec(text)) !== null) {
      if (match.index > cursor) element.append(document.createTextNode(text.slice(cursor, match.index)));
      if (match[1] !== undefined) {
        // Count URL parentheses: Wikipedia URLs commonly end in a closing ')'.
        let end = token.lastIndex;
        let depth = 1;
        for (; end < text.length; end++) {
          if (text[end] === '\n') break;
          if (text[end] === '(') depth++;
          if (text[end] === ')' && --depth === 0) break;
        }
        const url = text.slice(token.lastIndex, end);
        if (depth === 0 && /^(https?:\/\/|mailto:)[^\s<>]+$/i.test(url)) {
          const link = document.createElement('a');
          link.href = url;
          link.textContent = match[1];
          if (/^https?:\/\//i.test(url)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          element.append(link);
          token.lastIndex = end + 1;
        } else {
          element.append(document.createTextNode(match[0]));
        }
      } else if (match[2] !== undefined || match[3] !== undefined) {
        const emphasis = document.createElement(match[2] !== undefined ? 'strong' : 'em');
        emphasis.textContent = match[2] ?? match[3];
        element.append(emphasis);
      } else {
        element.append(document.createElement('br'));
      }
      cursor = token.lastIndex;
    }
    if (cursor < text.length) element.append(document.createTextNode(text.slice(cursor)));
  };
  window.SDL = {
    language, root, renderMarkdown,
    t: key => (translations[language] && translations[language][key]) || key
  };
  document.addEventListener('DOMContentLoaded', () => {
    // Turn the existing crawlable language links into one accessible dropdown.
    document.querySelectorAll('.lang-switch').forEach(nav => {
      const links = [...nav.querySelectorAll('a')];
      if (!links.length) return;
      links.forEach(link => {
        // Preserve project IDs, query parameters and anchors when switching.
        const url = new URL(link.getAttribute('href'), location.href);
        url.search = location.search;
        url.hash = location.hash;
        link.href = url.href;
      });
      const current = links.find(link => link.hasAttribute('aria-current')) || links[0];
      const menu = document.createElement('details');
      menu.className = 'language-menu';
      const trigger = document.createElement('summary');
      const currentLabel = current.textContent.trim();
      trigger.textContent = currentLabel;
      trigger.setAttribute('aria-label', 'Choose language; current: ' + currentLabel);
      const options = document.createElement('div');
      options.className = 'language-options';
      options.append(...links);
      menu.append(trigger, options);
      nav.replaceChildren(menu);
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.open) {
          menu.open = false;
          trigger.focus();
        }
      });
      document.addEventListener('click', event => {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
    });
  });
})();

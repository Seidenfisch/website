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
    const token = /\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\n/g;
    element.replaceChildren();
    let cursor = 0;
    for (const match of text.matchAll(token)) {
      if (match.index > cursor) element.append(document.createTextNode(text.slice(cursor, match.index)));
      if (match[1] !== undefined) {
        const link = document.createElement('a');
        link.href = match[2];
        link.textContent = match[1];
        if (/^https?:\/\//i.test(match[2])) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        element.append(link);
      } else if (match[3] !== undefined || match[4] !== undefined) {
        const emphasis = document.createElement(match[3] !== undefined ? 'strong' : 'em');
        emphasis.textContent = match[3] ?? match[4];
        element.append(emphasis);
      } else {
        element.append(document.createElement('br'));
      }
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) element.append(document.createTextNode(text.slice(cursor)));
  };
  window.SDL = {
    language, root, renderMarkdown,
    t: key => (translations[language] && translations[language][key]) || key
  };
  document.addEventListener('DOMContentLoaded', () => {
    // Preserve the project id and any anchor when switching language.
    document.querySelectorAll('.lang-switch a').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.href);
      url.search = location.search;
      url.hash = location.hash;
      link.href = url.href;
    });
  });
})();

/* Seiden Design Labs project archive — images hosted in this repository */
// Project content is edited in Pages CMS and stored in content/projects.json.

const displayCategory = {bicycles:'Bicycles',keyboards:'Keyboards',lamps:'Lamps'};
const encodedPath = filename => encodeURI(filename.replace(/^\/+/, '')).replaceAll('#','%23');
const filenameLabel = filename => filename.replace(/\s*\((Bicycle|Keyboard|Lamp)\)\.[^.]+$/i,'').replace(/\.[^.]+$/,'').replace(/\s*\d+$/,'').trim();

async function initializeProjectPages() {
  const featured = document.getElementById('featured-project-grid');
  const archiveTarget = document.getElementById('project-grid');
  const detailTarget = document.getElementById('project-detail');
  if (!featured && !archiveTarget && !detailTarget) return;

  const response = await fetch('content/projects.json', {cache:'no-store'});
  if (!response.ok) throw new Error('Project content could not be fetched (' + response.status + ')');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Project content is not a list');
  const projects = data.filter(p => p && p.id && p.title && displayCategory[p.category] && Array.isArray(p.images) && p.images.length);

  if (featured) {
    featured.querySelectorAll('a.project-card').forEach(link => {
      const project = projects.find(p => p.id === new URL(link.href).searchParams.get('id'));
      if (!project) return;
      const image = link.querySelector('.project-photo img');
      const heading = link.querySelector('.project-meta h3');
      const category = link.querySelector('.project-meta p');
      if (image) { image.src = encodedPath(project.images[0]); image.alt = project.title + ' — project cover'; }
      if (heading) heading.textContent = project.title;
      if (category) category.textContent = displayCategory[project.category];
    });
  }

const archive = document.getElementById('project-grid');
if (archive) {
  const renderArchive = filter => {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    archive.replaceChildren();
    for (const project of filtered) {
      const link = document.createElement('a');
      link.className = 'archive-card';
      link.href = 'project.html?id=' + encodeURIComponent(project.id);
      const photo = document.createElement('div');
      photo.className = 'archive-photo';
      const img = document.createElement('img');
      img.src = encodedPath(project.images[0]);
      img.alt = project.title + ' — project cover';
      img.loading = 'lazy';
      photo.append(img);
      const arrow = document.createElement('span');
      arrow.className = 'project-visit';
      arrow.textContent = '↗';
      photo.append(arrow);
      const info = document.createElement('div');
      info.className = 'archive-meta';
      const title = document.createElement('h2');
      title.textContent = project.title;
      const category = document.createElement('p');
      category.textContent = displayCategory[project.category] + ' / ' + project.images.length + (project.images.length === 1 ? ' image' : ' images');
      info.append(title,category);
      link.append(photo,info);
      archive.append(link);
    }
  };
  const count = document.getElementById('count-all');
  if (count) count.textContent = '(' + projects.length + ')';
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => {
        b.classList.toggle('is-active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
      });
      renderArchive(button.dataset.filter);
    });
  });
  renderArchive('all');
}

const detail = document.getElementById('project-detail');
if (detail) {
  const params = new URLSearchParams(location.search);
  const project = projects.find(p => p.id === params.get('id'));
  if (!project) {
    const heading = document.createElement('h1');
    heading.textContent = 'Project not found.';
    const link = document.createElement('a');
    link.href = 'photos.html';
    link.className = 'text-link';
    link.textContent = '← Back to all projects';
    detail.append(heading,link);
  } else {
    document.title = project.title + ' — Seiden Design Labs';
    const heading = document.createElement('h1');
    heading.textContent = project.title;
    const subtitle = document.createElement('p');
    subtitle.className = 'intro-copy';
    subtitle.textContent = project.images.length + (project.images.length === 1 ? ' photograph' : ' photographs') + ' · ' + displayCategory[project.category];
    detail.append(heading,subtitle);
    const descriptionPanel = document.createElement('section');
    descriptionPanel.className = 'project-description';
    descriptionPanel.setAttribute('aria-label', 'About this project');
    const contextHeading = document.createElement('h2');
    contextHeading.textContent = 'Context';
    const metadataTable = document.createElement('table');
    metadataTable.className = 'context-metadata';
    const metadataBody = document.createElement('tbody');
    const metadataRows = [
      ['Date / period', project.period],
      ['Category', displayCategory[project.category]],
      ['Status / whereabouts', project.status]
    ];
    for (const [label, value] of metadataRows) {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = label;
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(heading, cell);
      metadataBody.append(row);
    }
    metadataTable.append(metadataBody);
    const descriptionText = document.createElement('p');
    descriptionText.textContent = project.description;
    descriptionPanel.append(contextHeading, metadataTable, descriptionText);
    detail.append(descriptionPanel);
    const gallery = document.createElement('div');
    gallery.className = 'detail-gallery';
    project.images.forEach((filename,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'detail-image';
      button.setAttribute('aria-label','View ' + project.title + ' image ' + (index+1) + ' enlarged');
      const img = document.createElement('img');
      img.src = encodedPath(filename);
      img.alt = project.title + ' — ' + filenameLabel(filename);
      img.loading = index ? 'lazy' : 'eager';
      const caption = document.createElement('span');
      caption.textContent = String(index+1).padStart(2,'0') + ' / ' + String(project.images.length).padStart(2,'0');
      button.append(img,caption);
      button.addEventListener('click', () => openViewer(index));
      gallery.append(button);
    });
    detail.append(gallery);
    const nav = document.createElement('div');
    nav.className = 'detail-nav';
    const back = document.createElement('a');
    back.href = 'photos.html';
    back.className = 'text-link';
    back.textContent = '← All projects';
    const nextProject = projects[(projects.indexOf(project)+1) % projects.length];
    const next = document.createElement('a');
    next.className = 'text-link';
    next.href = 'project.html?id=' + encodeURIComponent(nextProject.id);
    next.textContent = 'Next: ' + nextProject.title + ' ↗';
    nav.append(back,next);
    detail.append(nav);

    const viewer = document.getElementById('gallery-dialog');
    const viewerImage = document.getElementById('gallery-image');
    const viewerCount = document.getElementById('gallery-count');
    const viewerTitle = document.getElementById('gallery-title');
    const prev = document.getElementById('gallery-prev');
    const nextButton = document.getElementById('gallery-next');
    let current = 0;
    function updateViewer() {
      const filename = project.images[current];
      viewerImage.src = encodedPath(filename);
      viewerImage.alt = project.title + ' — ' + filenameLabel(filename);
      viewerCount.textContent = (current+1) + ' / ' + project.images.length;
      viewerTitle.textContent = project.title;
      prev.disabled = nextButton.disabled = project.images.length < 2;
    }
    function openViewer(index) {current = index;updateViewer();viewer.showModal();}
    function move(delta) {current = (current + delta + project.images.length) % project.images.length;updateViewer();}
    prev.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));
    document.getElementById('gallery-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => {if(event.target === viewer) viewer.close();});
    viewer.addEventListener('keydown', event => {
      if(event.key === 'ArrowLeft'){event.preventDefault();move(-1);}
      if(event.key === 'ArrowRight'){event.preventDefault();move(1);}
    });
  }
}

}
initializeProjectPages().catch(error => {
  console.error('Unable to load project content:', error);
  const target = document.getElementById('project-grid') || document.getElementById('project-detail');
  if (target) {
    const notice = document.createElement('p');
    notice.className = 'intro-copy';
    notice.textContent = 'Project content could not be loaded. Please refresh the page.';
    target.replaceChildren(notice);
  }
});

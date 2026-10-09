/* Seiden Design Labs project archive — images hosted in this repository */
const projects = [
  {id:'brechschnell',title:'Brechschnell',category:'bicycles',period:'To be added',status:'To be added',description:"A bicycle project focused on clean lines and details.",images:['Brechschnell (Bicycle).JPEG','Brechschnell 2 (Bicycle).JPEG','Brechschnell 3 (Bicycle).JPEG']},
  {id:'miami-cruise',title:'Miami Cruise',category:'bicycles',period:'To be added',status:'To be added',description:"A bicycle project captured from several angles.",images:['Miami Cruise (Bicycle).JPEG','Miami Cruise 2 (Bicycle).JPEG','Miami Cruise 3 (Bicycle).JPEG','Miami Cruise 4 (Bicycle).JPEG']},
  {id:'red-road',title:'Red Road',category:'bicycles',period:'To be added',status:'To be added',description:"A road bicycle with a focus on its finish and details.",images:['Red Road (Bicycle).JPEG','Red Road Paint Close-Up (Bicycle).JPEG']},
  {id:'villiger-arrow',title:'Villiger Arrow',category:'bicycles',period:'To be added',status:'To be added',description:"A closer look at Villiger Arrow and its drivetrain.",images:['Villiger Arrow Prestige Shot (Bicycle).JPEG','Villiger Arrow Drivetrain Close Up (Bicycle).JPEG']},
  {id:'aek-ii',title:'AEK II',category:'keyboards',period:'To be added',status:'To be added',description:"An AEK II keyboard build, from handwiring to final assembly.",images:['AEK II Final Product Prestige Shot (Keyboard).JPG','AEK II Finished Product Double Spread (Keyboard).jpg','AEK II Assembly 1 Double Spread (Keyboard).jpg','AEK II Assembly 2 Double Spread (Keyboard).jpg','AEK II Bunny Ears (Keyboard).jpg','AEK II Handwiring (Keyboard).JPG']},
  {id:'poorpad',title:'PoorPad Prototype',category:'keyboards',period:'To be added',status:'To be added',description:"A compact keyboard prototype with an acrylic-case experiment.",images:['PoorPad Prototype 1 (Keyboard).jpg','PoorPad Prototype 2 (Keyboard).jpg','PoorPad Acrylic Case Protoype (Keyboard).jpg']},
  {id:'printkeeb',title:'PrintKeeb',category:'keyboards',period:'To be added',status:'To be added',description:"Assembly views from the PrintKeeb keyboard project.",images:['PrintKeeb Assembly 1 (Keyboard).jpg','PrintKeeb Assembly 2 (Keyboard).jpg']},
  {id:'speedpad',title:'SpeedPad',category:'keyboards',period:'To be added',status:'To be added',description:"A keyboard project exploring electronics and layout.",images:['SpeedPad Electronics (Keyboard).jpg','SpeedPad Keycapless (Keyboard).jpg']},
  {id:'tada68-numpad',title:'Tada68 Numpad',category:'keyboards',period:'To be added',status:'To be added',description:"A custom numpad, shown from prototype to finished form.",images:['Tada68 Numpad Prestige Shot (Keyboard).jpg','Tada68 Numpad Side View(Keyboard).jpg','Tada68 Numpad Raw Case (Keyboard).jpg']},
  {id:'woodboard',title:'WoodBoard',category:'keyboards',period:'To be added',status:'To be added',description:"A keyboard project exploring form and materials.",images:['WoodBoard (Keyboard).jpg','WoodBoard CloseUp (Keyboard).jpg']},
  {id:'relamp',title:'ReLamp',category:'lamps',period:'To be added',status:'To be added',description:"A lighting project shown through assembly and testing.",images:['ReLamp Action Shot (Lamp).jpg','ReLamp AssemblyTesting (Lamp).jpg']},
  {id:'rotolamp',title:'RotoLamp',category:'lamps',period:'To be added',status:'To be added',description:"A lamp project explored through its shape and presentation.",images:['RotoLamp Action Shot (Lamp).jpg','RotoLamp (Lamp).jpg','RotoLamp Side View (Lamp).JPG']}
];
// Edit each project's period and status above to fill in the context table.
const displayCategory = {bicycles:'Bicycles',keyboards:'Keyboards',lamps:'Lamps'};
const encodedPath = filename => encodeURI(filename).replaceAll('#','%23');
const filenameLabel = filename => filename.replace(/\s*\((Bicycle|Keyboard|Lamp)\)\.[^.]+$/i,'').replace(/\.[^.]+$/,'').replace(/\s*\d+$/,'').trim();

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

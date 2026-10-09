/* Seiden Design Labs project archive — images hosted in this repository */
const projects = [
  {id:'brechschnell',title:'Brechschnell',category:'bicycles',description:"A collection of photographs exploring the shape, lines, and details of Brechschnell. More about the concept, components, and process will be added here.",images:['Brechschnell (Bicycle).JPEG','Brechschnell 2 (Bicycle).JPEG','Brechschnell 3 (Bicycle).JPEG']},
  {id:'miami-cruise',title:'Miami Cruise',category:'bicycles',description:"A closer look at Miami Cruise, from its overall silhouette to the smaller visual details. This space will later cover the story behind the project.",images:['Miami Cruise (Bicycle).JPEG','Miami Cruise 2 (Bicycle).JPEG','Miami Cruise 3 (Bicycle).JPEG','Miami Cruise 4 (Bicycle).JPEG']},
  {id:'red-road',title:'Red Road',category:'bicycles',description:"Red Road through a series of views and close-ups, including the finish. Notes on the design decisions and build process are coming soon.",images:['Red Road (Bicycle).JPEG','Red Road Paint Close-Up (Bicycle).JPEG']},
  {id:'villiger-arrow',title:'Villiger Arrow',category:'bicycles',description:"Selected photographs of Villiger Arrow, highlighting the bicycle and its drivetrain details. Background information and specifications will follow.",images:['Villiger Arrow Prestige Shot (Bicycle).JPEG','Villiger Arrow Drivetrain Close Up (Bicycle).JPEG']},
  {id:'aek-ii',title:'AEK II',category:'keyboards',description:"A visual record of the AEK II keyboard project, from assembly and handwiring to the finished result. A more detailed build log will be added here.",images:['AEK II Final Product Prestige Shot (Keyboard).JPG','AEK II Finished Product Double Spread (Keyboard).jpg','AEK II Assembly 1 Double Spread (Keyboard).jpg','AEK II Assembly 2 Double Spread (Keyboard).jpg','AEK II Bunny Ears (Keyboard).jpg','AEK II Handwiring (Keyboard).JPG']},
  {id:'poorpad',title:'PoorPad Prototype',category:'keyboards',description:"Early views of the PoorPad prototype. This description will eventually document the idea, iterations, and lessons from the prototype.",images:['PoorPad Prototype 1 (Keyboard).jpg','PoorPad Prototype 2 (Keyboard).jpg']},
  {id:'printkeeb',title:'PrintKeeb',category:'keyboards',description:"Assembly photographs from the PrintKeeb project. More detail about the design, parts, and development process will be added here.",images:['PrintKeeb Assembly 1 (Keyboard).jpg','PrintKeeb Assembly 2 (Keyboard).jpg']},
  {id:'speedpad',title:'SpeedPad',category:'keyboards',description:"A closer look at SpeedPad, including the electronics and the keycapless layout. The technical details and project story will be filled in later.",images:['SpeedPad Electronics (Keyboard).jpg','SpeedPad Keycapless (Keyboard).jpg']},
  {id:'tada68-numpad',title:'Tada68 Numpad',category:'keyboards',description:"A look at the raw case for the Tada68 Numpad. Future notes will cover the design approach and the steps toward the completed build.",images:['Tada68 Numpad Raw Case (Keyboard).jpg']},
  {id:'woodboard',title:'WoodBoard',category:'keyboards',description:"WoodBoard and its details in photographs. This section will later describe the materials, design choices, and making process.",images:['WoodBoard (Keyboard).jpg','WoodBoard CloseUp (Keyboard).jpg']},
  {id:'relamp',title:'ReLamp',category:'lamps',description:"A small gallery of ReLamp, including a view of assembly and testing. A full description of the idea and development will be added soon.",images:['ReLamp Action Shot (Lamp).jpg','ReLamp AssemblyTesting (Lamp).jpg']},
  {id:'rotolamp',title:'RotoLamp',category:'lamps',description:"Several angles of RotoLamp, showing the object in context and from the side. Further notes on its concept and construction are coming soon.",images:['RotoLamp Action Shot (Lamp).jpg','RotoLamp (Lamp).jpg','RotoLamp Side View (Lamp).JPG']}
];
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
    const eyebrow = document.createElement('p');
    eyebrow.className = 'kicker';
    eyebrow.textContent = displayCategory[project.category] + ' / Project archive';
    const heading = document.createElement('h1');
    heading.textContent = project.title;
    const subtitle = document.createElement('p');
    subtitle.className = 'intro-copy';
    subtitle.textContent = project.images.length + (project.images.length === 1 ? ' photograph' : ' photographs') + ' · ' + displayCategory[project.category];
    detail.append(eyebrow,heading,subtitle);
    const descriptionPanel = document.createElement('section');
    descriptionPanel.className = 'project-description';
    descriptionPanel.setAttribute('aria-label', 'About this project');
    const descriptionHeading = document.createElement('h2');
    descriptionHeading.textContent = 'About the project';
    const descriptionText = document.createElement('p');
    descriptionText.textContent = project.description;
    const draftLabel = document.createElement('span');
    draftLabel.className = 'description-draft';
    draftLabel.textContent = 'Draft description';
    descriptionPanel.append(descriptionHeading,descriptionText,draftLabel);
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

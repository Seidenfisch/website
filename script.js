// Gallery behavior is scoped to the Work page; other pages need no JavaScript.
const galleries = {
  bike1: {
    title: 'Custom Road Bike',
    images: [
      'https://i.imgur.com/SmQ76BE.jpeg',
      'https://i.imgur.com/NAGfVSA.jpeg',
      'https://i.imgur.com/yisIElY.jpeg',
      'https://i.imgur.com/DjQNilg.jpeg',
      'https://i.imgur.com/h52SC4k.jpeg'
    ]
  },
  bike2: {
    title: 'Vintage Gravel Bike',
    images: ['https://i.imgur.com/TGrDQMS.jpeg']
  }
};

const dialog = document.getElementById('gallery-dialog');
if (dialog) {
  const image = document.getElementById('gallery-image');
  const title = document.getElementById('gallery-title');
  const count = document.getElementById('gallery-count');
  const previous = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');
  const close = document.getElementById('gallery-close');
  let active = null;
  let index = 0;

  function render() {
    if (!active) return;
    const images = active.images;
    image.src = images[index];
    image.alt = active.title + ' — image ' + (index + 1) + ' of ' + images.length;
    title.textContent = active.title;
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
    previous.disabled = next.disabled = images.length < 2;
  }

  function move(delta) {
    if (!active) return;
    index = (index + delta + active.images.length) % active.images.length;
    render();
  }

  document.querySelectorAll('[data-gallery]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      active = galleries[trigger.dataset.gallery];
      if (!active) return;
      index = 0;
      render();
      dialog.showModal();
    });
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
}

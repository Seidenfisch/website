const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
});

// Advanced Lightbox Gallery with Navigation

const galleries = {
  bike1: [
    'https://i.imgur.com/SmQ76BE.jpeg',
    'https://i.imgur.com/SmQ76BE.jpeg', // Same images for demo
    'https://i.imgur.com/SmQ76BE.jpeg'
  ],
  bike2: [
    'https://i.imgur.com/TGrDQMS.jpeg',
    'https://i.imgur.com/TGrDQMS.jpeg',
    'https://i.imgur.com/TGrDQMS.jpeg'
  ],
};

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const galleryName = tile.dataset.gallery;
    const images = galleries[galleryName];
    let currentIndex = 0;

    const showImage = (index) => {
      return \`
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <img src="\${images[index]}" style="max-width: 90vw; max-height: 90vh;">
          <div style="margin-top: 10px;">
            <button id="prev-button" style="margin-right: 10px;">⬅️ Prev</button>
            <button id="next-button">Next ➡️</button>
          </div>
        </div>
      \`;
    };

    let instance = basicLightbox.create(showImage(currentIndex), {
      onShow: (instance) => {
        instance.element().querySelector('#prev-button').onclick = () => {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          instance.element().innerHTML = showImage(currentIndex);
          instance.element().querySelector('#prev-button').onclick = instance.options.onShow(instance);
          instance.element().querySelector('#next-button').onclick = instance.options.onShow(instance);
        };
        instance.element().querySelector('#next-button').onclick = () => {
          currentIndex = (currentIndex + 1) % images.length;
          instance.element().innerHTML = showImage(currentIndex);
          instance.element().querySelector('#prev-button').onclick = instance.options.onShow(instance);
          instance.element().querySelector('#next-button').onclick = instance.options.onShow(instance);
        };
      }
    });

    instance.show();
  });
});

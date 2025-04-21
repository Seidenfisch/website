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

// Lightbox Gallery with Titles

const galleries = {
  bike1: {
    title: "Custom Road Bike",
    images: [
      'https://i.imgur.com/SmQ76BE.jpeg',
      'https://i.imgur.com/SmQ76BE.jpeg',
      'https://i.imgur.com/SmQ76BE.jpeg'
    ]
  },
  bike2: {
    title: "Vintage Gravel Bike",
    images: [
      'https://i.imgur.com/TGrDQMS.jpeg',
      'https://i.imgur.com/TGrDQMS.jpeg',
      'https://i.imgur.com/TGrDQMS.jpeg'
    ]
  }
};

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const galleryName = tile.dataset.gallery;
    const { title, images } = galleries[galleryName];
    let currentIndex = 0;

    const instance = basicLightbox.create(`
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <h2 style="margin-bottom: 10px;">${title}</h2>
        <img id="lightbox-image" src="${images[currentIndex]}" style="max-width: 90vw; max-height: 80vh;">
        <div style="margin-top: 10px;">
          <button id="prev-button" style="margin-right: 10px;">⬅️ Prev</button>
          <button id="next-button">Next ➡️</button>
        </div>
      </div>
    `);

    instance.show();

    setTimeout(() => {
      const updateImage = () => {
        const img = instance.element().querySelector('#lightbox-image');
        img.src = images[currentIndex];
      };

      instance.element().querySelector('#prev-button').onclick = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
      };

      instance.element().querySelector('#next-button').onclick = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
      };
    }, 100);
  });
});

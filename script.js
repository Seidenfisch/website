const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close');
const spinner = document.getElementById('spinner');
const galleryImages = document.querySelectorAll('.gallery-img');
const modalCaption = document.getElementById('caption');
const themeToggle = document.getElementById('theme-toggle');
const thumbnailsContainer = document.getElementById('thumbnails');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

let currentIndex = 0;

// Theme preference
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

function preloadImage(index) {
  const img = new Image();
  img.src = galleryImages[index].src;
}

galleryImages.forEach((img, index) => {
  const thumb = document.createElement('img');
  thumb.src = img.src;
  thumb.alt = img.alt;
  thumb.addEventListener('click', () => {
    currentIndex = index;
    switchImage(currentIndex);
    highlightThumbnail();
  });
  thumbnailsContainer.appendChild(thumb);

  img.addEventListener('click', () => {
    openModal(index);
  });
});

function openModal(index) {
  modal.style.display = 'block';
  spinner.style.display = 'block';
  modalImg.style.display = 'none';
  currentIndex = index;
  modalImg.src = galleryImages[currentIndex].src;
  modalCaption.textContent = galleryImages[currentIndex].alt;
  highlightThumbnail();
  modal.classList.add('fade-in');
  preloadImage((currentIndex + 1) % galleryImages.length);
  preloadImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
}

modalImg.onload = () => {
  spinner.style.display = 'none';
  modalImg.style.display = 'block';
};

function switchImage(newIndex) {
  modalImg.classList.add('hidden');
  setTimeout(() => {
    modalImg.src = galleryImages[newIndex].src;
    modalCaption.textContent = galleryImages[newIndex].alt;
    modalImg.classList.remove('hidden');
    highlightThumbnail();
  }, 300);
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  switchImage(currentIndex);
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  switchImage(currentIndex);
});

function highlightThumbnail() {
  const thumbs = document.querySelectorAll('.thumbnails img');
  thumbs.forEach((thumb, index) => {
    if (index === currentIndex) {
      thumb.classList.add('active');
    } else {
      thumb.classList.remove('active');
    }
  });
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove('fade-in');
  modal.classList.add('fade-out');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
  }, 300);
}

document.addEventListener('keydown', (e) => {
  if (modal.style.display === 'block') {
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      switchImage(currentIndex);
    } else if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      switchImage(currentIndex);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }
});
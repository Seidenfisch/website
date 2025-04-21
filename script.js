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


document.querySelectorAll('.tile img').forEach(img => {
  img.addEventListener('click', () => {
    const instance = basicLightbox.create(`
      <img src="${img.dataset.full}" alt="${img.alt}" style="max-width: 90vw; max-height: 90vh;">
    `);
    instance.show();
  });
});

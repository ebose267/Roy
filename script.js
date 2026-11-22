(() => {
  const grid = document.getElementById('galleryGrid');
  const cards = Array.from(grid.querySelectorAll('.art-card'));
  const filters = Array.from(document.querySelectorAll('.filter-chip'));
  const searchInput = document.getElementById('searchInput');
  const countLabel = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');
  const resetButton = document.getElementById('resetFilters');
  const shuffleButton = document.getElementById('shuffleButton');
  const dialog = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLabel = document.getElementById('lightboxLabel');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const closeButton = document.getElementById('closeLightbox');
  const previousButton = document.getElementById('previousCard');
  const nextButton = document.getElementById('nextCard');

  let activeFilter = 'all';
  let visibleCards = [...cards];
  let activeIndex = 0;
  let shuffleCount = 0;

  function updateGallery() {
    const query = searchInput.value.trim().toLowerCase();
    visibleCards = cards.filter((card) => {
      const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
      const text = `${card.dataset.title} ${card.dataset.description} ${card.dataset.label}`.toLowerCase();
      const queryMatches = !query || text.includes(query);
      const show = categoryMatches && queryMatches;
      card.hidden = !show;
      return show;
    });

    countLabel.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'THING' : 'THINGS'} / ${activeFilter === 'all' ? 'IN NO PARTICULAR ORDER' : activeFilter.toUpperCase()}`;
    emptyState.hidden = visibleCards.length !== 0;
  }

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('is-active'));
      filter.classList.add('is-active');
      activeFilter = filter.dataset.filter;
      updateGallery();
    });
  });

  searchInput.addEventListener('input', updateGallery);
  resetButton.addEventListener('click', () => {
    activeFilter = 'all';
    searchInput.value = '';
    filters.forEach((item) => item.classList.toggle('is-active', item.dataset.filter === 'all'));
    updateGallery();
  });

  shuffleButton.addEventListener('click', () => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.forEach((card) => grid.appendChild(card));
    shuffleCount += 1;
    shuffleButton.innerHTML = `<span class="shuffle-symbol">⤨</span> Shuffled ×${shuffleCount}`;
    updateGallery();
  });

  function showCard(card) {
    if (!card) return;
    activeIndex = visibleCards.indexOf(card);
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.querySelector('img').alt;
    lightboxTitle.textContent = card.dataset.title;
    lightboxLabel.textContent = card.dataset.label;
    lightboxDescription.textContent = card.dataset.description;
    if (!dialog.open) dialog.showModal();
  }

  function moveLightbox(direction) {
    if (!visibleCards.length) return;
    activeIndex = (activeIndex + direction + visibleCards.length) % visibleCards.length;
    showCard(visibleCards[activeIndex]);
  }

  cards.forEach((card) => card.addEventListener('click', () => showCard(card)));
  closeButton.addEventListener('click', () => dialog.close());
  previousButton.addEventListener('click', () => moveLightbox(-1));
  nextButton.addEventListener('click', () => moveLightbox(1));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') moveLightbox(1);
    if (event.key === 'ArrowLeft') moveLightbox(-1);
  });

  updateGallery();
})();

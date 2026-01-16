// JS for modal, FAQ accordion, etc.

// Modal logic
const tourBtn = document.getElementById('tourBtn');
const tourModal = document.getElementById('tourModal');
const closeTourBtn = document.getElementById('closeTourBtn');
tourBtn && tourBtn.addEventListener('click', () => tourModal.style.display = 'flex');
closeTourBtn && closeTourBtn.addEventListener('click', () => tourModal.style.display = 'none');
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') tourModal.style.display = 'none';
});

// FAQ accordion logic
// Add your FAQ HTML and JS here for full interactivity

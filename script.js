// ClubConnect JS: Modal, FAQ, etc.
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
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach((btn, idx) => {
  btn.addEventListener('click', function() {
    faqQuestions.forEach((b, i) => {
      b.classList.toggle('active', i === idx ? !b.classList.contains('active') : false);
      document.querySelectorAll('.faq-answer')[i].classList.toggle('open', i === idx ? !document.querySelectorAll('.faq-answer')[i].classList.contains('open') : false);
    });
  });
});

  // === SEU CÓDIGO ATUAL: Scroll Highlighter ===
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// === CÓDIGO NOVO: Menu Hambúrguer Mobile ===
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinksContainer = document.getElementById('nav-links');

// Abre e fecha o menu ao clicar no botão
hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

// Fecha o menu lateral automaticamente ao clicar em qualquer link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});
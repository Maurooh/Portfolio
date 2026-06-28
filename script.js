// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// Contact form — envia via Formspree
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      note.textContent = 'Mensagem enviada! Entrarei em contato em breve.';
      note.style.color = '#10b981';
      form.reset();
    } else {
      note.textContent = 'Erro ao enviar. Tente novamente.';
      note.style.color = '#ef4444';
    }
  } catch {
    note.textContent = 'Erro de conexão. Tente novamente.';
    note.style.color = '#ef4444';
  }

  btn.disabled = false;
  btn.textContent = 'Enviar mensagem';
  setTimeout(() => { note.textContent = ''; }, 5000);
});

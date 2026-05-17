/* =============================================
   MAIN.JS — Agent Web Agency
   ============================================= */

const WA_NUMBER = '51933863899';
const WA_MSG    = encodeURIComponent('Hola Agent, vi tu web y me interesa tener una página web para mi negocio en Chiclayo. ¿Me puedes dar más información?');
const WA_URL    = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

// ── Navbar scroll ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Menú móvil ────────────────────────────────
const toggle   = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── WhatsApp links dinámicos ───────────────────
document.querySelectorAll('[data-wa]').forEach(el => {
  el.setAttribute('href', WA_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener noreferrer');
});

// ── Scroll reveal ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Formulario ─────────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = form.querySelector('.btn-submit');
    const name  = form.querySelector('[name="nombre"]').value.trim();
    const biz   = form.querySelector('[name="negocio"]').value.trim();
    const phone = form.querySelector('[name="telefono"]').value.trim();
    const type  = form.querySelector('[name="tipo"]').value;

    btn.textContent = 'Enviando…';
    btn.disabled = true;

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });

      if (res.ok) {
        // Enviar también por WhatsApp con datos pre-llenados
        const customMsg = encodeURIComponent(
          `Hola Agent! Me llamo ${name}, tengo un negocio de ${biz} en Chiclayo y me interesa una ${type}. Mi teléfono es ${phone}.`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${customMsg}`, '_blank');
        form.reset();
        showToast('✅ ¡Mensaje enviado! Te contactaremos pronto.');
      } else {
        throw new Error('Error al enviar');
      }
    } catch {
      showToast('❌ Hubo un error. Escríbenos por WhatsApp directamente.', true);
    } finally {
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
    }
  });
}

// ── Toast notification ────────────────────────
function showToast(msg, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:${isError ? '#e74c3c' : '#111320'}; color:#fff;
    border:1px solid ${isError ? 'rgba(231,76,60,0.4)' : 'rgba(108,99,255,0.4)'};
    padding:0.85rem 1.5rem; border-radius:9999px;
    font-size:0.875rem; font-weight:500; z-index:9999;
    box-shadow:0 4px 24px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease;
  `;
  document.head.insertAdjacentHTML('beforeend', `<style>@keyframes toastIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}</style>`);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Año dinámico en footer ────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Header scroll state =====
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    })
);

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll(
    '.card, .project, .projects-totals, .step, .section-head, .benefits-content, .benefits-visual, .cta-form, .cta-text'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(i % 3) * 80}ms`;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('.num[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const startTime = performance.now();
        const tick = (now) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// ===== Projects: totals + filters =====
const projects = [...document.querySelectorAll('.project')];
const fmt = (n, decimals = 0) =>
    n.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: true });
const sum = (key) => projects.reduce((acc, p) => acc + (parseFloat(p.dataset[key]) || 0), 0);
const totals = {
    count: fmt(projects.length),
    kwp: fmt(sum('kwp'), 1),
    mwh: fmt(sum('kwh') / 1000),
    co2: fmt(sum('co2'), 1),
};
document.querySelectorAll('[data-total]').forEach(el => { el.textContent = totals[el.dataset.total]; });

const chips = document.querySelectorAll('.filters .chip');
const emptyNote = document.getElementById('projectsEmpty');
chips.forEach(chip => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach(c => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
    });
    let shown = 0;
    projects.forEach(p => {
        const match = filter === 'all' || p.dataset.type.split(' ').includes(filter);
        p.hidden = !match;
        if (match) {
            shown++;
            p.classList.add('visible'); // ensure revealed cards show immediately when filtered in
        }
    });
    emptyNote.hidden = shown > 0;
}));

// ===== Contact form (demo handler) =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk) {
        note.textContent = 'Por favor, completa tu nombre y un email válido.';
        note.className = 'form-note err';
        return;
    }
    note.textContent = '¡Gracias! Hemos recibido tu solicitud. Te contactaremos muy pronto.';
    note.className = 'form-note ok';
    form.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

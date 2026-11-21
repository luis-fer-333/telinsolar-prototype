const { STATIC, DYNAMIC } = window.TELINSOLAR_I18N;
const PROJECTS = window.TELINSOLAR_PROJECTS || [];
const LANGS = ['es', 'ca'];
let lang = 'es';

// ===== Helpers =====
const t = (key, vars = {}) =>
    (DYNAMIC[lang][key] ?? DYNAMIC.es[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// Number formatting with "." thousands and "," decimals (same in es and ca), always grouped.
const num = (n, decimals = 0) => {
    const fixed = Number(n).toFixed(decimals);
    const [int, dec] = fixed.split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return dec ? `${grouped},${dec}` : grouped;
};
const smart = (n) => num(n, Number.isInteger(n) ? 0 : 1);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const localized = (v) => (v && typeof v === 'object' ? v[lang] ?? v.es : v);

const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

// ===== i18n: static texts =====
// Spanish is the text written in index.html; it is captured once so we can switch back to it.
const original = new Map();
const i18nEls = document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-attr]');
i18nEls.forEach(el => {
    const entry = {};
    if (el.dataset.i18n) entry.text = el.textContent;
    if (el.dataset.i18nHtml) entry.html = el.innerHTML;
    if (el.dataset.i18nAttr) {
        entry.attrs = {};
        el.dataset.i18nAttr.split(';').forEach(pair => {
            const [attr] = pair.split(':');
            entry.attrs[attr.trim()] = el.getAttribute(attr.trim());
        });
    }
    original.set(el, entry);
});

const applyStatic = () => {
    const dict = STATIC[lang] || {};
    i18nEls.forEach(el => {
        const o = original.get(el);
        if (el.dataset.i18n) el.textContent = lang === 'es' ? o.text : dict[el.dataset.i18n] ?? o.text;
        if (el.dataset.i18nHtml) el.innerHTML = lang === 'es' ? o.html : dict[el.dataset.i18nHtml] ?? o.html;
        if (el.dataset.i18nAttr) {
            el.dataset.i18nAttr.split(';').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
                el.setAttribute(attr, lang === 'es' ? o.attrs[attr] : dict[key] ?? o.attrs[attr]);
            });
        }
    });
};

// ===== Projects =====
const projectsEl = document.getElementById('projects');
const emptyNote = document.getElementById('projectsEmpty');
const chips = document.querySelectorAll('.filters .chip');
let currentFilter = 'all';

const matches = (p, filter) =>
    filter === 'all' ||
    (filter === 'baterias' ? p.storageKwh > 0 : p.type === filter);

const mediaHtml = (p, name) => {
    const m = p.media;
    if (m && m.type === 'video') {
        return `<video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} controls preload="none" playsinline></video>`;
    }
    if (m && m.type === 'image') {
        return `<img src="${esc(m.src)}" alt="${esc(m.alt ? localized(m.alt) : name)}" loading="lazy">`;
    }
    return `<svg viewBox="0 0 320 180" role="img" aria-label="${esc(t('altIllustration', { name }))}"><use href="#ill-${esc(p.illustration || 'house')}"></use></svg>`;
};

const projectHtml = (p, i) => {
    const name = localized(p.name);
    const hasBattery = p.storageKwh > 0;
    const sky = ['media-day', 'media-warm', 'media-dusk'][i % 3];
    const kw = (v) => (v ? `${smart(v)} kW` : t('no'));
    const loads = (p.loads || []).map(l =>
        `<li>${esc(t('load_' + l.key))}${l.detail ? ` <span>${esc(l.detail)}</span>` : ''}</li>`).join('');

    const rows = [
        [t('specType'), `${t('type_' + p.type)}${hasBattery ? ` ${t('withBattery')}` : ''}`],
        [t('specPanelsKwp'), `${smart(p.panelsKwp)} kWp`],
        [t('specPanels'), num(p.panels)],
        [t('specOptimizers'), p.optimizers ? t('yes') : t('no')],
        [t('specInverter'), kw(p.inverterKw)],
        [t('specMicro'), kw(p.microinverterKw)],
        [t('specStorage'), hasBattery ? `${smart(p.storageKwh)} kWh` : t('no')],
        [t('specBatteries'), hasBattery ? num(p.batteries) : '—'],
        [t('specConsumption'), `${num(p.consumptionKwh)} kWh`],
        [t('specProduction'), `${num(p.productionKwh)} kWh`],
        [t('specPayback'), t('years', { n: smart(p.paybackYears) })],
        [t('specCost'), `${num(p.costEur)} €`],
    ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');

    return `
    <article class="project${p.example ? ' is-example' : ''}" ${matches(p, currentFilter) ? '' : 'hidden'}>
        <div class="project-media ${sky}">
            ${mediaHtml(p, name)}
            <span class="badge">${esc(t('type_' + p.type))}${hasBattery ? ` ${esc(t('withBattery'))}` : ''}</span>
            ${p.example ? `<span class="tag-example">${esc(t('example'))}</span>` : ''}
        </div>
        <div class="project-body">
            <h3>${esc(name)}</h3>
            <p class="project-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${esc(p.location)} · ${esc(t('panelsN', { n: num(p.panels) }))}${hasBattery ? ` · ${esc(smart(p.storageKwh))} kWh` : ''}
            </p>
            <dl class="project-kpis">
                <div><dt>${esc(t('kpiPower'))}</dt><dd>${smart(p.panelsKwp)} kWp</dd></div>
                <div><dt>${esc(t('kpiProduction'))}</dt><dd>${num(p.productionKwh)} kWh<small>${esc(t('perYear'))}</small></dd></div>
                <div><dt>${esc(t('kpiPayback'))}</dt><dd>${esc(t('years', { n: smart(p.paybackYears) }))}</dd></div>
                <div><dt>${esc(t('kpiCost'))}</dt><dd>${num(p.costEur)} €</dd></div>
            </dl>
            <div class="project-loads">
                <p><span>${esc(t('consumption'))}</span> <strong>${num(p.consumptionKwh)} kWh</strong></p>
                ${loads ? `<ul>${loads}</ul>` : ''}
            </div>
            <details class="project-spec">
                <summary>${esc(t('spec'))}</summary>
                <table><tbody>${rows}</tbody></table>
            </details>
            ${p.document ? `<a class="project-doc" href="${esc(p.document)}" target="_blank" rel="noopener">${esc(t('document'))}</a>` : ''}
        </div>
    </article>`;
};

const renderProjects = () => {
    projectsEl.innerHTML = PROJECTS.map(projectHtml).join('');
    emptyNote.hidden = PROJECTS.some(p => matches(p, currentFilter));
    observeReveal(projectsEl.querySelectorAll('.project'));
};

const renderTotals = () => {
    const sum = (k) => PROJECTS.reduce((a, p) => a + (Number(p[k]) || 0), 0);
    const totals = {
        count: num(PROJECTS.length),
        kwp: smart(Math.round(sum('panelsKwp') * 10) / 10),
        storage: smart(Math.round(sum('storageKwh') * 10) / 10),
        mwh: smart(Math.round(sum('productionKwh') / 100) / 10),
    };
    document.querySelectorAll('[data-total]').forEach(el => { el.textContent = totals[el.dataset.total]; });
};

chips.forEach(chip => chip.addEventListener('click', () => {
    currentFilter = chip.dataset.filter;
    chips.forEach(c => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
    });
    const cards = projectsEl.querySelectorAll('.project');
    PROJECTS.forEach((p, i) => {
        const show = matches(p, currentFilter);
        cards[i].hidden = !show;
        if (show) cards[i].classList.add('visible');
    });
    emptyNote.hidden = PROJECTS.some(p => matches(p, currentFilter));
}));

// ===== Language switch =====
const langButtons = document.querySelectorAll('.lang-switch button');
const setLang = (next, save = true) => {
    lang = LANGS.includes(next) ? next : 'es';
    document.documentElement.lang = lang;
    applyStatic();
    renderProjects();
    langButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (formNote.textContent) formNote.textContent = '';
    if (save) storage.set('telinsolar-lang', lang);
};
langButtons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

const initialLang = () => {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = storage.get('telinsolar-lang');
    if (LANGS.includes(saved)) return saved;
    const browser = (navigator.languages || [navigator.language || '']).map(l => l.toLowerCase().slice(0, 2));
    return browser.find(l => LANGS.includes(l)) || 'es';
};

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
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(i % 3) * 80}ms`;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
function observeReveal(els) {
    els.forEach(el => {
        if (el.classList.contains('visible')) return;
        el.classList.add('reveal');
        io.observe(el);
    });
}
observeReveal(document.querySelectorAll(
    '.card, .projects-totals, .tl-step, .payplan, .section-head, .prox-content, .prox-visual, .benefits-content, .benefits-visual, .cta-form, .cta-text'
));

// ===== Animated counters =====
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const startTime = performance.now();
        const tick = (now) => {
            const p = Math.min((now - startTime) / 1400, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.num[data-count]').forEach(c => countObserver.observe(c));

// ===== Contact form (demo handler: does not send data anywhere yet) =====
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[^\d+]/g, '');
    const address = form.address.value.trim();
    const email = form.email.value.trim();

    ['name', 'phone', 'address', 'email'].forEach(f => form[f].removeAttribute('aria-invalid'));
    const missing = [];
    if (!name) missing.push('name');
    if (phone.replace('+', '').length < 9) missing.push('phone');
    if (!address) missing.push('address');

    if (missing.length) {
        missing.forEach(f => form[f].setAttribute('aria-invalid', 'true'));
        form[missing[0]].focus();
        formNote.textContent = t('formError');
        formNote.className = 'form-note err';
        return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.email.setAttribute('aria-invalid', 'true');
        form.email.focus();
        formNote.textContent = t('formEmailError');
        formNote.className = 'form-note err';
        return;
    }
    formNote.textContent = t('formOk');
    formNote.className = 'form-note ok';
    form.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Init =====
renderTotals();
setLang(initialLang(), false);

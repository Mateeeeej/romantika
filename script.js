/* =========================================================
   NAŠE DRUHÉ VÝROČÍ – script.js
   Vše, co chceš upravit (data, vzpomínky, fotky, důvody,
   zprávy), je v objektu CONFIG hned níže.
   ========================================================= */
'use strict';

const CONFIG = {
  yourName: 'Matěj',                       // sem napiš své jméno (nahradí [TVÉ JMÉNO] v dopise)
  startDate: '2026-09-12',            // začátek vztahu (RRRR-MM-DD)
  anniversaryDate: '2026-11-12',      // den, kdy se zobrazí speciální text
  timeZone: 'Europe/Prague',
  musicFile: 'assets/music/music.mp3',

  // Časová osa – uprav text, nebo doplň pole photo (např. 'assets/photos/photo1.jpg')
  timeline: [
    { date: '12. 9. 2026', title: 'Začátek našeho příběhu', text: 'Den, kdy jsme spolu začali psát společnou kapitolu.', photo: 'assets/photos/photo1.jpg' },
    { date: '27. 9. 2026', title: 'První společné vzpomínky', text: 'Chvíle, na které se mi vždycky vrací úsměv na tváři.', photo: 'assets/photos/photo2.jpg' },
    { date: '11. 10. 2026', title: 'Nezapomenutelné okamžiky', text: 'Okamžiky, které si chci pamatovat napořád.', photo: 'assets/photos/photo3.jpg' },
    { date: '25. 10. 2026', title: 'Společná dobrodružství', text: 'Každý společný den je malé dobrodružství.', photo: 'assets/photos/photo4.jpg' },
    { date: '12. 11. 2026', title: 'Dva měsíce spolu', text: 'Teprve začínáme a už teď se těším na všechny další stránky.', photo: 'assets/photos/photo5.jpg' }
  ],

  // Galerie – 8 slotů. Soubory vlož do assets/photos/ pod uvedenými názvy.
  photos: [
    { src: 'assets/photos/photo1.jpg', title: 'Naše první společná fotka' },
    { src: 'assets/photos/photo2.jpg', title: 'Chvíle, na kterou rád vzpomínám' },
    { src: 'assets/photos/photo3.jpg', title: 'Tvůj úsměv' },
    { src: 'assets/photos/photo4.jpg', title: 'Společné dobrodružství' },
    { src: 'assets/photos/photo5.jpg', title: 'Obyčejný den s tebou' },
    { src: 'assets/photos/photo6.jpg', title: 'Moje oblíbená vzpomínka' },
    { src: 'assets/photos/photo7.jpg', title: 'Společný výlet' },
    { src: 'assets/photos/photo8.jpg', title: 'My dva' }
  ],

  // 10 důvodů (každý má ikonu a text)
  reasons: [
    { icon: '☀', text: 'Protože s tebou je každý den hezčí.' },
    { icon: '☺', text: 'Protože mě dokážeš rozesmát.' },
    { icon: '❤', text: 'Protože se s tebou cítím šťastný.' },
    { icon: '✦', text: 'Protože jsi jedinečná.' },
    { icon: '☆', text: 'Protože jsi moje oblíbená osoba.' },
    { icon: '❦', text: 'Protože s tebou jsou i obyčejné dny neobyčejné.' },
    { icon: '☾', text: 'Protože u tebe se cítím doma.' },
    { icon: '✿', text: 'Protože tvůj úsměv mi spraví náladu.' },
    { icon: '♫', text: 'Protože s tebou chci zažít ještě spoustu dobrodružství.' },
    { icon: '∞', text: 'Protože jsi ty a já tě miluju.' }
  ],

  // Zprávy z tlačítka „Klikni na mě“ (střídají se náhodně)
  messages: [
    'Miluju tě víc než včera, a méně než zítra.',
    'Díky, že jsi součástí mého života.',
    'S tebou je všechno krásnější.',
    'Jsem moc rád, že právě ty jsi moje Lenička.',
    'Dva měsíce jsou jen začátek. Těším se na všechny další.',
    'Jsi moje nejoblíbenější místo na světě.'
  ]
};

const $ = (sel, root = document) => root.querySelector(sel);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Pomocné: vytvoření obrázku s placeholderem ---------- */
function makeImage(src, alt, hint) {
  const wrap = document.createDocumentFragment();
  const showPlaceholder = () => {
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.textContent = hint || 'Sem vlož fotku';
    return ph;
  };
  if (!src) { wrap.appendChild(showPlaceholder()); return wrap; }
  const img = new Image();
  img.className = 'ph'; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async';
  img.addEventListener('error', () => img.replaceWith(showPlaceholder()), { once: true });
  img.src = src;
  wrap.appendChild(img);
  return wrap;
}

/* ---------- Úvod: načtení stránky ---------- */
window.addEventListener('load', () => document.body.classList.add('is-loaded'));
setTimeout(() => document.body.classList.add('is-loaded'), 1500); // pojistka

if (CONFIG.yourName) document.querySelectorAll('[data-your-name]').forEach(el => { el.textContent = CONFIG.yourName; });

/* ---------- Časová osa ---------- */
const timelineEl = $('#timeline');
CONFIG.timeline.forEach(item => {
  const li = document.createElement('li');
  li.className = 'tl-item reveal';
  const card = document.createElement('div');
  card.className = 'tl-card';
  const time = document.createElement('time'); time.textContent = item.date;
  const h3 = document.createElement('h3'); h3.textContent = item.title;
  const p = document.createElement('p'); p.textContent = item.text;
  card.append(time, h3, p);
  const photo = document.createElement('div');
  photo.className = 'tl-photo';
  photo.appendChild(makeImage(item.photo, item.title, 'Sem vlož fotku k tomuto okamžiku'));
  li.append(card, photo);
  timelineEl.appendChild(li);
});

/* ---------- Galerie + lightbox ---------- */
const galleryEl = $('#gallery');
const lightbox = $('#lightbox');
let lbIndex = 0, lbOpener = null;

CONFIG.photos.forEach((photo, i) => {
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'g-item reveal';
  btn.setAttribute('aria-label', 'Zvětšit: ' + photo.title);
  btn.appendChild(makeImage(photo.src, photo.title, 'Vlož ' + photo.src.split('/').pop() + ' do assets/photos/'));
  const cap = document.createElement('span'); cap.className = 'cap'; cap.textContent = photo.title;
  btn.appendChild(cap);
  btn.addEventListener('click', () => openLightbox(i, btn));
  galleryEl.appendChild(btn);
});

function showPhoto(i) {
  lbIndex = (i + CONFIG.photos.length) % CONFIG.photos.length;
  const p = CONFIG.photos[lbIndex];
  const box = $('#lbImg');
  box.replaceChildren(makeImage(p.src, p.title, 'Vlož ' + p.src.split('/').pop() + ' do assets/photos/'));
  $('#lbCap').textContent = p.title;
}
function openLightbox(i, opener) {
  lbOpener = opener; showPhoto(i);
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
  $('#lbClose').focus();
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  setTimeout(() => { lightbox.hidden = true; }, reduceMotion ? 0 : 350);
  document.body.style.overflow = '';
  if (lbOpener) lbOpener.focus();
}
$('#lbClose').addEventListener('click', closeLightbox);
$('#lbPrev').addEventListener('click', () => showPhoto(lbIndex - 1));
$('#lbNext').addEventListener('click', () => showPhoto(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
  if (e.key === 'Tab') { // jednoduchý focus trap
    const f = [...lightbox.querySelectorAll('button')];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
// swipe na dotykových zařízeních
let touchX = null;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Obálka a dopis ---------- */
const stage = $('#stage'), envelope = $('#envelope'), letter = $('#letter');
let letterBusy = false, letterTimers = [];
const later = (fn, ms) => letterTimers.push(setTimeout(fn, reduceMotion ? 0 : ms));

function openLetter() {
  if (letterBusy || stage.classList.contains('is-read')) return;   // ochrana proti opakovanému spuštění
  letterBusy = true;
  envelope.classList.add('is-busy', 'is-zoom');                    // 1. jemné zvětšení
  later(() => envelope.classList.add('is-unsealed'), 600);          // 2. pečeť se rozplyne
  later(() => envelope.classList.add('is-open'), 1200);             // 3. klopa se otevře
  later(() => envelope.classList.add('is-out'), 2300);              // 4. dopis vyjíždí
  later(() => {                                                    // 5.–6. přechod a rozložení dopisu
    stage.classList.add('is-read');
    envelope.setAttribute('aria-expanded', 'true');
    letter.setAttribute('aria-hidden', 'false');
    letter.querySelectorAll('.letter__body p').forEach((p, i) => p.style.setProperty('--i', i));
    letter.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    later(() => { letter.classList.add('is-written'); letterBusy = false; setHearts(true); }, 700); // 7.–8. text a částice
  }, 3800);
}
function closeLetter() {
  letterTimers.forEach(clearTimeout); letterTimers = [];
  letter.classList.remove('is-written');
  letter.setAttribute('aria-hidden', 'true');
  stage.classList.remove('is-read');
  envelope.classList.remove('is-busy', 'is-zoom', 'is-unsealed', 'is-open', 'is-out');
  envelope.setAttribute('aria-expanded', 'false');
  letterBusy = false; setHearts(false);
  $('#dopis').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  envelope.focus({ preventScroll: true });
}
envelope.addEventListener('click', openLetter);
$('#closeLetter').addEventListener('click', closeLetter);

/* ---------- Čas spolu (Europe/Prague, bez závislosti na letním času) ---------- */
function pragueNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFIG.timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  const g = t => +parts.find(p => p.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour'), min: g('minute') };
}
const parseYMD = s => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
const dayNumber = o => Date.UTC(o.y, o.m - 1, o.d) / 864e5;          // počet dní bez vlivu DST
const fmt = n => n.toLocaleString('cs-CZ');

function updateCounter() {
  const now = pragueNow(), start = parseYMD(CONFIG.startDate), ann = parseYMD(CONFIG.anniversaryDate);
  const days = Math.max(0, dayNumber(now) - dayNumber(start));
  const months = Math.max(0, (now.y - start.y) * 12 + (now.m - start.m) - (now.d < start.d ? 1 : 0));
  const clock = now.h * 60 + now.min;
  $('#cDays').textContent = fmt(days);
  $('#cMonths').textContent = fmt(months);
  $('#cWeeks').textContent = fmt(Math.floor(days / 7));
  $('#cHours').textContent = fmt(days * 24 + now.h);
  $('#cMinutes').textContent = fmt(days * 1440 + clock);
  const toGo = dayNumber(ann) - dayNumber(now);
  $('#anniv').hidden = toGo !== 0;
  $('#timeNote').textContent = toGo > 0 ? `Do našich dvou měsíců zbývá ${toGo} ${toGo === 1 ? 'den' : toGo < 5 ? 'dny' : 'dní'}.` : '';
}
updateCounter();
setInterval(updateCounter, 1000);

/* ---------- 10 důvodů ---------- */
const cardsEl = $('#cards');
CONFIG.reasons.forEach((r, i) => {
  const card = document.createElement('button');
  card.type = 'button'; card.className = 'card reveal';
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `Důvod číslo ${i + 1}. Klikni pro otočení.`);
  card.innerHTML = '<span class="card__inner"><span class="card__face card__front"><span class="ico"></span><span class="num"></span></span><span class="card__face card__back"></span></span>';
  $('.ico', card).textContent = r.icon;
  $('.num', card).textContent = i + 1;
  $('.card__back', card).textContent = r.text;
  card.addEventListener('click', () => {
    const on = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(on));
  });
  cardsEl.appendChild(card);
});

/* ---------- Překvapení ---------- */
const surprise = $('#prekvapeni'), msgEl = $('#surpriseMsg');
let lastMsg = -1;
function heartConfetti() {
  const colors = ['#D9A6A7', '#702D40', '#C6A56B', '#F7F0E6'];
  const count = reduceMotion ? 12 : 44;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart-confetti'; h.textContent = '❤'; h.setAttribute('aria-hidden', 'true');
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = 12 + Math.random() * 22 + 'px';
    h.style.color = colors[i % colors.length];
    h.style.animationDuration = 3 + Math.random() * 3 + 's';
    h.style.animationDelay = Math.random() * 0.8 + 's';
    h.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    h.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    h.addEventListener('animationend', () => h.remove());
    document.body.appendChild(h);
  }
}
$('#surpriseBtn').addEventListener('click', () => {
  let n; do { n = Math.floor(Math.random() * CONFIG.messages.length); } while (n === lastMsg && CONFIG.messages.length > 1);
  lastMsg = n;
  msgEl.classList.remove('is-new'); void msgEl.offsetWidth;
  msgEl.textContent = CONFIG.messages[n]; msgEl.classList.add('is-new');
  surprise.classList.add('is-lit');
  heartConfetti();
});

/* ---------- Hudba ---------- */
const player = $('#player'), playBtn = $('#playBtn'), note = $('#playerNote');
const audio = new Audio(); audio.loop = true; audio.preload = 'metadata'; audio.volume = 0.6;
audio.addEventListener('error', () => { player.classList.add('is-missing'); });
audio.src = CONFIG.musicFile;
playBtn.addEventListener('click', () => {
  if (player.classList.contains('is-missing')) { note.hidden = !note.hidden; return; }
  if (audio.paused) audio.play().catch(() => { player.classList.add('is-missing'); note.hidden = false; });
  else audio.pause();
});
audio.addEventListener('play', () => { player.classList.add('is-playing'); playBtn.setAttribute('aria-pressed', 'true'); playBtn.setAttribute('aria-label', 'Pozastavit hudbu'); });
audio.addEventListener('pause', () => { player.classList.remove('is-playing'); playBtn.setAttribute('aria-pressed', 'false'); playBtn.setAttribute('aria-label', 'Přehrát hudbu'); });
$('#volume').addEventListener('input', e => { audio.volume = +e.target.value; });

/* ---------- Navigace, progress, to-top, reveal ---------- */
const progress = $('#progress'), toTop = $('#toTop');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  toTop.classList.toggle('is-shown', scrollY > innerHeight * 0.8);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const links = [...document.querySelectorAll('.nav a')];
const navObs = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('[data-nav]').forEach(s => navObs.observe(s));

const revealObs = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObs.unobserve(en.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---------- Kurzorový efekt (jen myš) ---------- */
const glow = $('#cursorGlow');
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  addEventListener('pointermove', e => { glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
  document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
}

/* ---------- Částice na pozadí (světelný prach, při čtení dopisu srdíčka) ---------- */
const canvas = $('#dust'), ctx = canvas.getContext('2d');
let W = 0, H = 0, particles = [], hearts = false;
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
  particles = Array.from({ length: innerWidth < 600 ? 28 : 55 }, () => newParticle(true));
}
function newParticle(anywhere) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 20, r: (Math.random() * 1.8 + .6) * dpr,
           v: (Math.random() * .25 + .08) * dpr, drift: Math.random() * Math.PI * 2, a: Math.random() * .5 + .2 };
}
function setHearts(on) { hearts = on; }
function drawHeart(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s * .35);
  ctx.bezierCurveTo(x - s, y - s * .4, x - s * .3, y - s, x, y - s * .3);
  ctx.bezierCurveTo(x + s * .3, y - s, x + s, y - s * .4, x, y + s * .35); ctx.fill();
}
function frame() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.y -= p.v; p.drift += .01; p.x += Math.sin(p.drift) * .3;
    if (p.y < -20) particles[i] = newParticle(false);
    ctx.globalAlpha = p.a;
    if (hearts && i % 4 === 0) { ctx.fillStyle = '#D9A6A7'; drawHeart(p.x, p.y, p.r * 4); }
    else { ctx.fillStyle = '#C6A56B'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
  });
  if (!reduceMotion && !document.hidden) requestAnimationFrame(frame);
  else if (!reduceMotion) document.addEventListener('visibilitychange', () => requestAnimationFrame(frame), { once: true });
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 200));
resize(); frame();

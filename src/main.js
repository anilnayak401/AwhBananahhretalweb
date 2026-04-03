/* ═══════════════════════════════════════════════════════════
   AWHHBANANAHH — Hyper-Visual Main JS
   Awwwards-level interactions, Three.js, GSAP, particles
═══════════════════════════════════════════════════════════ */

'use strict';

// ── VIDEO VISIBILITY CONTROLLER
// Each video plays only when its section is in the viewport, pauses when scrolled away
(function initVideoVisibility() {
  const videos = [
    document.getElementById('hero-video'),
    document.getElementById('cta-video'),
    document.getElementById('ing-video')
  ].filter(Boolean);

  // Set base attributes on all videos
  videos.forEach(vid => {
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.pause(); // start paused — observer will trigger play
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        // Section entered viewport — play
        vid.play().catch(() => {
          // Autoplay blocked — retry on first interaction
          const resume = () => { vid.play(); };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        });
      } else {
        // Section left viewport — pause and reset to start for clean re-entry
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, {
    threshold: 0.25  // trigger when 25% of the section is visible
  });

  videos.forEach(vid => observer.observe(vid));
})();

// ── PRODUCT DATA
const PRODUCTS = [
  {
    id: 'solar-burst', name: 'Solar Burst', tag: 'Citrus',
    desc: 'Valencia orange, blood orange & Meyer lemon. A vitamin C explosion in every sip.',
    detail: 'Cold-pressed from hand-picked Valencia oranges, blood oranges, and Meyer lemons. Rich in Vitamin C, folate, and flavonoids. No added sugar. No preservatives.',
    price: '$8.99', color: '#FF6B00', glow: 'rgba(255,107,0,0.3)',
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80'
  },
  {
    id: 'jungle-green', name: 'Jungle Green', tag: 'Green',
    desc: 'Kiwi, green apple, spinach & cucumber. Alkalising, energising, alive.',
    detail: 'A powerful alkalising blend of kiwi, green apple, baby spinach, cucumber, and celery. Packed with chlorophyll, iron, and magnesium.',
    price: '$9.49', color: '#2ECC71', glow: 'rgba(46,204,113,0.3)',
    img: 'https://images.unsplash.com/photo-1622597467836-f3e6707a5e0b?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1622597467836-f3e6707a5e0b?w=200&q=80'
  },
  {
    id: 'berry-riot', name: 'Berry Riot', tag: 'Berry',
    desc: 'Pomegranate, grape & raspberry. Anthocyanins and polyphenols in full riot.',
    detail: 'A deep, rich blend of pomegranate, Concord grape, raspberry, and acai. Loaded with antioxidants, anthocyanins, and resveratrol.',
    price: '$9.99', color: '#E74C3C', glow: 'rgba(231,76,60,0.3)',
    img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80'
  },
  {
    id: 'citrus-storm', name: 'Citrus Storm', tag: 'Citrus',
    desc: 'Grapefruit, tangerine & lime. Tart, bright, and impossible to put down.',
    detail: 'A tart, electric blend of ruby grapefruit, tangerine, lime, and a hint of ginger. High in Vitamin C and limonoids.',
    price: '$8.49', color: '#FFD600', glow: 'rgba(255,214,0,0.3)',
    img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=200&q=80'
  },
  {
    id: 'lime-splash', name: 'Lime Splash', tag: 'Tropical',
    desc: 'Lime, ginger, turmeric & coconut water. Anti-inflammatory and refreshing.',
    detail: 'A wellness powerhouse of lime, fresh ginger, turmeric, and coconut water. Anti-inflammatory, hydrating, and energising.',
    price: '$9.29', color: '#1ABC9C', glow: 'rgba(26,188,156,0.3)',
    img: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=200&q=80'
  },
  {
    id: 'sangria-sun', name: 'Sangria Sun', tag: 'Tropical',
    desc: 'Watermelon, dragon fruit, kiwi & pineapple. A tropical sunset in a bottle.',
    detail: 'A vibrant tropical blend of watermelon, dragon fruit, kiwi, and pineapple. Rich in lycopene, betacyanin, and bromelain.',
    price: '$9.79', color: '#9B59B6', glow: 'rgba(155,89,182,0.3)',
    img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=700&q=90',
    thumb: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&q=80'
  }
];

// ── LOADER
const loaderEl = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderPct = document.getElementById('loader-pct');
const loaderStatus = document.getElementById('loader-status');
const statuses = ['Initialising...', 'Loading assets...', 'Brewing flavours...', 'Almost ready...', 'Pure juice incoming...'];
let loadProg = 0;

function setLoad(pct) {
  loadProg = Math.max(loadProg, Math.min(100, pct));
  loaderFill.style.width = loadProg + '%';
  loaderPct.textContent = Math.round(loadProg) + '%';
  loaderStatus.textContent = statuses[Math.floor(loadProg / 25)] || statuses[4];
}

let lp = 0;
const loadInt = setInterval(() => {
  lp += Math.random() * 14 + 2;
  setLoad(lp);
  if (lp >= 100) {
    clearInterval(loadInt);
    setLoad(100);
    setTimeout(() => {
      loaderEl.classList.add('out');
      setTimeout(initSite, 400);
    }, 700);
  }
}, 100);

// ── CURSOR (desktop only)
const cursorRing = document.getElementById('cursor-ring');
const cursorDot = document.getElementById('cursor-dot');
const cursorLabel = document.getElementById('cursor-label');
let mx = 0, my = 0, cx = 0, cy = 0;
const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);

if (!isMobile) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
    cursorLabel.style.left = mx + 'px';
    cursorLabel.style.top = my + 'px';
  });
}

(function tickCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  cursorRing.style.left = cx + 'px';
  cursorRing.style.top = cy + 'px';
  requestAnimationFrame(tickCursor);
})();
function registerCursorTargets() {
  document.querySelectorAll('a, button, .product-card, .magnetic, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      const label = el.dataset.cursor;
      if (label) {
        cursorLabel.textContent = label;
        document.body.classList.add('cursor-label-show');
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-label-show');
    });
  });
}

// Click burst
document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 8;
    const dist = 30 + Math.random() * 30;
    p.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:5px;height:5px;border-radius:50%;
      background:${['#FF6B00','#FFD600','#FF9500'][i%3]};
      pointer-events:none;z-index:9997;
      transform:translate(-50%,-50%);
      transition:transform 0.5s cubic-bezier(0.23,1,0.32,1),opacity 0.5s ease;
    `;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px))`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 500);
  }
});

// ── NAVBAR
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── PRODUCT CARDS
function buildProductCards() {
  const grid = document.getElementById('products-grid');
  PRODUCTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.tag = p.tag;
    card.style.setProperty('--card-glow', p.glow);
    card.innerHTML = `
      <div class="product-card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-card-img-overlay"></div>
        <canvas class="particle-canvas"></canvas>
        <div class="product-card-badge" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}44">${p.tag}</div>
      </div>
      <div class="product-card-body">
        <h3 style="color:${p.color}">${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-card-footer">
          <div class="product-price">${p.price}</div>
          <button class="product-add-btn magnetic" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}44" data-cursor="Add">+</button>
        </div>
      </div>
      <div class="product-card-quick">
        <button class="quick-btn view-btn" data-id="${p.id}" data-cursor="View">Quick View</button>
        <button class="quick-btn primary add-cart-btn" data-cursor="Add">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);

    // Particle system
    const canvas = card.querySelector('.particle-canvas');
    initCardParticles(canvas, p.color);

    // Quick view
    card.querySelector('.view-btn').addEventListener('click', () => openModal(p));
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        const show = filter === 'all' || card.dataset.tag === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'cardIn 0.5s var(--ease-out) forwards';
        }
      });
    });
  });
}

// Inject card animation
const dynStyle = document.createElement('style');
dynStyle.textContent = `
  @keyframes cardIn { from{opacity:0;transform:translateY(30px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .product-card { animation: cardIn 0.6s var(--ease-out) both; }
  :root { --ease-out: cubic-bezier(0.23,1,0.32,1); --ease-spring: cubic-bezier(0.34,1.56,0.64,1); }
`;
document.head.appendChild(dynStyle);

// ── CARD PARTICLES
function initCardParticles(canvas, color) {
  const ctx = canvas.getContext('2d');
  let particles = [], active = false, raf = null;

  function resize() {
    canvas.width = canvas.offsetWidth || canvas.parentElement.offsetWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
  }

  function spawn(count, burst) {
    for (let i = 0; i < count; i++) {
      const angle = burst ? (Math.PI * 2 * i) / count : Math.random() * Math.PI * 2;
      const speed = burst ? (Math.random() * 10 + 4) : (Math.random() * 2 + 0.5);
      particles.push({
        x: burst ? canvas.width / 2 : Math.random() * canvas.width,
        y: burst ? canvas.height / 2 : Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * (burst ? 5 : 3) + 1,
        life: 1,
        decay: burst ? 0.018 : 0.008
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life -= p.decay;
      const hex = Math.floor(p.life * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = color + hex;
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    if (active && particles.length < 60) spawn(20, false);
    if (particles.length > 0 || active) raf = requestAnimationFrame(tick);
    else raf = null;
  }

  canvas.parentElement.parentElement.addEventListener('mouseenter', () => {
    resize(); active = true; spawn(60, false);
    if (!raf) tick();
  });
  canvas.parentElement.parentElement.addEventListener('mouseleave', () => { active = false; });
  canvas.parentElement.parentElement.addEventListener('click', () => {
    resize(); spawn(150, true);
    if (!raf) tick();
  });
}

// ── MODAL
function openModal(p) {
  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <img class="modal-product-img" src="${p.img}" alt="${p.name}" />
    <div class="modal-product-name" style="color:${p.color}">${p.name}</div>
    <div class="modal-product-desc">${p.detail}</div>
    <div class="modal-product-price">${p.price} / bottle</div>
    <div class="modal-actions">
      <button class="btn-primary magnetic" data-cursor="Add" style="width:100%;justify-content:center">
        <span>Add to Cart</span>
        <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  `;
  modal.classList.add('open');
  registerCursorTargets();
}

document.querySelector('.modal-backdrop').addEventListener('click', () => {
  document.getElementById('product-modal').classList.remove('open');
});
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('product-modal').classList.remove('open');
});

// ── THREE.JS HERO CANVAS
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0x000000, 0); // fully transparent — video shows through

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 6;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light1 = new THREE.PointLight(0xFF6B00, 3, 20);
  light1.position.set(4, 4, 4);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xFFD600, 2, 20);
  light2.position.set(-4, -2, 3);
  scene.add(light2);
  const light3 = new THREE.PointLight(0x2ECC71, 1.5, 15);
  light3.position.set(0, -4, 2);
  scene.add(light3);

  // Bottles — more detailed geometry
  const bottles = [];
  const colors = [0xFF6B00, 0xFFD600, 0x2ECC71, 0xE74C3C, 0x1ABC9C, 0x9B59B6];
  for (let i = 0; i < 6; i++) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.0, 20, 1, false);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colors[i], metalness: 0.1, roughness: 0.3,
      transparent: true, opacity: 0.45,
      envMapIntensity: 1
    });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.1, 0.18, 0.15, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.2 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.575;
    group.add(cap);

    // Liquid inside
    const liqGeo = new THREE.CylinderGeometry(0.16, 0.20, 0.85, 20);
    const liqMat = new THREE.MeshStandardMaterial({
      color: colors[i], metalness: 0, roughness: 0.8,
      transparent: true, opacity: 0.9
    });
    group.add(new THREE.Mesh(liqGeo, liqMat));

    const angle = (i / 6) * Math.PI * 2;
    group.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 1.4, Math.sin(angle * 0.7) * 0.8);
    group.rotation.z = (Math.random() - 0.5) * 0.5;
    group.userData = { baseY: group.position.y, speed: 0.4 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2, rotSpeed: 0.3 + Math.random() * 0.3 };
    scene.add(group);
    bottles.push(group);
  }

  // Particle field — multi-colour
  const pCount = 3000;
  const pPos = new Float32Array(pCount * 3);
  const pColors = new Float32Array(pCount * 3);
  const palette = [[1,0.42,0],[1,0.84,0],[0.18,0.8,0.44],[0.91,0.3,0.24],[0.1,0.74,0.61],[0.61,0.35,0.71]];
  for (let i = 0; i < pCount; i++) {
    pPos[i*3] = (Math.random()-0.5)*24;
    pPos[i*3+1] = (Math.random()-0.5)*24;
    pPos[i*3+2] = (Math.random()-0.5)*12;
    const c = palette[i % palette.length];
    pColors[i*3] = c[0]; pColors[i*3+1] = c[1]; pColors[i*3+2] = c[2];
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.45 });
  scene.add(new THREE.Points(pGeo, pMat));

  // Mouse parallax
  let tRotX = 0, tRotY = 0;
  document.addEventListener('mousemove', e => {
    tRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.8;
    tRotX = ((e.clientY / window.innerHeight) - 0.5) * -0.4;
  });

  const clock = new THREE.Clock();
  function heroTick() {
    const t = clock.getElapsedTime();
    bottles.forEach(b => {
      b.position.y = b.userData.baseY + Math.sin(t * b.userData.speed + b.userData.phase) * 0.35;
      b.rotation.y = t * b.userData.rotSpeed;
      b.rotation.x = Math.sin(t * 0.3 + b.userData.phase) * 0.1;
    });
    light1.position.x = Math.sin(t * 0.5) * 5;
    light1.position.y = Math.cos(t * 0.3) * 4;
    light2.position.x = Math.cos(t * 0.4) * 5;
    scene.rotation.y += (tRotY - scene.rotation.y) * 0.04;
    scene.rotation.x += (tRotX - scene.rotation.x) * 0.04;
    renderer.render(scene, camera);
  }
  return heroTick;

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ── INGREDIENTS RING CANVAS
function initIngCanvas() {
  const canvas = document.getElementById('ing-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 360; canvas.height = 360;
  const cx = 180, cy = 180, r = 160;
  const items = [
    { color: '#FF6B00', label: '🍊', angle: 0 },
    { color: '#2ECC71', label: '🥝', angle: Math.PI * 0.4 },
    { color: '#E74C3C', label: '🍇', angle: Math.PI * 0.8 },
    { color: '#FFD600', label: '🍍', angle: Math.PI * 1.2 },
    { color: '#1ABC9C', label: '🌿', angle: Math.PI * 1.6 },
  ];
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, 360, 360);
    t += 0.008;

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,107,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,107,0,0.06)';
    ctx.stroke();

    // Rotating arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, t, t + Math.PI * 1.5);
    const grad = ctx.createLinearGradient(cx-r, cy, cx+r, cy);
    grad.addColorStop(0, 'rgba(255,107,0,0)');
    grad.addColorStop(0.5, 'rgba(255,107,0,0.6)');
    grad.addColorStop(1, 'rgba(255,214,0,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Orbiting dots
    items.forEach((item, i) => {
      const a = item.angle + t * (i % 2 === 0 ? 1 : -0.7);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;

      // Glow
      const grd = ctx.createRadialGradient(x, y, 0, x, y, 20);
      grd.addColorStop(0, item.color + '80');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();

      // Emoji
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, x, y);

      // Line to center
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = item.color + '20';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }
  draw();
}
function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 5;

  // Galaxy-style particle vortex
  const count = 5000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette2 = [[1,0.42,0],[1,0.84,0],[0.18,0.8,0.44],[0.91,0.3,0.24]];
  for (let i = 0; i < count; i++) {
    const arm = i % 3;
    const armAngle = (arm / 3) * Math.PI * 2;
    const dist = Math.random() * 4 + 0.2;
    const spread = (Math.random() - 0.5) * 0.6;
    const angle = armAngle + dist * 0.8 + spread;
    pos[i*3] = Math.cos(angle) * dist;
    pos[i*3+1] = (Math.random() - 0.5) * 0.8;
    pos[i*3+2] = Math.sin(angle) * dist;
    const c = palette2[i % palette2.length];
    col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let tRY = 0;
  document.addEventListener('mousemove', e => {
    tRY = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
  });

  function ctaTick() {
    points.rotation.y += 0.002;
    points.rotation.x += 0.0005;
    camera.position.x += (tRY * 2 - camera.position.x) * 0.02;
    renderer.render(scene, camera);
  }
  return ctaTick;

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ── CTA PRODUCT THUMBS
function buildCtaRow() {
  const row = document.getElementById('cta-product-row');
  if (!row) return;
  PRODUCTS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'cta-product-thumb magnetic';
    div.dataset.cursor = p.name;
    div.innerHTML = `<img src="${p.thumb}" alt="${p.name}" loading="lazy" />`;
    div.style.borderColor = p.color + '44';
    div.addEventListener('mouseenter', () => { div.style.borderColor = p.color; });
    div.addEventListener('mouseleave', () => { div.style.borderColor = p.color + '44'; });
    row.appendChild(div);
  });
}

// ── REVIEWS SLIDER
function initReviews() {
  const track = document.getElementById('reviews-track');
  const dotsWrap = document.getElementById('rev-dots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let current = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'rev-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    const card = cards[current];
    track.scrollTo({ left: card.offsetLeft - 40, behavior: 'smooth' });
    dotsWrap.querySelectorAll('.rev-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('rev-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('rev-next').addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  setInterval(() => goTo((current + 1) % cards.length), 4000);
}

// ── GSAP SCROLL ANIMATIONS
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero orbs parallax
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: (i % 2 === 0 ? -120 : 80), x: (i % 3 === 0 ? -40 : 40), ease: 'none'
    });
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 82%' },
      y: 70, opacity: 0, duration: 1, ease: 'power4.out'
    });
  });

  // Section eyebrows
  gsap.utils.toArray('.section-eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.7, ease: 'power2.out'
    });
  });

  // Product cards stagger
  gsap.from('.product-card', {
    scrollTrigger: { trigger: '#products-grid', start: 'top 78%' },
    y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
  });

  // Story blocks
  gsap.utils.toArray('.story-block').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      x: 60, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
    });
  });

  // Story images
  gsap.from('.story-img-card', {
    scrollTrigger: { trigger: '.story-scroll-imgs', start: 'top 80%' },
    y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
  });

  // Ingredient items
  gsap.from('.ing-item', {
    scrollTrigger: { trigger: '.ing-list', start: 'top 78%' },
    x: -40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
  });

  // Process steps
  gsap.from('.process-step', {
    scrollTrigger: { trigger: '.process-steps', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
  });

  // Gallery items
  gsap.from('.gal-item', {
    scrollTrigger: { trigger: '.gallery-masonry', start: 'top 80%' },
    scale: 0.9, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out'
  });

  // Review cards
  gsap.from('.review-card', {
    scrollTrigger: { trigger: '.reviews-track', start: 'top 80%' },
    x: 60, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out'
  });

  // CTA headline
  gsap.from('.cta-headline', {
    scrollTrigger: { trigger: '.cta-headline', start: 'top 80%' },
    y: 100, opacity: 0, duration: 1.2, ease: 'power4.out'
  });

  // Strip cells
  gsap.from('.strip-cell', {
    scrollTrigger: { trigger: '.strip-grid', start: 'top 85%' },
    scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
  });

  // Footer brand
  gsap.from('.footer-logo', {
    scrollTrigger: { trigger: 'footer', start: 'top 90%' },
    y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
  });

  // Parallax on story bg — scrub:true is smoother than scrub:1
  gsap.to('.story-bg-img img', {
    scrollTrigger: { trigger: '#story', start: 'top bottom', end: 'bottom top', scrub: true },
    y: 100, ease: 'none'
  });
}

// ── AUDIO
let audioCtx = null, gainNode = null, audioEnabled = false;
const audioBtn = document.getElementById('audio-btn');

function createAmbient() {
  if (!audioCtx) audioCtx = new AudioContext();
  audioCtx.resume();
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1);
  gainNode.connect(audioCtx.destination);
  [[110, 'sine'], [220, 'sine'], [330, 'triangle'], [440, 'sine']].forEach(([freq, type], i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(0.25 / (i + 1), audioCtx.currentTime);
    osc.connect(g); g.connect(gainNode); osc.start();
  });
}

audioBtn.addEventListener('click', () => {
  audioEnabled = !audioEnabled;
  audioBtn.classList.toggle('active', audioEnabled);
  if (audioEnabled) createAmbient();
  else if (gainNode) gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
});

// ── INIT — unified RAF + Lenis smooth scroll
function initSite() {
  buildProductCards();
  buildCtaRow();

  const heroTick = null; // hero canvas removed — video is the background
  const ctaTick = null; // cta canvas removed — video is the background

  initReviews();
  initGSAP();
  registerCursorTargets();

  // ── Lenis smooth scroll wired into GSAP ticker
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    // Wire Lenis into GSAP ScrollTrigger so they stay in sync
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ── Single master RAF loop for cursor + Three.js
  // Three.js canvases only render when their section is near the viewport
  const heroSection = document.getElementById('hero');
  const ctaSection = document.getElementById('cta');

  function masterTick() {
    // Cursor (desktop only)
    if (!isMobile) {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      cursorRing.style.left = cx + 'px';
      cursorRing.style.top = cy + 'px';
    }

    // Only render Three.js when visible — saves GPU during scroll
    if (heroTick && isNearViewport(heroSection)) heroTick();
    if (ctaTick && isNearViewport(ctaSection)) ctaTick();

    requestAnimationFrame(masterTick);
  }
  requestAnimationFrame(masterTick);

  // Haptic on product click
  document.addEventListener('click', e => {
    if (e.target.closest('.product-card') && navigator.vibrate) navigator.vibrate(40);
  });
}

function isNearViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.bottom > -200 && rect.top < window.innerHeight + 200;
}

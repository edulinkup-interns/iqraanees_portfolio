
// ── Custom Cursor ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  trail.style.opacity  = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  trail.style.opacity  = '1';
});


// ── Navbar scroll effect ───────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ── Scroll Reveal ──────────────────────────────────────────
const revealElements = document.querySelectorAll(
  '.skill-card, .project-item, .ach-card, .edu-item, .badge, .contact-link, .about-body, .section-title, .section-tag'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


// ── Smooth active nav link highlighting ───────────────────
const sections = document.querySelectorAll('section[id], .hero[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--gold)';
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// ── Project card hover sound effect (visual ripple) ───────
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:20px; height:20px;
      background:rgba(201,169,110,0.15);
      top:50%; left:0; transform:translateY(-50%);
      animation:rippleOut .5s ease forwards;
      pointer-events:none;
    `;
    item.style.position = 'relative';
    item.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleOut {
    to { width: 200px; height: 200px; opacity: 0; left: -90px; }
  }
`;
document.head.appendChild(style);


// ── Skill tags pop on hover ────────────────────────────────
document.querySelectorAll('.skill-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'scale(1.08)';
    tag.style.transition = 'transform .2s cubic-bezier(0.34,1.56,0.64,1)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = 'scale(1)';
  });
});


// ── Typing effect in hero tag ─────────────────────────────
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const original = heroTag.textContent;
  heroTag.textContent = '';
  let i = 0;
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      heroTag.textContent += original[i];
      i++;
      if (i >= original.length) clearInterval(typeInterval);
    }, 40);
  }, 300);
}


// ── Hero background text parallax ─────────────────────────
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.15}px))`;
    }
  });
}


// ── Achievement card tilt effect ──────────────────────────
document.querySelectorAll('.ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── Section number counter animation ──────────────────────
function animateCounter(el, end, duration = 1200) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { el.textContent = end; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

// Animate CGPA display in education
const cgpaObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // nothing to count right now but ready for future stats
      cgpaObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.edu-cgpa').forEach(el => cgpaObserver.observe(el));


// ── Nav mobile toggle (if ever added) ─────────────────────
// Placeholder for future mobile menu


// ── Page load progress bar ────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px;
  background: var(--gold);
  width: 0%; z-index: 9999;
  transition: width .1s linear;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = pct + '%';
});


// ── Smooth scroll for all anchor links ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


console.log('%c Iqra Anees — Portfolio', 'color: #c9a96e; font-family: serif; font-size: 18px; font-weight: bold;');
console.log('%c B.E. AI & Data Science · Hyderabad', 'color: #6b6b7a; font-size: 12px;');

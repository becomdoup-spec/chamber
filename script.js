// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SCROLL REVEAL =====
function initReveal() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealEls = document.querySelectorAll(
    '.problem-card, .stage-content, .equip-card, .model-card, .maint-card, .trust-item, .roi-card, .cycle-bar, .mode-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

initReveal();

// ===== BLUEPRINT TABS =====
const bpTabs = document.querySelectorAll('.bp-tab');
const bpPanels = document.querySelectorAll('.bp-panel');

bpTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    bpTabs.forEach(t => t.classList.remove('active'));
    bpPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = tab.dataset.bp;
    document.getElementById('bp-' + panelId).classList.add('active');
  });
});

// ===== ROI CALCULATOR =====
const roiInputs = {
  players: document.getElementById('roiPlayers'),
  sessions: document.getElementById('roiSessions'),
  gear: document.getElementById('roiGear'),
  charge: document.getElementById('roiCharge'),
};

const roiDisplays = {
  players: document.getElementById('roiPlayersVal'),
  sessions: document.getElementById('roiSessionsVal'),
  gear: document.getElementById('roiGearVal'),
  charge: document.getElementById('roiChargeVal'),
};

const roiResults = {
  savings: document.getElementById('roiSavings'),
  revenue: document.getElementById('roiRevenue'),
  opex: document.getElementById('roiOpex'),
  net: document.getElementById('roiNet'),
  payback: document.getElementById('roiPayback'),
};

function formatINR(num) {
  if (Math.abs(num) >= 100000) {
    return '\u20B9' + (num / 100000).toFixed(2) + 'L';
  }
  return '\u20B9' + num.toLocaleString('en-IN');
}

function calculateROI() {
  const players = parseInt(roiInputs.players.value);
  const sessions = parseInt(roiInputs.sessions.value);
  const gearBudget = parseFloat(roiInputs.gear.value) * 100000;
  const chargePerClean = parseInt(roiInputs.charge.value);

  // Update display values
  roiDisplays.players.textContent = players;
  roiDisplays.sessions.textContent = sessions;
  roiDisplays.gear.textContent = '\u20B9' + roiInputs.gear.value + 'L';
  roiDisplays.charge.textContent = '\u20B9' + chargePerClean;

  // Calculate
  const gearSavings = Math.round(gearBudget * 0.35); // 35% savings on gear replacement
  const workingDays = 300; // per year
  const dailyRevenue = chargePerClean > 0 ? players * chargePerClean : 0;
  const annualRevenue = Math.round(dailyRevenue * workingDays);
  const annualOpex = 50400; // updated annual maintenance cost
  const netBenefit = gearSavings + annualRevenue - annualOpex;
  const investmentCost = 425000; // updated retail price
  const monthlyBenefit = netBenefit / 12;
  const paybackMonths = monthlyBenefit > 0 ? Math.max(1, Math.ceil(investmentCost / monthlyBenefit)) : 99;

  // Update results
  roiResults.savings.textContent = formatINR(gearSavings);
  roiResults.revenue.textContent = formatINR(annualRevenue);
  roiResults.opex.textContent = formatINR(annualOpex);
  roiResults.net.textContent = formatINR(netBenefit);
  roiResults.payback.textContent = paybackMonths > 36 ? '36+' : paybackMonths;
}

// Attach listeners
Object.values(roiInputs).forEach(input => {
  input.addEventListener('input', calculateROI);
});

// Initial calculation
calculateROI();

// ===== FORM SUBMIT =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Request Sent \u2713';
  btn.style.background = '#22c55e';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Request a Demo';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

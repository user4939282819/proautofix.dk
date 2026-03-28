// Hide cookie banner immediately if already consented — prevents flash on page load
(function() {
  try {
    var consent = localStorage.getItem('paf_cookie_consent');
    if (consent) {
      // Inject a style to hide the banner before paint
      var style = document.createElement('style');
      style.textContent = '#cookieBanner { display: none !important; }';
      document.head.appendChild(style);
      // Remove the style after JS init takes over
      document.addEventListener('DOMContentLoaded', function() {
        style.remove();
      });
    }
  } catch(e) {}
})();


/* ============================================================
   ProAutoFix.dk — Main JS
   Features: Cookie Consent, Mobile Nav, Scroll Animations
   No dependencies. Vanilla JS only.
   ============================================================ */

'use strict';

/* ── Cookie Consent System ─────────────────────────────────── */
const CookieConsent = (() => {
  const STORAGE_KEY = 'paf_cookie_consent';

  function getPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, ts: Date.now() }));
    } catch {}
  }

  function applyPrefs(prefs) {
    // Analytics (Google Analytics placeholder)
    if (prefs.analytics && typeof window.loadAnalytics === 'function') {
      window.loadAnalytics();
    }
    // Marketing placeholder
    if (prefs.marketing && typeof window.loadMarketing === 'function') {
      window.loadMarketing();
    }
    document.dispatchEvent(new CustomEvent('cookieConsentSet', { detail: prefs }));
  }

  function hideBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
  }

  function init() {
    const banner  = document.getElementById('cookieBanner');
    const modal   = document.getElementById('cookieModal');
    const floatBtn= document.getElementById('cookieFloatBtn');

    const prefs = getPrefs();
    if (!prefs) {
      if (banner) banner.classList.add('show');
    } else {
      applyPrefs(prefs);
    }

    // Accept all
    document.querySelectorAll('[data-cookie-accept]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = { necessary: true, analytics: true, marketing: true };
        savePrefs(p);
        applyPrefs(p);
        hideBanner();
        if (modal) modal.classList.remove('show');
      });
    });

    // Reject non-essential
    document.querySelectorAll('[data-cookie-reject]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = { necessary: true, analytics: false, marketing: false };
        savePrefs(p);
        applyPrefs(p);
        hideBanner();
      });
    });

    // Open modal
    document.querySelectorAll('[data-cookie-settings]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (modal) {
          // Sync toggles with saved prefs
          const cur = getPrefs() || {};
          const analToggle = document.getElementById('toggleAnalytics');
          const markToggle = document.getElementById('toggleMarketing');
          if (analToggle) analToggle.checked = !!cur.analytics;
          if (markToggle) markToggle.checked  = !!cur.marketing;
          modal.classList.add('show');
        }
      });
    });

    // Save from modal
    const saveBtn = document.getElementById('cookieSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const analToggle = document.getElementById('toggleAnalytics');
        const markToggle = document.getElementById('toggleMarketing');
        const p = {
          necessary: true,
          analytics: analToggle ? analToggle.checked : false,
          marketing: markToggle ? markToggle.checked : false,
        };
        savePrefs(p);
        applyPrefs(p);
        hideBanner();
        if (modal) modal.classList.remove('show');
      });
    }

    // Close modal on backdrop
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }

    // Float button always visible after consent
    if (floatBtn) floatBtn.style.display = 'flex';
  }

  return { init };
})();

/* ── Mobile Navigation ─────────────────────────────────────── */
const MobileNav = (() => {
  function init() {
    const burger = document.getElementById('navBurger');
    const mobile = document.getElementById('navMobile');
    if (!burger || !mobile) return;

    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobile.classList.remove('open'));
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !mobile.contains(e.target)) {
        mobile.classList.remove('open');
      }
    });
  }
  return { init };
})();

/* ── Scroll Animations ─────────────────────────────────────── */
const ScrollAnim = (() => {
  function init() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }
  return { init };
})();

/* ── Active Nav Link ────────────────────────────────────────── */
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path !== '/' && href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
}

/* ── Price Calculator ───────────────────────────────────────── */
const PriceCalc = (() => {
  /*
   * PRICE TABLE — Edit these values with the mechanic's real prices.
   * Format: { "service_key": { "car_type_key": [min_price, max_price] } }
   * Car types: lille (small), mellem (medium), stor (large)
   * Prices in DKK including labour (excl. parts if parts vary too much)
   */
  const PRICES = {
    bremser_for: {
      lille:  [1200, 1800],
      mellem: [1400, 2200],
      stor:   [1800, 2800],
    },
    bremser_bag: {
      lille:  [1100, 1600],
      mellem: [1300, 2000],
      stor:   [1600, 2600],
    },
    olieskift: {
      lille:  [599, 799],
      mellem: [699, 899],
      stor:   [799, 1099],
    },
    daekskifte: {
      lille:  [299, 499],
      mellem: [349, 549],
      stor:   [399, 649],
    },
    stoddaempere: {
      lille:  [2000, 3500],
      mellem: [2400, 4200],
      stor:   [3000, 5500],
    },
    fjedre: {
      lille:  [1800, 3000],
      mellem: [2200, 3800],
      stor:   [2800, 4800],
    },
    tandrem: {
      lille:  [2500, 4000],
      mellem: [3000, 5000],
      stor:   [3800, 6500],
    },
    serviceeftersyn: {
      lille:  [999, 1499],
      mellem: [1199, 1799],
      stor:   [1499, 2299],
    },
    aircon: {
      lille:  [599, 799],
      mellem: [599, 799],
      stor:   [699, 899],
    },
    styretoej: {
      lille:  [800, 1500],
      mellem: [1000, 1800],
      stor:   [1200, 2200],
    },
  };

  const CAR_TYPES = {
    // Map common Danish car models to size category
    toyota_yaris: 'lille', toyota_aygo: 'lille', toyota_corolla: 'mellem', toyota_rav4: 'stor',
    vw_polo: 'lille', vw_golf: 'mellem', vw_passat: 'stor', vw_tiguan: 'stor',
    ford_fiesta: 'lille', ford_focus: 'mellem', ford_kuga: 'stor',
    opel_corsa: 'lille', opel_astra: 'mellem', opel_insignia: 'stor',
    peugeot_208: 'lille', peugeot_308: 'mellem', peugeot_5008: 'stor',
    renault_clio: 'lille', renault_megane: 'mellem', renault_scenic: 'stor',
    skoda_fabia: 'lille', skoda_octavia: 'mellem', skoda_superb: 'stor',
    honda_jazz: 'lille', honda_civic: 'mellem', honda_crv: 'stor',
    hyundai_i20: 'lille', hyundai_i30: 'mellem', hyundai_tucson: 'stor',
    kia_rio: 'lille', kia_ceed: 'mellem', kia_sportage: 'stor',
    nissan_micra: 'lille', nissan_qashqai: 'stor',
    mazda_2: 'lille', mazda_3: 'mellem', mazda_cx5: 'stor',
    seat_ibiza: 'lille', seat_leon: 'mellem',
    citroen_c1: 'lille', citroen_c3: 'lille', citroen_c4: 'mellem',
    fiat_500: 'lille', fiat_punto: 'lille', fiat_tipo: 'mellem',
    volvo_v40: 'mellem', volvo_v60: 'stor', volvo_xc60: 'stor',
    other_lille: 'lille', other_mellem: 'mellem', other_stor: 'stor',
  };

  function formatPrice(n) {
    return n.toLocaleString('da-DK') + ' kr.';
  }

  function init() {
    const form    = document.getElementById('calcForm');
    const result  = document.getElementById('calcResult');
    const minEl   = document.getElementById('calcMin');
    const maxEl   = document.getElementById('calcMax');
    const labelEl = document.getElementById('calcLabel');

    if (!form) return;

    form.addEventListener('change', () => {
      const carVal     = document.getElementById('calcCar')?.value;
      const serviceVal = document.getElementById('calcService')?.value;
      if (!carVal || !serviceVal) return;

      const size  = CAR_TYPES[carVal] || 'mellem';
      const range = PRICES[serviceVal]?.[size];
      if (!range) return;

      const [min, max] = range;
      const serviceLabel = document.getElementById('calcService')?.selectedOptions[0]?.text || '';

      if (labelEl) labelEl.textContent = serviceLabel;
      if (minEl)   minEl.textContent   = formatPrice(min);
      if (maxEl)   maxEl.textContent   = formatPrice(max);
      if (result)  result.classList.add('show');
    });
  }

  return { init, PRICES };
})();

/* ── Init on DOM Ready ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  CookieConsent.init();
  MobileNav.init();
  ScrollAnim.init();
  setActiveNavLink();
  PriceCalc.init();
});

/**
 * Maroon Arsitek — main.js
 * WhatsApp: 088989643555
 */

(function () {
  'use strict';

  /* ── Header scroll behavior ─────────────────────────────────────────────── */
  const header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
    const btn = document.querySelector('.scroll-top');
    btn && btn.classList.toggle('active', window.scrollY > 300);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Scroll to top ──────────────────────────────────────────────────────── */
  const scrollTopBtn = document.querySelector('.scroll-top');
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Nav backdrop (overlay saat mobile nav terbuka) ────────────────────── */
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  /* ── Mobile nav helpers ─────────────────────────────────────────────────── */
  const navMenu   = document.getElementById('navmenu');
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navClose  = document.getElementById('mobile-nav-close');

  function openNav() {
    navMenu && navMenu.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeNav() {
    navMenu && navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
    // Close all dropdowns when nav closes
    document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
  }

  navToggle && navToggle.addEventListener('click', () => {
    navMenu && navMenu.classList.contains('active') ? closeNav() : openNav();
  });

  navClose && navClose.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);

  // Close nav when a non-dropdown link is clicked
  navMenu && navMenu.querySelectorAll('a:not(.dropdown-trigger)').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  /* ── Custom Dropdown Layanan ────────────────────────────────────────────── */
  const dropdowns = document.querySelectorAll('.has-dropdown');

  function closeAllDropdowns(except) {
    dropdowns.forEach(d => {
      if (d !== except) {
        d.classList.remove('open');
        d.dataset.locked = 'false';
        const trigger = d.querySelector('.dropdown-trigger');
        trigger && trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(item => {
    const trigger = item.querySelector('.dropdown-trigger');
    const panel   = item.querySelector('.nav-dropdown');
    if (!trigger || !panel) return;

    const isMobile = () => window.innerWidth < 992;

    // Desktop: hover open/close (hanya jika belum di-lock oleh klik)
    item.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      closeAllDropdowns(item);
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      // Jika diklik oleh pengguna, jangan langsung tutup saat mouseleave
      if (item.dataset.locked === 'true') return;
      item.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });

    // Click: toggle buka & kunci (sticky) / tutup
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      if (isOpen && item.dataset.locked === 'true') {
        // Jika sudah terbuka dan terkunci, klik lagi untuk menutup
        item.classList.remove('open');
        item.dataset.locked = 'false';
        trigger.setAttribute('aria-expanded', 'false');
        trigger.blur();
      } else {
        closeAllDropdowns(item);
        item.classList.add('open');
        item.dataset.locked = 'true'; // Kunci agar tetap terbuka untuk dilihat
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Escape key closes dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeNav();
    }
  });



  /* ── Hero bg loaded class (no parallax) ───────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('load', () => heroBg.classList.add('loaded'));
  }

  /* ── Purecounter (stat numbers) ─────────────────────────────────────────── */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /* ── AOS init ───────────────────────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-in-out', once: true, offset: 60 });
  }

  /* ── GLightbox ──────────────────────────────────────────────────────────── */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  /* ── Portfolio filter (Isotope) ─────────────────────────────────────────── */
  window.addEventListener('load', () => {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    if (!portfolioContainer) return;

    if (typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
      imagesLoaded(portfolioContainer, function () {
        const iso = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item-wrap',
          layoutMode: 'fitRows',
        });
        document.querySelectorAll('.portfolio-filter-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            document.querySelector('.portfolio-filter-btn.active').classList.remove('active');
            this.classList.add('active');
            iso.arrange({ filter: this.dataset.filter });
          });
        });
      });
    }
  });

  /* ── FAQ accordion ──────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const ans = document.getElementById(b.getAttribute('aria-controls'));
        if (ans) ans.style.display = 'none';
      });
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        const ans = document.getElementById(this.getAttribute('aria-controls'));
        if (ans) ans.style.display = 'block';
      }
    });
  });



  /* ── WhatsApp tracking ──────────────────────────────────────────────────── */
  const WA_NUMBER = '62088989643555';
  const WA_MESSAGES = {
    hero:      'Halo Maroon Arsitek, saya ingin konsultasi mengenai proyek bangunan saya.',
    layanan:   'Halo Maroon Arsitek, saya tertarik dengan layanan yang Anda tawarkan.',
    portfolio: 'Halo Maroon Arsitek, saya melihat portofolio Anda dan ingin konsultasi.',
    cta:       'Halo Maroon Arsitek, saya ingin berkonsultasi mengenai rencana bangunan saya.',
  };
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const type = this.dataset.wa || 'cta';
      const msg  = encodeURIComponent(WA_MESSAGES[type] || WA_MESSAGES.cta);
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    });
  });

})();

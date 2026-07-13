/* Toggle from 'no-js' to 'js' on the root element so CSS scroll-reveal rules activate */
document.documentElement.classList.replace('no-js', 'js');

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HEADER SCROLL & NAVIGATION
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Single rAF-throttled scroll handler: header shrink + nav active-state tracking
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Shrink the header once the page is scrolled
    header.classList.toggle('header-scrolled', window.scrollY > 20);

    // Highlight the nav link for the section currently in view
    let current = '';
    const scrollPos = window.scrollY + 120; // Offset for header height
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });

  // Set correct initial state on load
  handleScroll();


  /* ==========================================================================
     2. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }


  /* ==========================================================================
     3. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  /* ==========================================================================
     4. LIFECYCLE FLOW — Stagger animation on scroll
     ========================================================================== */
  const lifecycleSteps = document.querySelectorAll('.lifecycle-step');
  if (lifecycleSteps.length > 0) {
    const lifecycleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('lifecycle-visible');
          }, index * 100);
          lifecycleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    lifecycleSteps.forEach(step => lifecycleObserver.observe(step));
  }


  /* ==========================================================================
     5. PLATFORM NODES — Stagger animation on scroll
     ========================================================================== */
  const platformNodes = document.querySelectorAll('.platform-node');
  if (platformNodes.length > 0) {
    const platformObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('platform-node-visible');
          }, index * 80);
          platformObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    platformNodes.forEach(node => platformObserver.observe(node));
  }


});
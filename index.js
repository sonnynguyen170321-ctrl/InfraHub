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
     4. LIFECYCLE FLOW - Stagger animation on scroll
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
     5. PLATFORM NODES - Stagger animation on scroll
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


  /* ==========================================================================
     6. INQUIRY FORM - client-side validation + simulated submission
     No backend exists, so a valid submission shows success feedback locally.
     ========================================================================== */
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MIN_MESSAGE_LENGTH = 10;
    const SUBMIT_DELAY_MS = 900; // simulated network round-trip

    const submitBtn = document.getElementById('inquiry-submit');
    const resetBtn = document.getElementById('inquiry-reset');
    const formMessage = document.getElementById('form-message');

    // Each rule: the field control, its error span, a validity test, and a message.
    const fields = [
      { id: 'inquiry-name', errorId: 'error-name', test: (v) => v.trim() !== '', msg: 'Please enter your name.' },
      { id: 'inquiry-email', errorId: 'error-email', test: (v) => EMAIL_RE.test(v.trim()), msg: 'Enter a valid work email address.' },
      { id: 'inquiry-company', errorId: 'error-company', test: (v) => v.trim() !== '', msg: 'Please enter your company name.' },
      { id: 'inquiry-use-case', errorId: 'error-use-case', test: (v) => v !== '', msg: 'Select a primary use case.' },
      { id: 'inquiry-message', errorId: 'error-message', test: (v) => v.trim().length >= MIN_MESSAGE_LENGTH, msg: `Add a few more details (at least ${MIN_MESSAGE_LENGTH} characters).` }
    ];

    const consentInput = document.getElementById('inquiry-consent');
    const consentError = document.getElementById('error-consent');

    const setError = (control, errorEl, message) => {
      if (control) control.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    };

    const clearError = (control, errorEl) => {
      if (control) control.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    };

    const hideMessage = () => {
      if (!formMessage) return;
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
      formMessage.replaceChildren();
    };

    // Success feedback is assembled from DOM nodes with textContent (never innerHTML)
    // so user-supplied values can't inject markup.
    const showSuccess = (name, email) => {
      if (!formMessage) return;

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'form-message-icon');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('stroke-width', '2');
      icon.setAttribute('stroke-linecap', 'round');
      icon.setAttribute('stroke-linejoin', 'round');
      icon.setAttribute('aria-hidden', 'true');
      const check = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      check.setAttribute('points', '20 6 9 17 4 12');
      icon.appendChild(check);

      const content = document.createElement('div');
      content.className = 'form-message-content';

      const title = document.createElement('p');
      title.className = 'form-message-title';
      title.textContent = 'Inquiry received';

      const text = document.createElement('p');
      text.className = 'form-message-text';
      const who = name.trim() ? `Thanks, ${name.trim()}. ` : 'Thanks. ';
      text.textContent = `${who}A solutions engineer will reach out to ${email.trim()} within 24 hours.`;

      content.append(title, text);
      formMessage.replaceChildren(icon, content);
      formMessage.className = 'form-message success';
      formMessage.style.display = 'flex';
    };

    const setLoading = (isLoading) => {
      if (!submitBtn) return;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      if (btnText) btnText.style.display = isLoading ? 'none' : '';
      if (btnLoading) btnLoading.style.display = isLoading ? 'inline-flex' : 'none';
      submitBtn.disabled = isLoading;
    };

    // Clear a field's error as soon as the user edits it.
    fields.forEach(({ id, errorId }) => {
      const control = document.getElementById(id);
      const errorEl = document.getElementById(errorId);
      if (!control) return;
      const eventName = control.tagName === 'SELECT' ? 'change' : 'input';
      control.addEventListener(eventName, () => clearError(control, errorEl));
    });
    if (consentInput) {
      consentInput.addEventListener('change', () => clearError(null, consentError));
    }

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideMessage();

      let firstInvalid = null;

      fields.forEach(({ id, errorId, test, msg }) => {
        const control = document.getElementById(id);
        const errorEl = document.getElementById(errorId);
        if (!control) return;
        if (test(control.value)) {
          clearError(control, errorEl);
        } else {
          setError(control, errorEl, msg);
          if (!firstInvalid) firstInvalid = control;
        }
      });

      // Consent is a checkbox - validated on `checked`, not `value`.
      if (consentInput && !consentInput.checked) {
        setError(null, consentError, 'You must agree before submitting.');
        if (!firstInvalid) firstInvalid = consentInput;
      } else {
        clearError(null, consentError);
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const name = document.getElementById('inquiry-name').value;
      const email = document.getElementById('inquiry-email').value;

      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        inquiryForm.reset();
        showSuccess(name, email);
        if (formMessage) formMessage.focus?.();
      }, SUBMIT_DELAY_MS);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        inquiryForm.reset();
        fields.forEach(({ id, errorId }) => {
          clearError(document.getElementById(id), document.getElementById(errorId));
        });
        clearError(null, consentError);
        hideMessage();
      });
    }
  }


});
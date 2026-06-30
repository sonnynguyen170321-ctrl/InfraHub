document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HEADER SCROLL & NAVIGATION
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Mobile Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
      });
    });
  }

  // Smooth scroll active state tracking
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
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
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     2. INTERACTIVE COVERAGE MAP
     ========================================================================== */
  const mapNodes = document.querySelectorAll('.map-node');
  const infoCity = document.getElementById('info-city');
  const infoIp = document.getElementById('info-ip');
  const infoPing = document.getElementById('info-ping');
  const infoSpeed = document.getElementById('info-speed');
  const infoStatus = document.getElementById('info-status');
  const formNodeSelect = document.getElementById('form-nodes');

  // Mapping from Node ID to connected paths in SVG
  const nodePaths = {
    'node-sea': ['route-sea-chi', 'route-chi-ny'],
    'node-la': ['route-la-chi', 'route-chi-ny', 'route-la-dal'],
    'node-dal': ['route-dal-chi', 'route-chi-ny', 'route-dal-mia', 'route-la-dal'],
    'node-chi': ['route-chi-ny', 'route-sea-chi', 'route-la-chi', 'route-dal-chi'],
    'node-ny': ['route-chi-ny', 'route-ny-mia', 'route-ny-lon'],
    'node-mia': ['route-ny-mia', 'route-dal-mia'],
    'node-lon': ['route-ny-lon', 'route-lon-fra'],
    'node-fra': ['route-lon-fra', 'route-ny-lon']
  };

  const clearActivePaths = () => {
    document.querySelectorAll('.map-path').forEach(path => {
      path.classList.remove('active');
    });
  };

  const activatePathsForNode = (nodeId) => {
    clearActivePaths();
    const paths = nodePaths[nodeId];
    if (paths) {
      paths.forEach(pathId => {
        const path = document.getElementById(pathId);
        if (path) path.classList.add('active');
      });
    }
  };

  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      // Toggle node selection active class
      mapNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      // Extract node values
      const name = node.getAttribute('data-name');
      const ip = node.getAttribute('data-ip');
      const ping = node.getAttribute('data-ping');
      const speed = node.getAttribute('data-speed');
      const status = node.getAttribute('data-status');
      const nodeId = node.getAttribute('id');

      // Update sidebar content
      infoCity.textContent = name;
      infoIp.textContent = ip;
      infoPing.textContent = ping;
      infoSpeed.textContent = speed;
      infoStatus.textContent = status;

      // Adjust ping latency indicator design (optimal vs standard warning color)
      const numericPing = parseInt(ping);
      infoPing.className = numericPing < 20
        ? 'map-stat-val latency-indicator latency-optimal'
        : 'map-stat-val latency-indicator latency-standard';

      // Sync active paths
      activatePathsForNode(nodeId);

      // Sync choice to form select dropdown
      if (formNodeSelect) {
        formNodeSelect.value = nodeId;
      }
    });
  });

  // Initialize paths with New York Core node paths active
  activatePathsForNode('node-ny');


  /* ==========================================================================
     3. HARDWARE SPEC CONFIGURATOR
     ========================================================================== */
  const hwCards = document.querySelectorAll('#hardware-selector .select-card');
  const slaCards = document.querySelectorAll('#sla-selector .select-card');
  const bandwidthSlider = document.getElementById('bandwidth-slider');
  const bandwidthValDisplay = document.getElementById('bandwidth-val-display');

  const priceValue = document.getElementById('price-value');
  const summaryHw = document.getElementById('summary-hw');
  const summaryBw = document.getElementById('summary-bw');
  const summarySla = document.getElementById('summary-sla');
  const summaryGuarantee = document.getElementById('summary-guarantee');

  // Specs definitions
  const bandwidthTiers = [
    { text: '10 Gbps', price: 0, guarantee: '99.9%' },
    { text: '40 Gbps', price: 250, guarantee: '99.99%' },
    { text: '100 Gbps', price: 650, guarantee: '99.999%' },
    { text: '400 Gbps', price: 1600, guarantee: '99.999%' }
  ];

  let selectedHwPrice = 450; // Compute base
  let selectedHwName = 'Managed Server';
  
  let selectedSlaMultiplier = 1.0;
  let selectedSlaName = 'Business Hours';

  const updateConfiguratorPricing = () => {
    // Determine slider selected tier
    const sliderIdx = parseInt(bandwidthSlider.value) - 1;
    const bwTier = bandwidthTiers[sliderIdx];
    
    // Update value displays
    bandwidthValDisplay.textContent = bwTier.text;
    summaryBw.textContent = bwTier.text;
    summaryGuarantee.textContent = bwTier.guarantee;

    // Calculate final billing amount
    const totalAmount = Math.round((selectedHwPrice + bwTier.price) * selectedSlaMultiplier);
    
    // Animate price display change
    priceValue.textContent = `$${totalAmount}`;

    // Sync summary elements
    summaryHw.textContent = selectedHwName;
    summarySla.textContent = selectedSlaName;
  };

  // Hardware selection cards listeners
  hwCards.forEach(card => {
    card.addEventListener('click', () => {
      hwCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      selectedHwPrice = parseInt(card.getAttribute('data-base-price'));
      selectedHwName = card.querySelector('.select-card-title').textContent;

      updateConfiguratorPricing();
    });
  });

  // Slider change listener
  if (bandwidthSlider) {
    bandwidthSlider.addEventListener('input', updateConfiguratorPricing);
  }

  // SLA selection cards listeners
  slaCards.forEach(card => {
    card.addEventListener('click', () => {
      slaCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      selectedSlaMultiplier = parseFloat(card.getAttribute('data-multiplier'));
      selectedSlaName = card.querySelector('.select-card-title').textContent;

      updateConfiguratorPricing();
    });
  });

  // Request Config button auto scroll to contact section
  const btnRequestConfig = document.getElementById('btn-request-config');
  const formMessageTextarea = document.getElementById('form-message');

  if (btnRequestConfig && formMessageTextarea) {
    btnRequestConfig.addEventListener('click', (e) => {
      // Build spec message text prefill
      const specSummary = `Requesting custom quote for:\n- Focus: ${selectedHwName}\n- Backbone: ${summaryBw.textContent}\n- Support: ${selectedSlaName}\n- Target Node: ${infoCity.textContent}`;
      formMessageTextarea.value = specSummary;
    });
  }

  // Set initial calculation values
  updateConfiguratorPricing();


  /* ==========================================================================
     4. CONTACT FORM VALIDATION & HANDLING
     ========================================================================== */
  const inquiryForm = document.getElementById('inquiry-form');
  const feedbackMessage = document.getElementById('form-feedback-message');

  if (inquiryForm && feedbackMessage) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect inputs
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const company = document.getElementById('form-company').value.trim();
      const selectedNodeOption = formNodeSelect.options[formNodeSelect.selectedIndex].text;

      // Basic client validation check
      if (!name || !email || !company) {
        feedbackMessage.textContent = 'Please fill out all required fields.';
        feedbackMessage.className = 'form-message error';
        return;
      }

      // Display dynamic success feedback simulating secure server log
      feedbackMessage.innerHTML = `<strong>Ticket Logged Successfully!</strong><br>Our provisioning engineering desk has received your request for <strong>${selectedNodeOption}</strong>. A connection blueprint will be sent to <strong>${email}</strong> shortly.`;
      feedbackMessage.className = 'form-message success';

      // Clear input fields after brief simulation delay
      setTimeout(() => {
        inquiryForm.reset();
        // Keep the success display visible but reset target select value back to current node
        const activeNode = document.querySelector('.map-node.active');
        if (activeNode) {
          formNodeSelect.value = activeNode.getAttribute('id');
        }
      }, 1000);
    });
  }

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS
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

});


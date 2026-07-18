# Multi-Page Services Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the InfraHub website from a single-page site to a multi-page layout by implementing 6 dedicated service pages, cross-linking solutions cards, and adding URL query parameter parsing to pre-populate the inquiry form.

**Architecture:** Create 6 independent static HTML pages matching the Design System tokens (Outfit + Inter font styles, Slate/White theme colors). Update `index.js` to parse `window.location.search` for pre-population, and create a Node.js validation test script to ensure all pages are structured correctly and cross-linked.

**Tech Stack:** Vanilla HTML5, Vanilla CSS3, Vanilla JS (ES6+), Node.js (for testing).

## Global Constraints
*   All styles must reuse variables from `index.css`.
*   All fonts must be Outfit for headings/buttons and Inter for body copy.
*   Unique element IDs must be preserved for testing.
*   No external compilation or packaging dependencies should be added for runtime.

---

### Task 1: URL Query Parameter Parsing for Inquiry Form
**Files:**
*   Modify: `index.js`
*   Create: `tests/test_form_prepop.js`

**Interfaces:**
*   Consumes: URL query parameter strings (e.g., `?service=ddos-protection`)
*   Produces: Automatic dropdown selection in `#inquiry-use-case`

- [ ] **Step 1: Write test simulating URL query parsing**
  Create `tests/test_form_prepop.js`:
  ```javascript
  const fs = require('fs');
  const path = require('path');
  
  // A simple mock for testing the query parsing logic
  const parseQuery = (search) => {
    const params = new URLSearchParams(search);
    const service = params.get('service');
    const mapping = {
      'ip-transit': 'bandwidth',
      'ddos-protection': 'security',
      'wavelengths': 'bandwidth',
      'cloud-connectivity': 'multi-cloud',
      'colocation': 'colocation',
      'managed-noc': 'other'
    };
    return mapping[service] || '';
  };
  
  // Assertions
  const assertions = [
    { input: '?service=ddos-protection', expected: 'security' },
    { input: '?service=ip-transit', expected: 'bandwidth' },
    { input: '?service=wavelengths', expected: 'bandwidth' },
    { input: '?service=cloud-connectivity', expected: 'multi-cloud' },
    { input: '?service=colocation', expected: 'colocation' },
    { input: '?service=managed-noc', expected: 'other' },
    { input: '', expected: '' }
  ];
  
  assertions.forEach(({ input, expected }, index) => {
    const result = parseQuery(input);
    if (result !== expected) {
      console.error(`Test ${index + 1} Failed: Expected "${expected}", got "${result}"`);
      process.exit(1);
    }
  });
  console.log("URL parser tests passed!");
  ```

- [ ] **Step 2: Run test to verify it passes**
  Run: `node tests/test_form_prepop.js`
  Expected: Output "URL parser tests passed!"

- [ ] **Step 3: Modify index.js with parameter parsing**
  Insert logic inside `DOMContentLoaded` event listener:
  ```javascript
  // Parse URL parameter to auto-select and focus the Inquiry Use Case
  const queryParams = new URLSearchParams(window.location.search);
  const serviceParam = queryParams.get('service');
  if (serviceParam) {
    const useCaseSelect = document.getElementById('inquiry-use-case');
    if (useCaseSelect) {
      const mapping = {
        'ip-transit': 'bandwidth',
        'ddos-protection': 'security',
        'wavelengths': 'bandwidth',
        'cloud-connectivity': 'multi-cloud',
        'colocation': 'colocation',
        'managed-noc': 'other'
      };
      const mappedValue = mapping[serviceParam];
      if (mappedValue) {
        useCaseSelect.value = mappedValue;
        // Trigger select change animation or active borders
        useCaseSelect.classList.add('highlight-select');
        setTimeout(() => useCaseSelect.classList.remove('highlight-select'), 2000);
      }
    }
  }
  ```

- [ ] **Step 4: Verify manual styling in CSS**
  Make sure `highlight-select` transition matches our design guidelines.
  Add helper style in `index.css`:
  ```css
  .highlight-select {
    border-color: var(--accent-teal) !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15) !important;
    transition: all 0.5s ease-in-out;
  }
  ```

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add index.js index.css tests/test_form_prepop.js
  git commit -m "feat: add inquiry form url pre-population and query parsing"
  ```

---

### Task 2: Cross-Link Solution Cards and Update Navigation
**Files:**
*   Modify: `index.html`

- [ ] **Step 1: Modify index.html header and footer nav**
  Ensure all relative navigation elements link back to home if navigated from sub-pages (e.g. `index.html#solutions`).
  Replace navigation href elements in `index.html`:
  ```html
  <li><a href="index.html#solutions" id="nav-link-solutions" class="nav-link">Solutions</a></li>
  <li><a href="index.html#lifecycle" id="nav-link-managed" class="nav-link">Managed Services</a></li>
  <li><a href="index.html#industries" id="nav-link-industries" class="nav-link">Industries</a></li>
  <li><a href="index.html#partners" id="nav-link-partners" class="nav-link">Partners</a></li>
  <li><a href="index.html#knowledge-center" id="nav-link-insights" class="nav-link">Insights</a></li>
  <li><a href="index.html#our-approach" id="nav-link-about" class="nav-link">About</a></li>
  <li><a href="index.html#inquiry" id="nav-link-contact" class="nav-link">Contact</a></li>
  ```

- [ ] **Step 2: Modify Solutions Cards with Page Links**
  In the `#solutions` grid in `index.html`, wrap the cards or add "Learn More" links that direct users to the dedicated service pages:
  * Network Infrastructure -> `ip-transit.html` (and Wavelengths)
  * Compute Infrastructure -> `managed-noc.html`
  * Security & Compliance -> `ddos-protection.html`
  * Hybrid & Multi-Cloud -> `cloud-connectivity.html`
  * Edge Deployment -> `colocation.html`
  * Data & Storage -> `wavelengths.html`
  
  Example card wrapper modification:
  ```html
  <div class="solution-card" id="solution-network" onclick="location.href='ip-transit.html'" style="cursor: pointer;">
  ```
  And add a nested hyperlink inside for accessibility:
  ```html
  <a href="ip-transit.html" class="solution-card-link-hidden sr-only">View IP Transit details</a>
  ```

- [ ] **Step 3: Run HTML Syntax Check**
  Verify the modified HTML has valid tag boundaries.
  Run: `npx @google/design.md lint DESIGN.md` (or open index.html locally in browser).

- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add index.html
  git commit -m "feat: cross-link home solutions cards and update navigation paths"
  ```

---

### Task 3: Create IP Transit & Wavelengths Service Pages
**Files:**
*   Create: `ip-transit.html`
*   Create: `wavelengths.html`

- [ ] **Step 1: Write ip-transit.html using core template**
  Scaffold the page including header, hero with `?service=ip-transit` CTA, spec grid (Port Speeds, Route Optimization, Multi-Homing, SLA Uptime), partners (Lumen, NTT, Telstra, Arista), advantage details, and footer.
- [ ] **Step 2: Write wavelengths.html using core template**
  Scaffold the page with hero with `?service=wavelengths` CTA, spec grid (Data Capacity, Optical Path, Latency Profile, Framer Options), partners (Ciena, Infinera, Lumen), advantage details, and footer.
- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add ip-transit.html wavelengths.html
  git commit -m "feat: add dedicated IP Transit and Wavelengths service pages"
  ```

---

### Task 4: Create DDoS Protection & Cloud Connectivity Pages
**Files:**
*   Create: `ddos-protection.html`
*   Create: `cloud-connectivity.html`

- [ ] **Step 1: Write ddos-protection.html**
  Scaffold page with hero with `?service=ddos-protection` CTA, spec grid (Scrubbing Capacity, Mitigation Speed, Stack Coverage, Reporting), partners (Cloudflare, Radware, Cisco), and footer.
- [ ] **Step 2: Write cloud-connectivity.html**
  Scaffold page with hero with `?service=cloud-connectivity` CTA, spec grid (Cloud Networks, Dedicated Ports, Egress Cost Reductions, Active-Active Redundancy), partners (Equinix, AWS, Azure, Google Cloud), and footer.
- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add ddos-protection.html cloud-connectivity.html
  git commit -m "feat: add dedicated DDoS Protection and Cloud Connectivity pages"
  ```

---

### Task 5: Create Colocation & Managed NOC Pages
**Files:**
*   Create: `colocation.html`
*   Create: `managed-noc.html`

- [ ] **Step 1: Write colocation.html**
  Scaffold page with hero with `?service=colocation` CTA, spec grid (Cabinets & Cages, Redundant A/B Power, PUE <1.2, Cross-Connects), partners (Equinix, Digital Realty, Dell Technologies), and footer.
- [ ] **Step 2: Write managed-noc.html**
  Scaffold page with hero with `?service=managed-noc` CTA, spec grid (24/7 Monitoring NOC, Incident Response SLA, Telemetry Alerting, Firmware Maintenance), partners (Cisco, Arista, Dell), and footer.
- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add colocation.html managed-noc.html
  git commit -m "feat: add dedicated Colocation and Managed NOC pages"
  ```

---

### Task 6: Visual & Functional Integration Testing
**Files:**
*   Create: `tests/validate_pages.js`

- [ ] **Step 1: Write validate_pages.js testing script**
  Create `tests/validate_pages.js` script to assert all pages have valid HTML, correct header, matching query params in CTAs, and reference `index.css`:
  ```javascript
  const fs = require('fs');
  const path = require('path');
  
  const files = [
    'index.html',
    'ip-transit.html',
    'ddos-protection.html',
    'wavelengths.html',
    'cloud-connectivity.html',
    'colocation.html',
    'managed-noc.html'
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.error(`Validation Failed: File ${file} does not exist!`);
      process.exit(1);
    }
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Check CSS link
    if (!html.includes('href="index.css"')) {
      console.error(`Validation Failed: ${file} is missing index.css reference!`);
      process.exit(1);
    }
    
    // Check Header and Footer existence
    if (!html.includes('class="logo"') || !html.includes('class="footer"')) {
      console.error(`Validation Failed: ${file} is missing standard header or footer structure!`);
      process.exit(1);
    }
    
    // Check absolute-style navigation linking
    if (file !== 'index.html' && !html.includes('href="index.html#solutions"')) {
      console.error(`Validation Failed: ${file} does not have home-relative navigation links!`);
      process.exit(1);
    }
  });
  console.log("All pages validated successfully!");
  ```
- [ ] **Step 2: Run verification script**
  Run: `node tests/validate_pages.js`
  Expected: Output "All pages validated successfully!"
- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add tests/validate_pages.js
  git commit -m "test: add final page validation test suite"
  ```

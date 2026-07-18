# Spec: InfraHub Multi-Page Services Expansion
**Date:** 2026-07-18
**Status:** Approved (Pending Final Review)

---

## 1. Executive Summary
InfraHub is expanding from a single-page marketing website into a comprehensive multi-page layout. The objective is to showcase the owner's extensive network capabilities—combining partner services with consulting expertise—while keeping the clean, high-performance "technical minimalism" aesthetic intact. 

We will introduce **6 dedicated service pages** detailing specific specifications, partner fabrics, and consulting workflows.

---

## 2. Page Architecture & File Naming
The following HTML files will be created in the project root directory:

1. **[ip-transit.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/ip-transit.html)**: Resilient Global IP Transit
2. **[ddos-protection.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/ddos-protection.html)**: Volumetric DDoS Protection & Edge Scrubbing (formerly DDoS Mitigation)
3. **[wavelengths.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/wavelengths.html)**: Dedicated Private Optical Wavelengths & Transport
4. **[cloud-connectivity.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/cloud-connectivity.html)**: Private Cloud On-Ramps & Hybrid Connects
5. **[colocation.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/colocation.html)**: Carrier-Neutral Colocation & Infrastructure Hosting
6. **[managed-noc.html](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/managed-noc.html)**: 24/7/365 Managed Network Operations & NOC Services

---

## 3. Visual & Aesthetic Standards
All service pages must align with the parameters defined in [DESIGN.md](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/DESIGN.md) and [index.css](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/index.css):
*   **Colors:** Backgrounds are pure white (`var(--bg-primary)`) or soft gray (`var(--bg-secondary)`); border lines are thin (`var(--border-color)`); accents use Electric Blue (`var(--accent-blue)`) and Tech Teal (`var(--accent-teal)`).
*   **Typography:** Outfit font for all headings, statistics, and badges; Inter font for all body copy and descriptors.
*   **Modularity:** Reuse inline SVGs for icons and structural spacing.

---

## 4. Detailed Service Page Template Structure
Each new page will contain:

### A. Navigation & Header Integration
*   The header `<nav>` matches `index.html` exactly.
*   Nav links link back to the homepage sections using root-relative anchors (e.g. `href="index.html#solutions"` instead of `href="#solutions"`).

### B. Service Hero Section
*   A page-specific category badge.
*   A bold, high-contrast Outfit heading.
*   A concise, 2-line service value proposition description.
*   Two buttons:
    1.  **Primary CTA:** Link back to the inquiry form with a pre-population query parameter (e.g., `index.html?service=ip-transit#inquiry`).
    2.  **Secondary Action:** Smooth scroll link to the Technical Specifications section (e.g., `href="#specs"`).

### C. Technical Specifications Grid
*   A 2x2 grid of modern, high-contrast cards showcasing specific performance parameters and technical capabilities.
*   Uses a clean border structure (`border: 1px solid var(--border-color)`) and subtle hover motion (`transform: translateY(-4px)`).

### D. Strategic Partner Ecosystem
*   Shows the specific logo-locks for partners powering this specific service.
*   Integrates inline SVG logos or clean typographic locks (matching the marquee branding).

### E. InfraHub Consulting Advantage
*   Details our consulting and advisory value-add: path engineering, multi-homing optimization, vendor contract negotiations, and NOC escalation policies.

### F. Inquiry Form Connection
*   CTA button triggers form pre-selection in [index.js](file:///c:/Users/admin/Desktop/Sonny%20&%20AI/InfraHub/InfraHub/index.js).
*   When a user clicks a button with a query parameter (e.g., `?service=ddos-protection`), the form's `inquiry-use-case` dropdown will automatically select the matching use case (e.g. `security`).

---

## 5. Implementation Steps
1.  **Modify Navigation & Routing:**
    *   Update homepage `index.html` navigation links to absolute paths if they are opened from sub-pages (our multi-page approach uses page-level root checking, or we can update home navigation to local anchors and other pages to page-linked anchors).
    *   Inject JavaScript logic in `index.js` to parse URL query parameters (like `?service=ddos-protection`) and auto-select the corresponding dropdown value in the inquiry form.
2.  **Scaffold Page Templates:** Create the 6 HTML files using the structural template, applying appropriate badges, headings, bento stats, and partners.
3.  **Cross-Link Homepage Solution Cards:** Wrap the 6 solution cards in `index.html` with direct anchor links to the new service pages.
4.  **Validate Design Specs:** Run `npx @google/design.md lint DESIGN.md` to ensure design system compliance and check responsive layouts across viewports.

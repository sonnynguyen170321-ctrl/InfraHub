# InfraHub: Technology Stack & Core Components

This rule defines the approved tech stack, assets, and key interactive components for the InfraHub codebase.

## Approved Tech Stack
- **Structure:** Clean Semantic HTML5 markup (no structural templates or visual compilation layers).
- **Styling:** Custom Vanilla CSS3 (no styling frameworks like TailwindCSS unless requested).
- **Logic:** Vanilla JavaScript (ES6+, DOM Event listeners, clean modular state).
- **Typography Fonts:**
  - *Outfit* (Google Fonts): Used for structural headings, values, statistics, and buttons.
  - *Inter* (Google Fonts): Used for body copy, paragraphs, and labels.
- **Icons & Visuals:** Inline SVGs are preferred for crisp layout rendering, low page footprint, and animation.

## Key Interactive Components
Ensure any refactoring of interactive components preserves their core behaviors:
1. **Interactive SVG Latency Map:** Node click states, path line activations (`.active` dynamic animation classes), and latency statistics updates in the sidebar info card.
2. **Pricing Cost Estimator:** Live recalculation updates whenever range sliders (bandwidth selection) or select cards (hardware type, SLA tier multipliers) change state.
3. **Inquiry Form validation:** Submits dynamically with visual success/error messages.

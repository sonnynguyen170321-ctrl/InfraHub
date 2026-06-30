# InfraHub: Coding Guidelines & Quality Standards

This rule outlines the styling variables, class design, SEO best practices, and performance standards for the InfraHub codebase.

## Styling & Theme Rules
- Color tokens must be managed using the global custom CSS variables defined in `:root` inside `index.css`:
  - `--bg-primary` (#ffffff)
  - `--bg-secondary` (#f8fafc)
  - `--border-color` (#e2e8f0)
  - `--text-primary` (#0f172a)
  - `--text-secondary` (#475569)
  - `--accent-blue` (#2563eb)
  - `--accent-teal` (#0d9488)
- Cards and containers should use a standard corner radius:
  - Small elements: `4px`
  - Medium elements/buttons: `8px`
  - Large panels/cards: `12px`
- Avoid heavy shadows. Prefer thin gray slate borders (`1px solid var(--border-color)`) and minimal shadows (`rgba(15, 23, 42, 0.04)`).

## SEO & Accessibility
- Ensure all interactive controls have descriptive, unique `id` values for easy accessibility and testing.
- Maintain a clear heading hierarchy (`h1` -> `h2` -> `h3`).
- Include meta-tags (viewport, description, title) within `index.html`.

## Performance
- Keep custom JS logic lightweight. Use event-delegation or DOMContentLoaded listeners.
- Minimize external HTTP assets. SVG graphics must remain inline in the markup.

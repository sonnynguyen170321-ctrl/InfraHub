# Memory System

This file captures project context, preferences, rules, and lessons learned. It must be kept current and updated in place when corrections occur.

---

## Voice
- **Tone:** Professional, direct, technical, minimalist.
- **Style:** Clear, concise communication. Focus on concrete code examples and instructions without preamble.
- **Formatting:** Clickable standard links for all files (forward slash paths on Windows) without wrapping link labels in backticks.

---

## Process
- **Design Process:** Establish core custom properties (HSL tokens, fonts, variables) first in `index.css`. Maintain structured semantic elements in `index.html`. Add clean JS scripts in `index.js`.
- **Customizations:** Workspace customization rules reside under `.claude/rules/` for unconditional directives. Custom skills reside under `.agents/skills/<name>/SKILL.md`.
- **Design Tokens:** Follow the Google Labs `DESIGN.md` specification in the workspace root and validate using `npx @google/design.md lint DESIGN.md`.
- **Claude SWARM Framework:**
  - **Scope:** Break missions into right-sized tasks with clear roles, file boundaries, and success criteria.
  - **Wire:** Wire up dependencies so agents auto-block until prerequisites are met; coordinate via a shared mailbox.
  - **Assign:** Assign models strategically: Opus for team leads, Sonnet for builders, Haiku for validators.
  - **Run:** Launch, monitor, and manage rogue or stuck agents.
  - **Merge:** Team lead compiles results, validators confirm quality, and agents shut down while logging cost/templates.


---

## People
- **Client/User:** Sonny (InfraHub operator). Prefers high-performance network designs, custom automation plugins, and clean minimalist layouts.

---

## Projects
- **InfraHub Website:** Highly optimized single-page Hardware & Network services portal built using semantic HTML5, custom vanilla CSS (Outfit + Inter fonts, electric blue and teal accents), and modern JS. Implemented scroll reveal IntersectionObserver animations for all sections. Status: **Complete**.
- **Claude Code Setup:** Modular rules generated under `.claude/rules/` and skills registered under `.agents/skills/claude-automation-recommender/`. Status: **Complete**.
- **NotebookLM connection:** Installed `notebooklm-mcp-cli` globally/via pip, with executable available in AppData Roaming PATH. Sign-in script is ready for manual browser authentication. Status: **Complete**.

---

## Output
- **File Names:** All files should have clear casing (`CLAUDE.md`, `DESIGN.md`, `index.html`).
- **Media Assets:** Capture browser viewport screenshots to verify layout interactions and place them in the artifact directory, referenced with absolute POSIX paths.

---

## Tools
- **Claude Code CLI:** Standalone CLI tool (`claude` v2.1.177) available at `C:\Users\admin\.local\bin\claude.exe`. Slash commands `/plugin` are not available in non-interactive shell mode.
- **Design.md Linter:** Lints design token formats via `npx @google/design.md lint DESIGN.md`.
- **Python Helpers:** Use python's standard library (e.g. `html.parser`) for HTML parsing scratch tasks to avoid missing external package dependencies (like `BeautifulSoup`).

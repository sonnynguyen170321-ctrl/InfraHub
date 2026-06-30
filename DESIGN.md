---
version: "alpha"
name: InfraHub Design System
description: Modern, minimalist, white corporate design system for the InfraHub Hardware & Network Services platform.
colors:
  bg-primary: "#ffffff"
  bg-secondary: "#f8fafc"
  bg-tertiary: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#94a3b8"
  accent-blue: "#2563eb"
  accent-blue-hover: "#1d4ed8"
  accent-blue-light: "#eff6ff"
  accent-teal: "#0d9488"
  accent-teal-hover: "#0f766e"
  accent-teal-light: "#f0fdfa"
  border-color: "#e2e8f0"
  border-color-active: "#cbd5e1"
typography:
  heading-hero:
    fontFamily: Outfit
    fontSize: 3.5rem
    fontWeight: 800
    lineHeight: 1.1
  heading-section:
    fontFamily: Outfit
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.15
  body-base:
    fontFamily: Inter
    fontSize: 1rem
    lineHeight: 1.6
  badge-caps:
    fontFamily: Outfit
    fontSize: 0.85rem
    fontWeight: 600
    letterSpacing: 0.05em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  container: 1200px
  header-height: 80px
components:
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.bg-primary}"
    fontFamily: Outfit
    fontWeight: 600
    borderRadius: "{rounded.md}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border-color}"
    fontFamily: Outfit
    fontWeight: 600
    borderRadius: "{rounded.md}"
---

## Overview

High-Performance Technical Minimalism. The visual identity of InfraHub conveys extreme reliability, lightning-fast bandwidth speeds, and clean operational transparency. It draws key alignment from PacketFabric's technical networking grids but re-interprets it under a bright, high-contrast, professional "white modern" palette.

---

## Colors

The palette is rooted in pure whites, slate gray structure lines, and deep slate typography, using electric blue and tech teal to trace network connectivity paths and interactive signals.

- **Backgrounds:** Clean white (`bg-primary`) and soft gray (`bg-secondary`) partition page grids.
- **Typography:** Jet slate (`text-primary`) guarantees WCAG AAA legibility, paired with slate gray (`text-secondary`) for descriptors.
- **Accents:** Electric Blue (`accent-blue`) drives primary actions and routing focuses; Tech Teal (`accent-teal`) signals active link status, optimal latency, and sub-badges.

---

## Typography

InfraHub uses two primary typefaces:

- **Outfit:** A technical, geometric neo-grotesque used for headers, badges, statistical values, and interface buttons to convey structure and engineering accuracy.
- **Inter:** A highly legible screen-optimized font used for body text, lists, and forms to maximize information readability.

---

## Layout

Layout elements align to a centralized `1200px` container grid with thin, sharp borders (`border-color`). Content blocks utilize structural line dividers rather than heavy background blocks to maintain a modern, airy layout.

---

## Elevation & Depth

Minimal shadows. Depths are indicated using subtle state transitions and layout borders:
- Standard cards use no shadow or a very soft drop shadow (`0 4px 12px rgba(15, 23, 42, 0.04)`).
- Hover states transition cards slightly upward (`-4px`) and increase borders to highlight interaction.

---

## Shapes

Sharp, structured corners with a slight technical curve:
- Badges and indicators use pill shapes (`100px` radius).
- Control selectors, range thumbs, and inputs use a standard `8px` corner radius.
- Large grids and product cards use a `12px` corner radius.

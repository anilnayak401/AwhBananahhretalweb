# AWHHBANANAHH 🍊

> Pure juice, pure life. A hyper-visual product marketing website.

## Overview

Award-level brand website for AWHHBANANAHH cold-pressed juices. Built with Three.js, GSAP ScrollTrigger, and Lenis smooth scroll.

## Getting Started

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

## Stack

| Tool | Purpose |
|------|---------|
| Three.js r128 | 3D particle systems |
| GSAP 3.12 + ScrollTrigger | Scroll-driven animations |
| Lenis | Smooth scroll |
| Vanilla JS | No framework overhead |

## Structure

```
├── index.html          # Main entry point
├── src/
│   ├── main.js         # All JS — interactions, Three.js, GSAP
│   └── styles.css      # Design system + all styles
├── hero-loop.mp4       # Hero background video (240 frames @ 24fps)
├── cta-loop.mp4        # CTA section particle animation
├── ing-loop.mp4        # Ingredients orbital animation
├── favicon.svg         # Brand favicon
├── manifest.json       # PWA manifest
└── robots.txt          # SEO
```

## Sections

1. **Hero** — Looping video background, animated headline
2. **Visual Strip** — Full-width photo grid
3. **Products** — 6 flavours with filter tabs, particle hover effects, quick-view modal
4. **Story** — Brand narrative with parallax images
5. **Ingredients** — Orbital animation, process steps, masonry gallery
6. **Reviews** — Auto-advancing slider
7. **CTA** — Particle explosion background, order section

## Running with a local server

The videos require HTTP to stream correctly. Always use `npm start` rather than opening `index.html` directly.

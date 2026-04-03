# Implementation Plan: Hyper-Visual Product Marketing Website — AWHHBANANAHH

## Overview

Incremental build-out of the immersive React + Vite + Three.js + GSAP site. Each task wires directly into the previous, ending with a fully integrated experience. All code is TypeScript. Property-based tests use `fast-check` + Vitest; E2E uses Playwright.

---

## Tasks

- [ ] 1. Project scaffold and core type definitions
  - Initialise Vite + React + TypeScript project
  - Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@gsap/react`, `fast-check`, `vitest`, `playwright`
  - Create `src/types/index.ts` — export all interfaces from the design: `SceneManager`, `Scene`, `ScrollController`, `TransitionEngine`, `ParticleSystem`, `PerformanceMonitor`, `AssetLoader`, `CursorTracker`, `AudioEngine`, `FidelityProfile`, `ProductModel`, `SceneConfig`, `LoaderState`, `CursorState`, `EmitConfig`, `AssetManifest`, `AssetEntry`, `TransitionConfig`
  - Create `src/data/products.ts` — export the six `ProductModel` entries: Solar Burst, Jungle Green, Berry Riot, Citrus Storm, Lime Splash, Sangria Sun (with placeholder texture paths under `public/textures/`)
  - Create `src/data/scenes.ts` — export five `SceneConfig` entries wiring products to scenes
  - _Requirements: 2.4, 4.1, 8.3_

- [ ] 2. WebGL capability detection and 2D fallback
  - [ ] 2.1 Implement `src/lib/capabilityProbe.ts`
    - Export `detectCapability(): 'webgpu' | 'webgl2' | 'webgl1' | 'none'`
    - Probe in order: WebGPU adapter → WebGL2 context → WebGL1 context → none
    - _Requirements: 3.5, 5.5_
  - [ ]* 2.2 Write unit tests for `capabilityProbe`
    - Test each branch: mock `navigator.gpu`, mock `getContext` returns
    - `src/__tests__/unit/capabilityProbe.test.ts`
    - _Requirements: 3.5, 5.5_
  - [ ] 2.3 Implement `src/components/FallbackScene.tsx`
    - CSS-only animated 2D version preserving brand palette and product names
    - Rendered when capability is `'none'`
    - _Requirements: 5.5_

- [ ] 3. Asset loader with retry and fallback
  - [ ] 3.1 Implement `src/lib/AssetLoader.ts`
    - Implement `AssetLoader` interface: `load()`, `preloadScene()`, `onProgress()`, `onComplete()`, `onError()`
    - Prioritise `manifest.critical` before `manifest.deferred` (enqueue critical first)
    - Retry each failed asset up to `maxRetries` times with exponential backoff (200ms, 400ms, 800ms)
    - Substitute `fallbackUrl` after retries exhausted; populate `LoaderState.failedAssets`
    - Emit monotonically non-decreasing progress values in [0, 100]
    - _Requirements: 8.1, 8.3, 8.4_
  - [ ]* 3.2 Write property test — Property 17: Loader progress is monotonically non-decreasing and bounded
    - **Property 17: Loader progress is monotonically non-decreasing and bounded**
    - **Validates: Requirements 8.1**
    - `src/__tests__/property/assetLoader.property.ts`
  - [ ]* 3.3 Write property test — Property 19: Critical assets are enqueued before deferred assets
    - **Property 19: Critical assets are enqueued before deferred assets**
    - **Validates: Requirements 8.3**
    - `src/__tests__/property/assetLoader.property.ts`
  - [ ]* 3.4 Write property test — Property 20: Asset retry exhaustion triggers fallback substitution
    - **Property 20: Asset retry exhaustion triggers fallback substitution**
    - **Validates: Requirements 8.4**
    - `src/__tests__/property/assetLoader.property.ts`
  - [ ]* 3.5 Write unit tests for `AssetLoader`
    - Test: progress sequence [0, 25, 50, 75, 100], empty manifest, all retries exhausted with no fallback
    - `src/__tests__/unit/assetLoader.test.ts`
    - _Requirements: 8.1, 8.3, 8.4_

- [ ] 4. Branded loader overlay UI
  - [ ] 4.1 Implement `src/components/LoaderOverlay.tsx`
    - Animated progress bar (0–100%) with AWHHBANANAHH brand typography and colour palette
    - Accepts `LoaderState` as props; renders `phase: 'loading'` and `phase: 'revealing'` states
    - Cinematic reveal animation on `phase: 'complete'` using GSAP, duration configurable in [800, 1500]ms
    - _Requirements: 8.1, 8.2_
  - [ ]* 4.2 Write property test — Property 18: Cinematic reveal duration is within [800, 1500]ms
    - **Property 18: Cinematic reveal duration is within [800, 1500]ms**
    - **Validates: Requirements 8.2**
    - `src/__tests__/property/assetLoader.property.ts`

- [ ] 5. Checkpoint — loader pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Performance monitor
  - [ ] 6.1 Implement `src/lib/PerformanceMonitor.ts`
    - Rolling 2-second FPS window; `sample(timestamp)` updates `currentFPS`
    - Emit `onFidelityChange` when FPS drops below 45 for >2s → reduce to lower tier
    - Emit `onFidelityChange` when FPS rises above 55 for >2s after a reduction → restore previous tier
    - Never reduce below `'low'`; export `FIDELITY_PROFILES` constant mapping level → `FidelityProfile`
    - _Requirements: 5.1, 5.2_
  - [ ]* 6.2 Write property test — Property 8: PerformanceMonitor reduces fidelity after sustained low FPS
    - **Property 8: PerformanceMonitor reduces fidelity after sustained low FPS**
    - **Validates: Requirements 5.1**
    - `src/__tests__/property/performanceMonitor.property.ts`
  - [ ]* 6.3 Write property test — Property 9: PerformanceMonitor restores fidelity after sustained high FPS
    - **Property 9: PerformanceMonitor restores fidelity after sustained high FPS**
    - **Validates: Requirements 5.2**
    - `src/__tests__/property/performanceMonitor.property.ts`
  - [ ]* 6.4 Write unit tests for `PerformanceMonitor`
    - Test: boundary FPS values (44, 45, 55, 56), oscillation prevention, floor at `'low'`
    - `src/__tests__/unit/performanceMonitor.test.ts`
    - _Requirements: 5.1, 5.2_

- [ ] 7. Scroll controller
  - [ ] 7.1 Implement `src/lib/ScrollController.ts`
    - Map scroll position to normalised progress [0, 1] per scene using GSAP ScrollTrigger
    - `lock()` / `unlock()` prevent scroll input while `locked === true`
    - Block downward scroll when `currentScene` equals last scene index
    - Debounce rapid trackpad momentum to prevent simultaneous transition triggers
    - Fire `onSceneChange` callbacks on scene boundary crossing
    - _Requirements: 2.1, 2.3, 2.5_
  - [ ]* 7.2 Write property test — Property 1: Scroll progress mapping is monotonically non-decreasing
    - **Property 1: Scroll progress mapping is monotonically non-decreasing**
    - **Validates: Requirements 2.1**
    - `src/__tests__/property/scrollController.property.ts`
  - [ ]* 7.3 Write property test — Property 4: Final scene blocks downward scroll
    - **Property 4: Final scene blocks downward scroll**
    - **Validates: Requirements 2.5**
    - `src/__tests__/property/scrollController.property.ts`
  - [ ]* 7.4 Write unit tests for `ScrollController`
    - Test: lock/unlock, final scene boundary, scene change callback firing
    - `src/__tests__/unit/scrollController.test.ts`
    - _Requirements: 2.1, 2.3, 2.5_

- [ ] 8. Transition engine
  - [ ] 8.1 Implement `src/lib/TransitionEngine.ts`
    - Implement `execute(from, to, durationMs)` — clamp `durationMs` to [600, 1200]
    - Support transition types: `dissolve`, `shatter`, `warp`, `curtain`, `morph` via GSAP timelines
    - Return a `Promise` that resolves only after the full transition completes
    - Integrate with `ScrollController.lock()` / `unlock()` — lock on start, unlock on resolve
    - _Requirements: 2.2, 2.3_
  - [ ]* 8.2 Write property test — Property 2: Transition duration is always within [600, 1200]ms
    - **Property 2: Transition duration is always within [600, 1200]ms**
    - **Validates: Requirements 2.2**
    - `src/__tests__/property/transitionEngine.property.ts`
  - [ ]* 8.3 Write property test — Property 3: Scroll is locked for the full duration of a transition
    - **Property 3: Scroll is locked for the full duration of a transition**
    - **Validates: Requirements 2.3**
    - `src/__tests__/property/transitionEngine.property.ts`
  - [ ]* 8.4 Write unit tests for `TransitionEngine`
    - Test: duration boundary values (600, 1200), lock/unlock handshake, promise resolution timing
    - `src/__tests__/unit/transitionEngine.test.ts`
    - _Requirements: 2.2, 2.3_

- [ ] 9. Checkpoint — scroll and transition pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Three.js renderer setup and scene manager
  - [ ] 10.1 Implement `src/lib/SceneManager.ts`
    - Maintain ordered `Scene[]` from `SceneConfig` data
    - `transitionTo(index)` delegates to `TransitionEngine`, locks scroll, resolves promise on complete
    - `update(delta)` ticks the active scene
    - Wire `ScrollController.onSceneChange` → `transitionTo`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ] 10.2 Implement `src/components/ThreeCanvas.tsx`
    - Mount `@react-three/fiber` `<Canvas>` with the Three.js renderer
    - Single `requestAnimationFrame` loop: `PerformanceMonitor.sample()` → `ScrollController.update()` → `ParticleSystem.tick()` → `SceneManager.update()` → render
    - Pass `FidelityProfile` from `PerformanceMonitor` down to renderer settings (shadow maps, pixel ratio)
    - _Requirements: 1.2, 5.1, 5.2_
  - [ ]* 10.3 Write unit tests for `SceneManager`
    - Test: `transitionTo` out-of-bounds index, scroll lock handshake, scene update delegation
    - `src/__tests__/unit/sceneManager.test.ts`
    - _Requirements: 2.1, 2.3, 2.4_

- [ ] 11. Procedural 3D product models with PBR textures
  - [ ] 11.1 Implement `src/lib/ProductGeometry.ts`
    - Export `buildBottleGeometry()` → `THREE.CylinderGeometry` with cap detail for juice bottles/glasses
    - Export `buildFruitGeometry(type)` → `THREE.SphereGeometry` variants for fruit accent meshes
    - Apply PBR `MeshStandardMaterial` with `map` (diffuse), `metalnessMap` (specular), `roughnessMap`, `normalMap`, `envMap` from `ProductModel.pbrMaps`
    - _Requirements: 4.1_
  - [ ] 11.2 Implement `src/lib/ProductScene.ts` — `Scene` implementation for product showcase
    - Instantiate bottle + fruit geometries per product; apply product image JPG as diffuse texture on a `PlaneGeometry` card behind the model
    - Implement `enter()` / `exit()` GSAP timelines
    - Implement entrance animation: assemble model from scattered fragments over `entranceDurationMs` (800ms default)
    - Implement drag-to-rotate: pointer delta `(dx, dy)` → rotation `(dy, dx)` at 1:1 ratio
    - Implement double-click/double-tap zoom-in to detail view within 500ms
    - Support environment map reflections that update on rotation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]* 11.3 Write property test — Property 6: All ProductModel instances have complete PBR map definitions
    - **Property 6: All ProductModel instances have complete PBR map definitions**
    - **Validates: Requirements 4.1**
    - `src/__tests__/property/productModel.property.ts`
  - [ ]* 11.4 Write property test — Property 7: Drag-to-rotate applies a 1:1 angular ratio
    - **Property 7: Drag-to-rotate applies a 1:1 angular ratio**
    - **Validates: Requirements 4.2**
    - `src/__tests__/property/productModel.property.ts`
  - [ ]* 11.5 Write unit tests for `ProductScene`
    - Test: entrance animation fires on `enter()`, drag rotation delta mapping, zoom animation timing
    - `src/__tests__/unit/productScene.test.ts`
    - _Requirements: 4.2, 4.3, 4.5_

- [ ] 12. Particle system
  - [ ] 12.1 Implement `src/lib/ParticleSystem.ts`
    - GPU-instanced `THREE.InstancedMesh` pool; `maxParticles` up to 50,000
    - `emit(config)`: animate instances from random positions to `targetPositions` point cloud within `durationMs`
    - `explode(origin)`: disperse all active particles outward then reassemble into product model within 1,200ms
    - `dissolve(durationMs)`: smoothly return particles to idle within given duration (hover-out: 400ms)
    - `setFidelityLevel(level)`: cap `activeCount` per `FidelityProfile.maxParticles`
    - CSS keyframe fallback path when WebGL 2.0 unavailable (detected via `capabilityProbe`)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 12.2 Write property test — Property 5: Hover always emits at least 2,000 particles
    - **Property 5: Hover always emits at least 2,000 particles**
    - **Validates: Requirements 3.1**
    - `src/__tests__/property/particleSystem.property.ts`
  - [ ]* 12.3 Write unit tests for `ParticleSystem`
    - Test: emit count floor, explode + reassemble timing, dissolve timing, fidelity cap, CSS fallback activation
    - `src/__tests__/unit/particleSystem.test.ts`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 13. Checkpoint — 3D rendering and particles
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Hero section scene
  - [ ] 14.1 Implement `src/scenes/HeroScene.ts` — `Scene` implementation
    - Full-screen 3D animated scene: floating product bottles with ambient rotation and colour-reactive lighting
    - Looping ambient animation at target 60 FPS
    - Cursor parallax: `CursorTracker` position → real-time distortion offset applied within 16ms (single rAF tick)
    - Mobile: gyroscope `DeviceOrientationEvent` or touch-drag → scene rotation (direction-preserving)
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [ ]* 14.2 Write property test — Property 21: Cursor coordinate mapping preserves direction
    - **Property 21: Cursor coordinate mapping preserves direction**
    - **Validates: Requirements 1.3**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ]* 14.3 Write property test — Property 22: Mobile input mapping preserves direction
    - **Property 22: Mobile input mapping preserves direction**
    - **Validates: Requirements 1.5**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ] 14.4 Implement `src/components/HeroOverlay.tsx`
    - DOM overlay: headline, sub-headline, primary CTA button
    - Legible against all animation states via contrast-safe colour tokens from the brand palette
    - _Requirements: 1.4_

- [ ] 15. Remaining scenes (2–5)
  - [ ] 15.1 Implement `src/scenes/ProductGridScene.ts` (Scene 2)
    - Grid of all six `Product_Card` components; hover triggers `ParticleSystem.emit()`, click triggers `ParticleSystem.explode()`
    - _Requirements: 2.4, 3.1, 3.2_
  - [ ] 15.2 Implement `src/scenes/StoryScene.ts` (Scene 3)
    - Scroll-driven narrative: brand story text reveals synced to GSAP ScrollTrigger scrub timeline
    - _Requirements: 2.1, 2.4_
  - [ ] 15.3 Implement `src/scenes/IngredientsScene.ts` (Scene 4)
    - Exploded-view fruit geometry orbiting a central bottle; ingredient labels fade in on scroll
    - _Requirements: 2.4, 4.1_
  - [ ] 15.4 Implement `src/scenes/CtaScene.ts` (Scene 5 — final)
    - Looping end-state animation; downward scroll blocked by `ScrollController`
    - Full-screen CTA with brand palette
    - _Requirements: 2.4, 2.5_

- [ ] 16. Cursor tracker and micro-interaction system
  - [ ] 16.1 Implement `src/lib/CursorTracker.ts`
    - Replace OS cursor; custom DOM element follows pointer with configurable lag clamped to [40, 80]ms
    - Spring-physics morph on hover over interactive elements within 150ms
    - Ripple/burst effect at exact click coordinates `(x, y)`
    - Magnetic attraction: pull cursor toward element centre when pointer within 40px of boundary; `magnetTarget = null` beyond 40px
    - Idle detection: `idleAnimating = true` after 5s no input; any pointer event resets timer and sets `idleAnimating = false`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ] 16.2 Implement `src/components/CursorOverlay.tsx`
    - Render custom cursor DOM element driven by `CursorState`; register all interactive elements as magnetic targets
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 16.3 Write property test — Property 10: Custom cursor lag is always within [40, 80]ms
    - **Property 10: Custom cursor lag is always within [40, 80]ms**
    - **Validates: Requirements 6.1**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ]* 16.4 Write property test — Property 11: Click ripple originates at click coordinates
    - **Property 11: Click ripple originates at click coordinates**
    - **Validates: Requirements 6.3**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ]* 16.5 Write property test — Property 12: Magnetic attraction activates within 40px and not beyond
    - **Property 12: Magnetic attraction activates within 40px and not beyond**
    - **Validates: Requirements 6.4**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ]* 16.6 Write property test — Property 13: Idle detection triggers after 5 seconds of no input
    - **Property 13: Idle detection triggers after 5 seconds of no input**
    - **Validates: Requirements 6.5**
    - `src/__tests__/property/cursorTracker.property.ts`
  - [ ]* 16.7 Write unit tests for `CursorTracker`
    - Test: lag clamp boundaries, magnetic radius boundary (39px vs 41px), idle timer reset, ripple origin
    - `src/__tests__/unit/cursorTracker.test.ts`
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [ ] 17. Audio engine
  - [ ] 17.1 Implement `src/lib/AudioEngine.ts`
    - Web Audio API wrapper; default `enabled = false`
    - `toggle()`: wraps `AudioContext.resume()` in try/catch; on autoplay block sets `promptVisible = true`
    - `setScene(index)`: switch ambient track to scene-configured audio
    - `playSFX(id, position?)`: spatial audio effect; no-op when `enabled === false`
    - Haptic: on `Product_Card` click, call `navigator.vibrate(duration)` with duration clamped to [30, 60]ms if Vibration API available
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ] 17.2 Implement `src/components/AudioHUD.tsx`
    - Visible mute/unmute toggle button; non-intrusive "Enable Audio" prompt when `promptVisible`
    - _Requirements: 7.1, 7.5_
  - [ ]* 17.3 Write property test — Property 14: Audio scene track changes with active scene
    - **Property 14: Audio scene track changes with active scene**
    - **Validates: Requirements 7.2**
    - `src/__tests__/property/audioEngine.property.ts`
  - [ ]* 17.4 Write property test — Property 15: Spatial SFX plays if and only if audio is enabled
    - **Property 15: Spatial SFX plays if and only if audio is enabled**
    - **Validates: Requirements 7.3**
    - `src/__tests__/property/audioEngine.property.ts`
  - [ ]* 17.5 Write property test — Property 16: Haptic pulse duration is within [30, 60]ms
    - **Property 16: Haptic pulse duration is within [30, 60]ms**
    - **Validates: Requirements 7.4**
    - `src/__tests__/property/audioEngine.property.ts`
  - [ ]* 17.6 Write unit tests for `AudioEngine`
    - Test: default muted state, autoplay block handling, SFX no-op when disabled, haptic clamp
    - `src/__tests__/unit/audioEngine.test.ts`
    - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [ ] 18. Checkpoint — cursor, audio, and micro-interactions
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. App shell wiring and integration
  - [ ] 19.1 Implement `src/App.tsx`
    - Instantiate `AssetLoader` → feed `LoaderState` to `<LoaderOverlay>`
    - On `AssetLoader.onComplete`: run cinematic reveal, mount `<ThreeCanvas>` with `SceneManager`
    - Mount `<CursorOverlay>`, `<AudioHUD>` as DOM overlays
    - Render `<FallbackScene>` when `capabilityProbe()` returns `'none'`
    - Wire `PerformanceMonitor.onFidelityChange` → `ParticleSystem.setFidelityLevel` + renderer settings
    - Wire `ScrollController.onSceneChange` → `AudioEngine.setScene`
    - Wire `Product_Card` hover/click → `ParticleSystem.emit` / `ParticleSystem.explode` + `AudioEngine.playSFX` + haptic
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 5.1, 5.5, 7.1, 8.1, 8.2_
  - [ ] 19.2 Implement `src/components/ProductCard.tsx`
    - Interactive card wrapping `ProductScene`; fires hover/click events to `ParticleSystem` and `CursorTracker`
    - _Requirements: 3.1, 3.2, 3.4, 6.2_

- [ ] 20. E2E smoke tests
  - [ ]* 20.1 Write Playwright smoke tests
    - Test: page loads without JS errors, loader overlay appears and completes, hero section is visible, at least one product card is present
    - `src/__tests__/e2e/smoke.spec.ts`
    - _Requirements: 1.1, 8.1, 8.2_

- [ ] 21. Final checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` with `numRuns: 100` minimum; tag format: `// Feature: hyper-visual-product-website, Property N: <text>`
- No `.glb` files — all 3D geometry is procedural (`CylinderGeometry`, `SphereGeometry`); product JPGs are applied as textures
- Place product image JPGs under `public/textures/` and reference them in `src/data/products.ts`
- Checkpoints ensure incremental validation before moving to the next phase

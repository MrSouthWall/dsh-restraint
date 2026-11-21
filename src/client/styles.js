const ZHIMING_CSS = `
/* =========================================================================
   Restraint Dual-Theme Cohesive Design System
   - Light Mode (data-zm-theme="light"): Imperial Xuan-Paper & Bronze Gold
   - Dark Mode  (data-zm-theme="dark") : Obsidian Starfield & Celestial Gold
   ========================================================================= */

.zm-root, .zm-chat-card {
  --zm-compact-button-height: 28px;
  --zm-bg: #faf7f0;
  --zm-surface: #ffffff;
  --zm-surface-soft: #f4eee2;
  --zm-border: rgba(176, 134, 62, 0.24);
  --zm-border-strong: rgba(176, 134, 62, 0.50);
  --zm-text: #1c2230;
  --zm-text-sub: #4c5569;
  --zm-text-muted: #788194;
  --zm-stage-bg: radial-gradient(circle at 50% 44%, #fffef9 0%, #f7f0e2 56%, #ece1cc 100%);
  --zm-stage-border: rgba(180, 136, 56, 0.42);
  --zm-stage-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(130, 96, 38, 0.11);
  --zm-stage-bracket: rgba(168, 120, 38, 0.55);
  --zm-glass: rgba(255, 253, 248, 0.86);
  --zm-glass-border: rgba(176, 134, 62, 0.30);
  --zm-gold: #9a6700;
  --zm-gold-bright: #c58f24;
  --zm-green: #047857;
  --zm-red: #c81e3a;
  --zm-amber: #b45309;
  --zm-blue: #1d4ed8;
  --zm-indigo: #4338ca;
  --zm-purple: #7c3aed;
  --zm-pink: #be185d;
  --zm-btn-gold-bg: linear-gradient(135deg, #b57c18, #8c5a09);
  --zm-btn-gold-hover: linear-gradient(135deg, #c78b1e, #9c660e);
  --zm-bar-track: rgba(154, 103, 0, 0.10);
}

@media (prefers-color-scheme: dark) {
  .zm-chat-card {
    --zm-bg: #080c17;
    --zm-surface: #101627;
    --zm-surface-soft: #151e34;
    --zm-border: rgba(240, 201, 117, 0.20);
    --zm-border-strong: rgba(240, 201, 117, 0.45);
    --zm-text: #f3f5fa;
    --zm-text-sub: #c2cadc;
    --zm-text-muted: #8b96b2;
    --zm-gold: #f0c975;
    --zm-gold-bright: #fae2a0;
    --zm-green: #34d399;
    --zm-red: #fb7185;
    --zm-amber: #fbbf24;
    --zm-blue: #60a5fa;
    --zm-indigo: #a5b4fc;
    --zm-purple: #d8b4fe;
    --zm-pink: #f472b6;
  }
}

html[data-theme="dark"] .zm-chat-card,
.dark .zm-chat-card {
  --zm-bg: #080c17;
  --zm-surface: #101627;
  --zm-surface-soft: #151e34;
  --zm-border: rgba(240, 201, 117, 0.20);
  --zm-border-strong: rgba(240, 201, 117, 0.45);
  --zm-text: #f3f5fa;
  --zm-text-sub: #c2cadc;
  --zm-text-muted: #8b96b2;
  --zm-gold: #f0c975;
  --zm-gold-bright: #fae2a0;
  --zm-green: #34d399;
  --zm-red: #fb7185;
  --zm-amber: #fbbf24;
  --zm-blue: #60a5fa;
  --zm-indigo: #a5b4fc;
  --zm-purple: #d8b4fe;
  --zm-pink: #f472b6;
}

.zm-root[data-zm-theme="dark"] {
  --zm-bg: #080c17;
  --zm-surface: #0f1526;
  --zm-surface-soft: #151e34;
  --zm-border: rgba(240, 201, 117, 0.18);
  --zm-border-strong: rgba(240, 201, 117, 0.44);
  --zm-text: #f3f5fa;
  --zm-text-sub: #c2cadc;
  --zm-text-muted: #8894b0;
  --zm-stage-bg: radial-gradient(circle at 50% 44%, #141d3a 0%, #0b1023 56%, #070a15 100%);
  --zm-stage-border: rgba(240, 201, 117, 0.34);
  --zm-stage-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 14px 36px rgba(0, 0, 0, 0.56);
  --zm-stage-bracket: rgba(240, 201, 117, 0.52);
  --zm-glass: rgba(11, 16, 33, 0.80);
  --zm-glass-border: rgba(240, 201, 117, 0.28);
  --zm-gold: #f0c975;
  --zm-gold-bright: #fae2a0;
  --zm-green: #34d399;
  --zm-red: #fb7185;
  --zm-amber: #fbbf24;
  --zm-blue: #60a5fa;
  --zm-indigo: #a5b4fc;
  --zm-purple: #d8b4fe;
  --zm-pink: #f472b6;
  --zm-btn-gold-bg: linear-gradient(135deg, #c48a20, #8f5e0c);
  --zm-btn-gold-hover: linear-gradient(135deg, #d89b28, #a46d12);
  --zm-bar-track: rgba(255, 255, 255, 0.09);
  color-scheme: dark;
}

.zm-root[data-zm-theme="light"] {
  color-scheme: light;
}

@keyframes zm-spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes zm-spin-rev {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes zm-pulse-glow {
  0%, 100% { opacity: 0.72; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
@keyframes zm-fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes zm-dash-flow {
  from { stroke-dashoffset: 36; }
  to { stroke-dashoffset: 0; }
}
@keyframes zm-twinkle {
  0%, 100% { opacity: 0.24; }
  50% { opacity: 0.94; }
}
@keyframes zm-aura-breathe {
  0%, 100% { opacity: 0.56; transform: scale(0.985); }
  50% { opacity: 1; transform: scale(1.025); }
}

@media (prefers-reduced-motion: reduce) {
  .zm-spin-slow, .zm-spin-rev, .zm-decorative-orbit, .zm-pulse-glow, .zm-animate, .zm-chat-card, .zm-dash-flow, .zm-twinkle, .zm-aura {
    animation: none !important;
    transition: none !important;
  }
}

.zm-spin-slow { animation: zm-spin-slow 46s linear infinite; transform-box: fill-box; transform-origin: center; }
.zm-spin-rev { animation: zm-spin-rev 62s linear infinite; transform-box: fill-box; transform-origin: center; }
.zm-decorative-orbit {
  animation: zm-spin-slow var(--zm-orbit-duration, 72s) linear infinite var(--zm-orbit-direction, normal);
  transform-box: view-box;
  transform-origin: center;
}
.zm-pulse-glow { animation: zm-pulse-glow 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.zm-dash-flow { animation: zm-dash-flow 1.8s linear infinite; }
.zm-twinkle { animation: zm-twinkle 3.4s ease-in-out infinite; }
.zm-aura { animation: zm-aura-breathe 3.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

/* Root Layout */
.zm-workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding-top: var(--dsh-frame-top-clearance, 0px);
}

.zm-workspace > .zm-root {
  flex: 1;
}

.zm-workspace-empty {
  --zm-text: var(--dsw-alias-label-primary, currentColor);
  --zm-surface: var(--dsw-alias-bg-base, transparent);
  --zm-surface-soft: var(--dsw-alias-interactive-bg-hover, transparent);
  --zm-border-strong: var(--dsw-alias-border-l, currentColor);
  --zm-gold-bright: var(--dsw-alias-state-business-primary, currentColor);
  display: grid;
  flex: 1;
  align-content: center;
  justify-items: center;
  gap: 12px;
  padding: 24px;
  overflow: auto;
  text-align: center;
}

.zm-workspace-empty h1,
.zm-workspace-empty p { margin: 0; }
.zm-workspace-empty h1 { font-size: 22px; }
.zm-workspace-empty p { color: var(--dsw-alias-label-secondary, inherit); }

.zm-root {
  --zm-field-height: 34px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  container-type: inline-size;
  background: var(--zm-bg);
  color: var(--zm-text);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  position: relative;
  transition: background-color 0.22s ease, color 0.22s ease;
}

.zm-root * { box-sizing: border-box; }

.zm-btn:focus-visible,
.zm-nav-pill:focus-visible,
.zm-dayun-pill:focus-visible,
.zm-qimen-cell:focus-visible,
.zm-hex-card:focus-visible,
.zm-zw-cell:focus-visible,
.zm-bar-row:focus-visible,
.zm-stage-tab:focus-visible,
.zm-theme-seg button:focus-visible {
  outline: 2px solid var(--zm-gold-bright);
  outline-offset: 2px;
}

/* SVG focus follows the chart geometry instead of the group's bounding box. */
.zm-root svg .zm-chart-control:focus {
  outline: none;
  box-shadow: none;
}

.zm-chart-focus-ring {
  fill: none;
  stroke: var(--zm-text);
  stroke-width: 1.5px;
  stroke-dasharray: 3 3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
  visibility: hidden;
}

.zm-chart-control:focus-visible > .zm-chart-focus-ring {
  visibility: visible;
}

/* Header & Navigation */
.zm-hero-bar {
  position: relative;
  padding: 10px 14px 9px;
  border-bottom: 1px solid var(--zm-border);
  background: var(--zm-surface);
  flex-shrink: 0;
}

.zm-hero-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
}

.zm-brand-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  margin-inline-end: auto;
}

.zm-brand-title {
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: var(--zm-text);
}

.zm-brand-sub {
  font-size: 10.5px;
  color: var(--zm-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zm-hero-group {
  display: flex;
  align-items: center;
  max-width: 100%;
  gap: 6px;
}

.zm-hero-top .zm-btn-sm {
  min-height: var(--zm-field-height);
}

.zm-hero-top .zm-history-clear { display: inline-grid; }
.zm-history-clear > span { grid-area: 1 / 1; }
.zm-history-clear:not([data-confirm-clear]) > span:last-child,
.zm-history-clear[data-confirm-clear] > span:first-child { visibility: hidden; }
.zm-history-clear[data-confirm-clear] {
  color: var(--zm-red);
  border-color: color-mix(in srgb, var(--zm-red) 50%, transparent);
}

.zm-button-group, .zm-form-footer {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  max-width: 100%;
}

.zm-button-group { gap: 5px; }

.zm-button-group > button, .zm-form-footer > button {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
}

/* Light / Dark Theme Segmented Switch */
.zm-theme-seg {
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background: var(--zm-surface-soft);
  border: 1px solid var(--zm-border);
  gap: 2px;
}
.zm-theme-seg button {
  min-height: var(--zm-compact-button-height);
  padding: 3px 9px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--zm-text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
}
.zm-theme-seg button.zm-on {
  background: var(--zm-surface);
  color: var(--zm-gold);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.zm-nav {
  display: flex;
  gap: 5px;
  margin-top: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.zm-nav::-webkit-scrollbar { display: none; }

.zm-nav > .zm-nav-pill { flex-shrink: 0; }

.zm-nav-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--zm-border);
  background: var(--zm-surface-soft);
  color: var(--zm-text-sub);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.16s ease;
}
.zm-nav-pill:hover {
  border-color: var(--zm-border-strong);
  color: var(--zm-text);
}
.zm-nav-pill.zm-active {
  background: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 16%, var(--zm-surface));
  border-color: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 58%, var(--zm-border));
  color: var(--zm-text);
}

.zm-nav-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  background: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 18%, transparent);
  color: var(--zm-accent, var(--zm-gold));
}

.zm-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding: 12px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

@supports not (scrollbar-gutter: stable) {
  .zm-body { overflow-y: scroll; }
}

.zm-animate { animation: zm-fade-up 0.24s ease-out; }

/* =========================================================================
   Monumental Pure-Visual Showcase Canvas (Cohesive in BOTH Light & Dark!)
   ========================================================================= */
.zm-canvas {
  --zm-canvas-tabs-height: calc(var(--zm-compact-button-height) + 10px);
  position: relative;
  border-radius: 16px;
  padding: 8px;
  background: var(--zm-stage-bg);
  border: 1px solid var(--zm-stage-border);
  box-shadow: var(--zm-stage-shadow);
  color: var(--zm-text);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Engraved corner hairline brackets */
.zm-canvas::before, .zm-canvas::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--zm-stage-bracket);
  border-style: solid;
  pointer-events: none;
  z-index: 3;
}
.zm-canvas::before {
  top: 7px; left: 7px;
  border-width: 1.5px 0 0 1.5px;
  border-top-left-radius: 4px;
}
.zm-canvas::after {
  bottom: 7px; right: 7px;
  border-width: 0 1.5px 1.5px 0;
  border-bottom-right-radius: 4px;
}

.zm-canvas-bar {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: var(--zm-canvas-tabs-height) calc(var(--zm-compact-button-height) + 4px);
  position: relative;
  z-index: 3;
}

@container (min-width: 520px) {
  .zm-canvas-bar {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: var(--zm-canvas-tabs-height);
    column-gap: 6px;
  }
}

.zm-canvas-artwork {
  width: 100%;
  max-width: 440px;
  min-height: 280px;
  aspect-ratio: 1;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.zm-canvas-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.zm-canvas-content > * {
  flex: none;
  margin: auto;
}

.zm-stage-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  gap: 3px;
  padding: 2.5px;
  border-radius: 16px;
  background: var(--zm-glass);
  border: 1px solid var(--zm-glass-border);
  backdrop-filter: blur(8px);
}
.zm-stage-tab {
  min-height: var(--zm-compact-button-height);
  padding: 4px clamp(5px, 2cqi, 10px);
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--zm-text-sub);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.zm-stage-tab:hover { color: var(--zm-text); }
.zm-stage-tab.zm-on {
  background: color-mix(in srgb, var(--zm-gold-bright) 24%, transparent);
  color: var(--zm-gold);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--zm-gold-bright) 48%, transparent);
}

.zm-canvas-footer {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: var(--zm-canvas-tabs-height) 29px;
  position: relative;
  z-index: 3;
}

@container (min-width: 720px) {
  .zm-canvas-footer {
    display: flex;
    justify-content: center;
    height: var(--zm-canvas-tabs-height);
  }
  .zm-canvas-footer .zm-canvas-row:empty { display: none; }
}

.zm-canvas-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 1px 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}
.zm-canvas-row::-webkit-scrollbar { display: none; }
.zm-canvas-row > * { flex: none; white-space: nowrap; }
.zm-canvas-row > .zm-stage-tabs, .zm-canvas-row > .zm-button-group {
  flex-wrap: nowrap;
  max-width: none;
}
.zm-canvas-bar .zm-canvas-row:last-child > .zm-stage-tabs { padding-block: 0; }
.zm-canvas-footer .zm-canvas-row > :first-child { margin-inline-start: auto; }
.zm-canvas-footer .zm-canvas-row > :last-child { margin-inline-end: auto; }
.zm-canvas-footer .zm-stage-tab { padding-inline: clamp(4px, 1.7cqi, 10px); }
.zm-canvas-row .zm-glass-pill {
  padding: 2px clamp(5px, 1.4cqi, 10px);
  line-height: 1.35;
}

.zm-glass-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--zm-glass);
  border: 1px solid var(--zm-glass-border);
  color: var(--zm-text);
  backdrop-filter: blur(8px);
}

/* Cards & Controls */
.zm-card {
  background: var(--zm-surface);
  border: 1px solid var(--zm-border);
  border-radius: 12px;
  padding: 11px 13px;
  position: relative;
}

.zm-card-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--zm-text);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.zm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 34px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--zm-border-strong);
  background: var(--zm-surface);
  color: var(--zm-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.zm-btn:hover:not(:disabled) {
  background: var(--zm-surface-soft);
  border-color: var(--zm-gold-bright);
}
.zm-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.zm-btn-primary {
  background: color-mix(in srgb, var(--zm-gold-bright) 18%, var(--zm-surface));
  color: var(--zm-gold);
  border-color: var(--zm-gold-bright);
}

.zm-btn-gold {
  background: var(--zm-btn-gold-bg);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}
.zm-btn-gold:hover:not(:disabled) {
  background: var(--zm-btn-gold-hover);
  color: #ffffff;
}

.zm-btn-sm {
  min-height: var(--zm-compact-button-height);
  padding: 5px 9px;
  font-size: 11px;
  border-radius: 7px;
}

.zm-deepseek-mark {
  display: block;
  flex: 0 0 auto;
}

.zm-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--zm-border);
  background: var(--zm-surface-soft);
  color: var(--zm-text-sub);
}

button.zm-chip {
  min-height: var(--zm-compact-button-height);
  justify-content: center;
  padding: 3px 9px;
}

.zm-tip-banner {
  border-radius: 10px;
  padding: 8px 11px;
  border: 1px solid var(--zm-border);
  background: color-mix(in srgb, var(--zm-gold-bright) 8%, var(--zm-surface));
  font-size: 11.5px;
  color: var(--zm-text-sub);
}
.zm-tip-banner strong { color: var(--zm-text); }

/* Collapsible details summary */
.zm-details {
  border: 1px solid var(--zm-border);
  border-radius: 12px;
  background: var(--zm-surface);
  overflow: hidden;
}
.zm-details > summary {
  list-style: none;
  cursor: pointer;
  padding: 10px 13px;
  font-size: 12px;
  font-weight: 700;
  color: var(--zm-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  user-select: none;
}
.zm-details > summary::-webkit-details-marker { display: none; }
.zm-details > summary::after {
  content: '';
  flex: none;
  width: 6px;
  height: 6px;
  margin-inline-end: 2px;
  border-inline-end: 1.5px solid var(--zm-text-muted);
  border-block-end: 1.5px solid var(--zm-text-muted);
  transform: rotate(-45deg);
}
.zm-details[open] > summary {
  border-bottom: 1px solid var(--zm-border);
}
.zm-details[open] > summary::after { transform: rotate(45deg); }
.zm-details-body {
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Forms */
.zm-form, .zm-person-form {
  container-type: inline-size;
}

.zm-form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: end;
  gap: 10px;
}

@container (min-width: 310px) {
  .zm-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@container (min-width: 540px) {
  .zm-form-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.zm-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 3px;
}
.zm-field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--zm-text-muted);
}
.zm-input, .zm-select {
  width: 100%;
  min-width: 0;
  height: var(--zm-field-height);
  padding: 0 10px;
  border-radius: 7px;
  border: 1px solid var(--zm-border-strong);
  background: var(--zm-bg);
  color: var(--zm-text);
  font-family: inherit;
  font-size: 12px;
  line-height: 16px;
  outline: none;
}
.zm-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.zm-select:not(:disabled):hover,
.zm-select[aria-expanded="true"] {
  border-color: var(--zm-gold-bright);
  background: var(--zm-surface-soft);
}
.zm-select-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zm-select-chevron {
  flex-shrink: 0;
  color: var(--zm-text-sub);
}
.zm-select[aria-expanded="true"] .zm-select-chevron {
  transform: rotate(180deg);
}
.zm-history-select {
  min-width: 0;
  width: clamp(100px, 23cqi, 148px);
}
.zm-select:disabled { opacity: 0.55; cursor: default; }
.zm-input:focus, .zm-select:focus-visible {
  border-color: var(--zm-gold-bright);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--zm-gold-bright) 22%, transparent);
  outline: none;
}

.zm-choice-menu {
  position: fixed;
  inset: auto;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--zm-border-strong);
  border-radius: 9px;
  background: var(--zm-surface);
  color: var(--zm-text);
  box-shadow: var(--zm-stage-shadow);
}
.zm-choice-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 34px;
  padding: 6px 9px;
  border-radius: 5px;
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  cursor: pointer;
  user-select: none;
}
.zm-choice-option[aria-selected="true"] {
  color: var(--zm-gold);
  font-weight: 600;
}
.zm-choice-option[data-active] {
  background: color-mix(in srgb, var(--zm-gold-bright) 20%, var(--zm-surface));
}
.zm-choice-option svg { flex-shrink: 0; }

.zm-select:focus-visible:not([aria-expanded="true"]) {
  background: var(--zm-surface-soft);
}
.zm-check-label {
  display: inline-flex;
  align-items: center;
  min-height: var(--zm-field-height);
  gap: 6px;
  font-size: 12px;
  color: var(--zm-text-sub);
  cursor: pointer;
}
.zm-check-label > input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: var(--zm-gold);
}
.zm-form-footer {
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.zm-profiles-trigger {
  color: var(--zm-gold);
}

.zm-profile-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 9px;
  border: 1px solid var(--zm-border);
  border-radius: 9px;
  background: color-mix(in srgb, var(--zm-gold-bright) 7%, var(--zm-surface));
}
.zm-profile-applied {
  flex: 1 1 105px;
  color: var(--zm-green);
  font-size: 11px;
  overflow-wrap: anywhere;
}
.zm-profile-applied:empty { display: none; }
.zm-person-heading {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
}

.zm-profiles-dialog {
  width: min(500px, calc(100% - 24px));
  max-height: min(640px, calc(100dvh - 24px));
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--zm-border-strong);
  border-radius: 15px;
  background: var(--zm-surface);
  color: var(--zm-text);
  box-shadow: 0 20px 64px rgba(8, 10, 18, 0.28);
}
.zm-profiles-dialog[open] {
  display: flex;
  flex-direction: column;
}
.zm-profiles-dialog::backdrop { background: rgba(8, 10, 18, 0.45); }
.zm-profiles-header {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--zm-border);
  background: var(--zm-bg);
}
.zm-profiles-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
}
.zm-profiles-close { min-width: 28px; font-size: 17px; line-height: 1; }
.zm-profiles-body {
  min-height: 0;
  padding: 14px 16px;
  overflow: auto;
  overscroll-behavior: contain;
}
.zm-profiles-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.zm-profiles-toolbar .zm-input { flex: 1 1 140px; }
.zm-profiles-list {
  display: grid;
  gap: 7px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}
.zm-profile-entry {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 12px;
  padding: 9px 11px;
  border: 1px solid var(--zm-border);
  border-radius: 8px;
  background: var(--zm-bg);
}
.zm-profile-summary { flex: 1 1 140px; min-width: 0; overflow-wrap: anywhere; }
.zm-profile-meta {
  color: var(--zm-text-sub);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.zm-profiles-empty { margin: 0; padding: 24px 8px; color: var(--zm-text-sub); text-align: center; }
.zm-profiles-confirm { margin: 0 0 16px; overflow-wrap: anywhere; }
.zm-profiles-error, .zm-profiles-notice { margin: 0 0 10px; font-size: 12px; }
.zm-profiles-error, .zm-profiles-delete { color: var(--zm-red); }
.zm-profiles-notice { color: var(--zm-green); }
.zm-profiles-footer {
  flex: none;
  padding: 9px 16px;
  border-top: 1px solid var(--zm-border);
  color: var(--zm-text-sub);
  font-size: 11px;
}

/* Date and time fields */
.zm-picker-control { position: relative; }
.zm-picker-input {
  padding-inline-end: 36px;
  font-variant-numeric: tabular-nums;
}
.zm-picker-control[data-open] .zm-picker-input { border-color: var(--zm-gold-bright); }
.zm-picker-input:user-invalid,
.zm-picker-year input[aria-invalid="true"] { border-color: var(--zm-red); }
.zm-picker-toggle {
  position: absolute;
  inset-block: 3px;
  inset-inline-end: 3px;
  width: 27px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--zm-gold);
  cursor: pointer;
}
.zm-picker-toggle:hover, .zm-picker-toggle[aria-expanded="true"] { background: var(--zm-surface-soft); }

.zm-picker-popover {
  --zm-picker-fill: #8a5b22;
  --zm-picker-on-fill: #fffaf1;
  --zm-picker-tint: color-mix(in srgb, var(--zm-gold-bright) 12%, var(--zm-surface));
  position: fixed;
  inset: auto;
  margin: 0;
  padding: 11px;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--zm-border-strong);
  border-radius: 13px;
  background: linear-gradient(180deg, var(--zm-bg), var(--zm-surface) 82px);
  color: var(--zm-text);
  box-shadow: var(--zm-stage-shadow), 0 6px 16px rgba(28, 20, 8, 0.14);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.zm-root[data-zm-theme="dark"] .zm-picker-popover {
  --zm-picker-fill: #edc77e;
  --zm-picker-on-fill: #291c0c;
}
.zm-picker-popover button {
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.zm-picker-popover button:hover:not(:disabled) { background: var(--zm-picker-tint); }
.zm-picker-popover button:disabled { opacity: 0.35; cursor: default; }
.zm-picker-popover button:focus-visible,
.zm-picker-toggle:focus-visible,
.zm-picker-time-list:focus-visible {
  outline: 2px solid var(--zm-gold-bright);
  outline-offset: -2px;
}
.zm-picker-header, .zm-picker-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}
.zm-picker-header {
  justify-content: space-between;
  margin-bottom: 6px;
}
.zm-picker-nav { flex-shrink: 0; }
.zm-picker-popover .zm-picker-month-heading {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 30px;
  padding: 3px 6px;
  text-align: start;
  font-size: 14px;
  font-weight: 700;
}
.zm-picker-month-heading svg { color: var(--zm-gold); flex-shrink: 0; }
.zm-picker-month-heading[aria-expanded="true"] svg { transform: rotate(180deg); }
.zm-picker-popover .zm-picker-arrow {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--zm-border);
  background: var(--zm-surface);
  color: var(--zm-text-sub);
}
.zm-picker-calendar {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 2px;
}
.zm-picker-calendar th {
  height: 24px;
  color: var(--zm-text-sub);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}
.zm-picker-calendar td { padding: 0; }
.zm-picker-popover .zm-picker-day {
  display: grid;
  place-items: center;
  width: 100%;
  height: 29px;
  font-weight: 600;
}
.zm-picker-popover .zm-picker-day[data-outside] { color: var(--zm-text-muted); font-weight: 400; }
.zm-picker-popover .zm-picker-day[aria-current="date"] { box-shadow: inset 0 0 0 1px var(--zm-border-strong); }
.zm-picker-popover td[aria-selected="true"] .zm-picker-day,
.zm-picker-popover td[aria-selected="true"] .zm-picker-day:hover:not(:disabled) {
  background: var(--zm-picker-fill);
  color: var(--zm-picker-on-fill);
  font-weight: 700;
}
.zm-picker-year {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 7px 4px 10px;
  color: var(--zm-text-sub);
}
.zm-picker-year input {
  width: 72px;
  height: 29px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.zm-picker-months {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
}
.zm-picker-popover .zm-picker-month { min-height: 31px; background: var(--zm-bg); }
.zm-picker-popover .zm-picker-month[aria-pressed="true"] { background: var(--zm-picker-tint); color: var(--zm-gold); font-weight: 700; }
.zm-picker-clock {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
.zm-picker-time-label {
  margin: 0 0 6px;
  color: var(--zm-text-sub);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}
.zm-picker-time-list {
  position: relative;
  height: 170px;
  padding: 3px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--zm-border-strong) transparent;
  border: 1px solid var(--zm-border);
  border-radius: 8px;
  background: var(--zm-bg);
}
.zm-picker-time-option {
  display: grid;
  place-items: center;
  min-height: 27px;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}
.zm-picker-time-option:hover { background: var(--zm-picker-tint); }
.zm-picker-time-option[aria-selected="true"] {
  background: var(--zm-picker-fill);
  color: var(--zm-picker-on-fill);
  font-weight: 700;
}
.zm-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--zm-border);
}
.zm-picker-footer-date { justify-content: flex-end; }
.zm-picker-popover .zm-picker-action,
.zm-picker-popover .zm-picker-confirm { min-height: 29px; padding: 4px 10px; font-weight: 600; }
.zm-picker-popover .zm-picker-footer-date .zm-picker-action { color: var(--zm-gold); }
.zm-picker-popover .zm-picker-confirm {
  min-width: 58px;
  background: var(--zm-picker-fill);
  color: var(--zm-picker-on-fill);
}
.zm-picker-popover .zm-picker-confirm:hover:not(:disabled) {
  background: color-mix(in srgb, var(--zm-picker-fill) 89%, var(--zm-picker-on-fill));
}

/* Five Elements & Progress Bars */
.zm-wuxing-grid {
  display: grid;
  grid-template-columns: 146px 1fr;
  gap: 12px;
  align-items: center;
}
.zm-bar-row {
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr 38px;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  background: none;
  border: none;
  padding: 3px 0;
  color: inherit;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.zm-bar-track {
  height: 7px;
  border-radius: 999px;
  background: var(--zm-bar-track);
  overflow: hidden;
}
.zm-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

/* DaYun Timeline */
.zm-dayun-strip {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.zm-dayun-pill {
  flex: 0 0 auto;
  min-width: 64px;
  padding: 7px 9px;
  border-radius: 9px;
  border: 1px solid var(--zm-border);
  background: var(--zm-bg);
  color: inherit;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font: inherit;
}
.zm-dayun-pill:hover, .zm-dayun-pill.zm-selected {
  border-color: var(--zm-gold-bright);
  background: color-mix(in srgb, var(--zm-gold-bright) 14%, var(--zm-surface));
}

/* Qimen 3x3 LuoShu Grid (inside theme-adaptive canvas) */
.zm-qimen-grid {
  width: 100%;
  min-height: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 6px;
}
.zm-qimen-cell {
  width: 100%;
  border-radius: 11px;
  border: 1px solid var(--zm-glass-border);
  background: var(--zm-glass);
  color: var(--zm-text);
  padding: 6px 8px;
  min-height: 85px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  text-align: left;
  font: inherit;
  transition: all 0.16s ease;
}
.zm-qimen-cell:hover {
  border-color: var(--zm-indigo);
  transform: translateY(-1px);
}
.zm-qimen-cell.zm-selected {
  border-color: var(--zm-gold-bright);
  box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--zm-gold-bright) 48%, transparent);
}
.zm-qimen-cell.zm-radar-hit {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--zm-blue) 65%, transparent);
}
.zm-qimen-cell.zm-center {
  background: color-mix(in srgb, var(--zm-gold-bright) 12%, var(--zm-glass));
  border-style: dashed;
  border-color: var(--zm-gold-bright);
}

/* Meihua 3-Stage Cards */
.zm-hex-stage {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}
.zm-hex-card {
  width: 100%;
  border-radius: 11px;
  border: 1px solid var(--zm-border);
  background: var(--zm-surface);
  color: inherit;
  padding: 10px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font: inherit;
  transition: all 0.16s ease;
}
.zm-hex-card:hover, .zm-hex-card.zm-selected {
  border-color: var(--zm-gold-bright);
  box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--zm-gold-bright) 34%, transparent);
}

/* Ziwei 4x4 Traditional Grid (inside theme-adaptive canvas) */
.zm-ziwei-scroll {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  padding-bottom: 2px;
}
.zm-ziwei-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(82px, 1fr));
  grid-template-rows: repeat(4, minmax(64px, auto));
  gap: 5px;
  min-width: 348px;
  min-height: 100%;
  position: relative;
}
.zm-zw-cell {
  width: 100%;
  border-radius: 9px;
  border: 1px solid var(--zm-glass-border);
  background: var(--zm-glass);
  color: var(--zm-text);
  padding: 5px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
  text-align: left;
  font: inherit;
}
.zm-zw-cell:hover { border-color: var(--zm-purple); }
.zm-zw-cell.zm-zw-self {
  border-color: var(--zm-gold-bright);
  background: color-mix(in srgb, var(--zm-gold-bright) 16%, var(--zm-glass));
}
.zm-zw-cell.zm-zw-trine {
  border-color: var(--zm-purple);
  background: color-mix(in srgb, var(--zm-purple) 12%, var(--zm-glass));
}
.zm-zw-cell.zm-zw-opposite {
  border-color: var(--zm-gold-bright);
  border-style: dashed;
}
.zm-zw-cell.zm-zw-yearly {
  box-shadow: inset 0 0 0 1.5px #38bdf8;
}
.zm-zw-center {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
  border-radius: 12px;
  border: 1px solid var(--zm-stage-border);
  background: var(--zm-glass);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  overflow: hidden;
}
.zm-zw-center-scrim {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  padding: 6px 9px;
  border-radius: 9px;
  background: var(--zm-glass);
  border: 1px solid var(--zm-glass-border);
  backdrop-filter: blur(6px);
}

.zm-two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 175px), 1fr));
  gap: 8px;
}

.zm-person-form {
  min-width: 0;
  padding: 8px;
  border-radius: 9px;
  border: 1px solid var(--zm-border);
}

@container (min-width: 720px) {
  .zm-wide-split {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 12px;
    align-items: start;
  }
}

@container (max-width: 440px) {
  .zm-wuxing-grid { grid-template-columns: 1fr; }
  .zm-hex-stage { grid-template-columns: 1fr; }
}

/* Inline Chat Tool & Command Cards */
.zm-chat-card {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, #c9973b 36%, var(--dsw-alias-border-l2));
  background:
    radial-gradient(circle at 96% 8%, rgba(201, 151, 59, 0.11), transparent 48%),
    var(--dsw-alias-card-fill);
  padding: 10px 12px;
  margin: 4px 0;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  animation: zm-fade-up 0.2s ease-out;
}
.zm-chat-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.zm-chat-mini-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.zm-toast {
  position: sticky;
  bottom: 0;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  background: var(--zm-surface-soft);
  border: 1px solid var(--zm-border-strong);
  color: var(--zm-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  z-index: 5;
}

.zm-toast-close {
  min-width: 24px;
  min-height: 24px;
  padding: 2px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
}

.zm-muted { color: var(--zm-text-muted); font-size: 11px; }
.zm-reading-list {
  display: grid;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.zm-bazi-analysis {
  border-top: 1px solid var(--zm-border);
  padding-top: 10px;
}
.zm-compare-table {
  width: 100%;
  max-width: 540px;
  table-layout: fixed;
  border-collapse: collapse;
  position: relative;
  z-index: 2;
  font-size: 12px;
}
.zm-compare-table caption {
  padding: 0 8px 8px;
  text-align: left;
  font-weight: 600;
}
.zm-compare-table th, .zm-compare-table td {
  padding: 5px 8px;
  text-align: left;
  overflow-wrap: anywhere;
}
.zm-compare-table th:first-child { width: 46px; }
.zm-compare-table tbody tr { border-top: 1px solid var(--zm-border); }
.zm-compare-table .zm-bar-track { margin-top: 3px; }
.zm-sep { height: 1px; background: var(--zm-border); margin: 6px 0; }
`;

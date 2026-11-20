const ZHIMING_CSS = `
/* =========================================================================
   ZhiMing Dual-Theme Cohesive Design System
   - Light Mode (data-zm-theme="light"): Imperial Xuan-Paper & Bronze Gold
   - Dark Mode  (data-zm-theme="dark") : Obsidian Starfield & Celestial Gold
   ========================================================================= */

.zm-root, .zm-dock-wrap, .zm-chat-card {
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
  .zm-dock-wrap, .zm-chat-card {
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

html[data-theme="dark"] .zm-dock-wrap,
html[data-theme="dark"] .zm-chat-card,
.dark .zm-dock-wrap,
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
  .zm-spin-slow, .zm-spin-rev, .zm-pulse-glow, .zm-animate, .zm-chat-card, .zm-dash-flow, .zm-twinkle, .zm-aura {
    animation: none !important;
    transition: none !important;
  }
}

.zm-spin-slow { animation: zm-spin-slow 46s linear infinite; transform-box: fill-box; transform-origin: center; }
.zm-spin-rev { animation: zm-spin-rev 62s linear infinite; transform-box: fill-box; transform-origin: center; }
.zm-pulse-glow { animation: zm-pulse-glow 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.zm-dash-flow { animation: zm-dash-flow 1.8s linear infinite; }
.zm-twinkle { animation: zm-twinkle 3.4s ease-in-out infinite; }
.zm-aura { animation: zm-aura-breathe 3.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

/* Root Layout */
.zm-root {
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
.zm-dock-main:focus-visible,
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
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.zm-brand-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
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

.zm-hero-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
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
  padding: 2px 8px;
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

.zm-nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
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
  padding: 12px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.zm-animate { animation: zm-fade-up 0.24s ease-out; }

/* =========================================================================
   Monumental Pure-Visual Showcase Canvas (Cohesive in BOTH Light & Dark!)
   ========================================================================= */
.zm-canvas {
  position: relative;
  border-radius: 16px;
  padding: 12px;
  background: var(--zm-stage-bg);
  border: 1px solid var(--zm-stage-border);
  box-shadow: var(--zm-stage-shadow);
  color: var(--zm-text);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
  position: relative;
  z-index: 3;
}

.zm-canvas-artwork {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.zm-stage-tabs {
  display: inline-flex;
  gap: 3px;
  padding: 2.5px;
  border-radius: 999px;
  background: var(--zm-glass);
  border: 1px solid var(--zm-glass-border);
  backdrop-filter: blur(8px);
}
.zm-stage-tab {
  padding: 3px 9px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  position: relative;
  z-index: 3;
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
  padding: 6px 11px;
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
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 7px;
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
  padding: 9px 13px;
  font-size: 12px;
  font-weight: 700;
  color: var(--zm-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.zm-details > summary::-webkit-details-marker { display: none; }
.zm-details[open] > summary {
  border-bottom: 1px solid var(--zm-border);
}
.zm-details-body {
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Forms */
.zm-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}
.zm-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.zm-field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--zm-text-muted);
}
.zm-input, .zm-select {
  width: 100%;
  padding: 6px 8px;
  border-radius: 7px;
  border: 1px solid var(--zm-border-strong);
  background: var(--zm-bg);
  color: var(--zm-text);
  font-size: 12px;
  outline: none;
}
.zm-input:focus, .zm-select:focus {
  border-color: var(--zm-gold-bright);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--zm-gold-bright) 22%, transparent);
}
.zm-lunar-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr auto;
  gap: 6px;
  align-items: end;
  grid-column: 1 / -1;
}
.zm-check-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--zm-text-sub);
  padding-bottom: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.zm-form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
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
  padding: 2px 0;
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
  min-width: 62px;
  padding: 6px 8px;
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}
.zm-qimen-cell {
  width: 100%;
  border-radius: 11px;
  border: 1px solid var(--zm-glass-border);
  background: var(--zm-glass);
  color: var(--zm-text);
  padding: 8px 7px;
  min-height: 98px;
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
  border-color: var(--zm-green);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--zm-green) 45%, transparent);
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
  padding: 9px 6px;
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
  overflow-x: auto;
  padding-bottom: 2px;
}
.zm-ziwei-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(82px, 1fr));
  grid-template-rows: repeat(4, minmax(92px, auto));
  gap: 5px;
  min-width: 348px;
  position: relative;
}
.zm-zw-cell {
  width: 100%;
  border-radius: 9px;
  border: 1px solid var(--zm-glass-border);
  background: var(--zm-glass);
  color: var(--zm-text);
  padding: 6px 5px;
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
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  gap: 8px;
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

/* Composer Dock Pill */
.zm-dock-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, #c9973b 38%, var(--dsw-alias-border-l2));
  background: color-mix(in srgb, #c9973b 7%, var(--dsw-alias-card-fill));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  max-width: 100%;
  transition: all 0.16s ease;
}
.zm-dock-wrap:hover {
  border-color: color-mix(in srgb, #c9973b 65%, var(--dsw-alias-border-l3));
  background: color-mix(in srgb, #c9973b 12%, var(--dsw-alias-card-fill));
}
.zm-dock-main {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  min-width: 0;
}
.zm-dock-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
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

.zm-muted { color: var(--zm-text-muted); font-size: 11px; }
.zm-sep { height: 1px; background: var(--zm-border); margin: 6px 0; }
`;

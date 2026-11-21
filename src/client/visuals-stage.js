function createStageVisuals(React) {
  const h = React.createElement;

  function getPalette(isDark) {
    if (isDark) {
      return {
        key: 'd',
        gold: '#f0c975',
        goldBright: '#fae2a0',
        goldSoft: 'rgba(240,201,117,0.22)',
        goldLine: 'rgba(240,201,117,0.34)',
        goldFaint: 'rgba(240,201,117,0.14)',
        ink: '#f8fafc',
        inkSub: '#cbd5e1',
        inkMuted: 'rgba(203,213,225,0.68)',
        surface: '#0b1022',
        surfaceMid: '#121a33',
        wedgeIdle: 'rgba(15,23,42,0.70)',
        wedgeBorder: 'rgba(148,163,184,0.28)',
        goodFill: 'rgba(16,185,129,0.20)',
        goodFillSel: 'rgba(16,185,129,0.36)',
        goodStroke: '#34d399',
        badFill: 'rgba(244,63,94,0.14)',
        badFillSel: 'rgba(244,63,94,0.30)',
        badStroke: '#fb7185',
        selFill: 'rgba(240,201,117,0.24)',
        selStroke: '#fae2a0',
        trineFill: 'rgba(168,85,247,0.18)',
        trineStroke: '#c084fc',
        cyan: '#38bdf8',
        indigo: '#818cf8',
        purple: '#c084fc',
        pink: '#f472b6',
        blue: '#60a5fa',
        amber: '#fbbf24',
        taijiLight: '#f6df9e',
        taijiDark: '#0f162b',
        el: {
          木: { fg: '#34d399', fill: 'rgba(16,185,129,0.24)', ring: '#34d399' },
          火: { fg: '#fb7185', fill: 'rgba(244,63,94,0.24)', ring: '#fb7185' },
          土: { fg: '#fbbf24', fill: 'rgba(245,158,11,0.24)', ring: '#fbbf24' },
          金: { fg: '#fde047', fill: 'rgba(234,179,8,0.24)', ring: '#fde047' },
          水: { fg: '#60a5fa', fill: 'rgba(59,130,246,0.24)', ring: '#60a5fa' },
        },
      };
    }
    // Imperial Xuan-Paper & Mineral-Ink Bronze-Gold Light Theme
    return {
      key: 'l',
      gold: '#9a6700',
      goldBright: '#b88018',
      goldSoft: 'rgba(184,128,24,0.14)',
      goldLine: 'rgba(154,103,0,0.32)',
      goldFaint: 'rgba(154,103,0,0.13)',
      ink: '#1c2230',
      inkSub: '#475066',
      inkMuted: '#757e92',
      surface: '#fffdf8',
      surfaceMid: '#f6efe2',
      wedgeIdle: 'rgba(255,252,245,0.78)',
      wedgeBorder: 'rgba(168,124,48,0.28)',
      goodFill: 'rgba(5,150,105,0.13)',
      goodFillSel: 'rgba(5,150,105,0.24)',
      goodStroke: '#059669',
      badFill: 'rgba(200,30,58,0.08)',
      badFillSel: 'rgba(200,30,58,0.18)',
      badStroke: '#c81e3a',
      selFill: 'rgba(184,128,24,0.18)',
      selStroke: '#9a6700',
      trineFill: 'rgba(124,58,237,0.11)',
      trineStroke: '#7c3aed',
      cyan: '#0284c7',
      indigo: '#4338ca',
      purple: '#7c3aed',
      pink: '#be185d',
      blue: '#1d4ed8',
      amber: '#b45309',
      taijiLight: '#fffaf0',
      taijiDark: '#262d40',
      el: {
        木: { fg: '#047857', fill: 'rgba(5,150,105,0.15)', ring: '#059669' },
        火: { fg: '#c81e3a', fill: 'rgba(200,30,58,0.14)', ring: '#dc2626' },
        土: { fg: '#b45309', fill: 'rgba(217,119,6,0.15)', ring: '#d97706' },
        金: { fg: '#9a6700', fill: 'rgba(184,128,24,0.16)', ring: '#b88018' },
        水: { fg: '#1d4ed8', fill: 'rgba(29,78,216,0.14)', ring: '#2563eb' },
      },
    };
  }

  // Exact Bagua 3-line binary bars (top -> middle -> bottom; 1 = solid Yang, 0 = broken Yin)
  const TRIGRAM_BITS = {
    乾: [1, 1, 1], 兑: [0, 1, 1], 离: [1, 0, 1], 震: [0, 0, 1],
    巽: [1, 1, 0], 坎: [0, 1, 0], 艮: [1, 0, 0], 坤: [0, 0, 0],
  };

  // Renders crisp vector Bagua bars tangentially rotated at (x, y)
  function VectorTrigram({ name, x, y, width = 18, thickness = 2.4, gap = 2.4, angleDeg = 0, color }) {
    const bits = TRIGRAM_BITS[name] || [1, 1, 1];
    const totalH = thickness * 3 + gap * 2;
    const startY = -totalH / 2;
    const halfW = width / 2;
    const splitGap = width * 0.20;
    const segW = (width - splitGap) / 2;

    return h('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angleDeg.toFixed(1)})` },
      ...bits.flatMap((bit, i) => {
        const yy = startY + i * (thickness + gap);
        if (bit === 1) {
          return [h('rect', { key: i, x: -halfW, y: yy, width, height: thickness, rx: thickness / 2, fill: color })];
        }
        return [
          h('rect', { key: `${i}l`, x: -halfW, y: yy, width: segW, height: thickness, rx: thickness / 2, fill: color }),
          h('rect', { key: `${i}r`, x: splitGap / 2, y: yy, width: segW, height: thickness, rx: thickness / 2, fill: color }),
        ];
      }),
    );
  }

  // Sculpted Vector Yin-Yang Taiji Core
  function TaijiCore({ cx, cy, r, pal, spin = false }) {
    const r2 = r / 2;
    const dotR = Math.max(2, r * 0.145);
    return h('g', { className: spin ? 'zm-spin-slow' : '' },
      h('circle', { cx, cy, r, fill: pal.taijiDark, stroke: pal.gold, strokeWidth: 1.5 }),
      h('path', {
        d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r2} ${r2} 0 0 1 ${cx} ${cy} A ${r2} ${r2} 0 0 0 ${cx} ${cy - r} Z`,
        fill: pal.taijiLight,
      }),
      h('circle', { cx, cy: cy - r2, r: dotR, fill: pal.taijiDark }),
      h('circle', { cx, cy: cy + r2, r: dotR, fill: pal.taijiLight }),
    );
  }

  // =========================================================================
  // 0. Aspect-Preserved Celestial Backdrop (NEVER stretches circles!)
  // Uses preserveAspectRatio="xMidYMid slice" on a 600x600 square viewBox.
  // =========================================================================
  const STAR_SEEDS = [
    [42, 48, 1.3, '0s'], [96, 84, 0.9, '0.6s'], [158, 36, 1.6, '1.2s'], [224, 68, 1.0, '1.8s'],
    [298, 28, 1.2, '0.4s'], [372, 56, 1.5, '1.5s'], [446, 40, 0.9, '2.1s'], [528, 72, 1.4, '0.9s'],
    [562, 134, 1.1, '1.7s'], [74, 152, 1.2, '2.3s'], [142, 188, 0.8, '0.3s'], [488, 168, 1.3, '1.1s'],
    [36, 256, 1.0, '1.9s'], [554, 248, 1.5, '0.5s'], [62, 344, 1.4, '1.4s'], [526, 336, 1.0, '2.2s'],
    [48, 442, 1.1, '0.7s'], [114, 496, 1.5, '1.6s'], [192, 548, 0.9, '2.5s'], [284, 564, 1.3, '0.8s'],
    [396, 546, 1.6, '1.3s'], [478, 502, 1.0, '2.0s'], [546, 448, 1.3, '0.2s'], [566, 542, 1.1, '1.0s'],
    [82, 558, 1.2, '1.8s'], [188, 118, 0.9, '0.9s'], [422, 112, 1.1, '2.4s'], [104, 412, 0.9, '1.2s'],
    [492, 416, 1.2, '0.6s'], [246, 514, 0.8, '1.5s'], [352, 508, 1.0, '2.1s'], [316, 88, 1.1, '0.4s'],
  ];

  function CelestialBackdropSvg({ isDark = true }) {
    const pal = getPalette(isDark);
    return h('svg', {
      viewBox: '0 0 600 600',
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': true,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 },
    },
      h('circle', {
        cx: 300, cy: 300, r: 274, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.9, strokeDasharray: '4 8',
        className: 'zm-decorative-orbit', style: { '--zm-orbit-duration': '104s' },
      }),
      h('circle', {
        cx: 300, cy: 300, r: 232, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.7, strokeDasharray: '18 6 3 7',
        className: 'zm-decorative-orbit', style: { '--zm-orbit-duration': '150s', '--zm-orbit-direction': 'reverse' },
      }),
      // The constellation lines orbit with the stars at their endpoints.
      h('g', { className: 'zm-decorative-orbit', style: { '--zm-orbit-duration': '196s' } },
        h('path', {
          d: 'M 42 48 L 96 84 L 158 36 M 446 40 L 528 72 L 562 134 M 48 442 L 114 496 L 192 548 M 478 502 L 546 448',
          fill: 'none',
          stroke: isDark ? 'rgba(199,210,254,0.14)' : 'rgba(154,103,0,0.12)',
          strokeWidth: 0.8,
        }),
        ...STAR_SEEDS.map(([cx, cy, r, delay], i) => h('circle', {
          key: i,
          cx, cy, r,
          fill: isDark ? (i % 3 === 0 ? '#fae2a0' : '#c7d2fe') : (i % 2 === 0 ? '#b88018' : '#059669'),
          opacity: isDark ? 0.85 : 0.34,
          className: 'zm-twinkle',
          style: { animationDelay: delay },
        })),
      ),
    );
  }

  function ChartCanvas({ isDark, tabs, actions, controls, readout, children }) {
    return h('div', { className: 'zm-canvas' },
      h(CelestialBackdropSvg, { isDark }),
      h('div', { className: 'zm-canvas-bar' },
        h('div', { className: 'zm-canvas-row' }, tabs),
        h('div', { className: 'zm-canvas-row' }, actions),
      ),
      h('div', { className: 'zm-canvas-artwork' },
        h('div', { className: 'zm-canvas-content' }, children),
      ),
      h('div', { className: 'zm-canvas-footer' },
        h('div', { className: 'zm-canvas-row' }, controls || readout),
        h('div', { className: 'zm-canvas-row' }, controls ? readout : null),
      ),
    );
  }

  // Traditional Chinese compass orientation: South Top (-90°), West Right (0°), North Bottom (90°), East Left (180°)
  const COMPASS_ANGLES = {
    正南: -90, 西南: -45, 正西: 0, 西北: 45,
    正北: 90, 东北: 135, 正东: 180, 东南: -135,
  };

  function CompassOrbit({ color }) {
    return h('g', { className: 'zm-decorative-orbit', 'aria-hidden': true, pointerEvents: 'none' },
      h('circle', {
        cx: 210, cy: 210, r: 207,
        fill: 'none', stroke: color, strokeOpacity: 0.43, strokeWidth: 1.6,
        pathLength: 360, strokeDasharray: '48 112 26 82 11 81', strokeLinecap: 'round',
      }),
      h('circle', { cx: 210, cy: 3, r: 2, fill: color, opacity: 0.7 }),
      h('circle', { cx: 3, cy: 210, r: 1.45, fill: color, opacity: 0.55 }),
    );
  }

  function makeSectorPath(cx, cy, degCenter, halfSpread, r1, r2) {
    const a1 = ((degCenter - halfSpread) * Math.PI) / 180;
    const a2 = ((degCenter + halfSpread) * Math.PI) / 180;
    const x1o = cx + Math.cos(a1) * r2;
    const y1o = cy + Math.sin(a1) * r2;
    const x2o = cx + Math.cos(a2) * r2;
    const y2o = cy + Math.sin(a2) * r2;
    const x2i = cx + Math.cos(a2) * r1;
    const y2i = cy + Math.sin(a2) * r1;
    const x1i = cx + Math.cos(a1) * r1;
    const y1i = cy + Math.sin(a1) * r1;
    return `M ${x1o.toFixed(1)} ${y1o.toFixed(1)} A ${r2} ${r2} 0 0 1 ${x2o.toFixed(1)} ${y2o.toFixed(1)} L ${x2i.toFixed(1)} ${y2i.toFixed(1)} A ${r1} ${r1} 0 0 0 ${x1i.toFixed(1)} ${y1i.toFixed(1)} Z`;
  }

  // =========================================================================
  // 1. BAZI CELESTIAL ELEMENTAL ORRERY (420x420) — Works Idle + Active!
  // =========================================================================
  const PILLAR_ORBITS = [
    { idx: 0, tag: '年', deg: -135 },
    { idx: 1, tag: '月', deg: -45 },
    { idx: 2, tag: '日', deg: 45 },
    { idx: 3, tag: '时', deg: 135 },
  ];

  function BaziOrrerySvg({ chart, isDark = true, selectedPillarIdx = 2, selectedWuXing = null, onSelectPillar, onSelectWuXing }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const elements = ['木', '火', '土', '金', '水'];
    const pentR = 155;
    const pillarR = 96;

    const elNodes = elements.map((el, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return {
        el,
        x: cx + Math.cos(a) * pentR,
        y: cy + Math.sin(a) * pentR,
        pct: (chart?.wuxing?.counts?.[el] ?? 0) * 12.5,
      };
    });

    const pillarPos = PILLAR_ORBITS.map(o => {
      const rad = (o.deg * Math.PI) / 180;
      return { ...o, x: cx + Math.cos(rad) * pillarR, y: cy + Math.sin(rad) * pillarR };
    });

    const dmEl = chart?.dayMaster?.element || '金';
    const dmStyle = pal.el[dmEl] || pal.el['金'];
    const coreGrad = `zm-bz-core-${pal.key}`;
    const pillarLinks = selectedWuXing ? [] : (chart?.interactions || []).filter(
      link => link.from === selectedPillarIdx || link.to === selectedPillarIdx,
    );

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: onSelectWuXing || (chart && onSelectPillar) ? 'group' : 'img',
      'aria-label': chart ? `四柱五行天象仪 ${chart.title}` : '四柱五行天象仪待机图腾',
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h('defs', null,
        h('radialGradient', { id: coreGrad, cx: '50%', cy: '45%', r: '55%' },
          h('stop', { offset: '0%', stopColor: isDark ? '#2b2447' : '#fffdf5' }),
          h('stop', { offset: '68%', stopColor: pal.surfaceMid }),
          h('stop', { offset: '100%', stopColor: pal.surface }),
        ),
      ),

      h('g', { 'aria-hidden': true },
        h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.3 }),
        h('circle', { cx, cy, r: 176, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
        ...Array.from({ length: 60 }, (_, i) => {
          const rad = (i * 6 * Math.PI) / 180;
          const major = i % 5 === 0;
          return h('line', {
            key: `t-${i}`,
            x1: (cx + Math.cos(rad) * (major ? 192 : 196)).toFixed(1),
            y1: (cy + Math.sin(rad) * (major ? 192 : 196)).toFixed(1),
            x2: (cx + Math.cos(rad) * 202).toFixed(1),
            y2: (cy + Math.sin(rad) * 202).toFixed(1),
            stroke: major ? pal.gold : pal.goldLine,
            strokeWidth: major ? 1.6 : 0.85,
          });
        }),
      ),

      // Five-element generating and controlling cycles.
      h('polygon', {
        points: elNodes.map(n => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' '),
        fill: 'none',
        stroke: pal.goldLine,
        strokeWidth: 1,
        strokeDasharray: '3 4',
      }),
      // Internal Sheng/Ke star lines
      h('polygon', {
        points: [0, 2, 4, 1, 3].map(i => `${elNodes[i].x.toFixed(1)},${elNodes[i].y.toFixed(1)}`).join(' '),
        fill: 'none',
        stroke: pal.goldFaint,
        strokeWidth: 0.9,
      }),
      h('circle', {
        cx, cy, r: pillarR, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1.1, strokeDasharray: '2 5',
        className: 'zm-decorative-orbit', 'aria-hidden': true, pointerEvents: 'none',
      }),
      ...pillarLinks.map((it, idx) => {
        const p1 = pillarPos[it.from];
        const p2 = pillarPos[it.to];
        if (!p1 || !p2) return null;
        const curvePull = idx % 2 === 0 ? 0.56 : 0.34;
        const qx = cx + ((p1.x + p2.x) / 2 - cx) * curvePull;
        const qy = cy + ((p1.y + p2.y) / 2 - cy) * curvePull;
        const isStem = it.layer === 'gan' || it.type.startsWith('天干');
        return h('path', {
          key: `arc-${idx}`,
          d: `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
          fill: 'none',
          stroke: isStem ? pal.blue : pal.purple,
          strokeWidth: 2,
          strokeDasharray: isStem ? undefined : '4 3',
          pointerEvents: 'none',
          opacity: 0.88,
        });
      }),

      // Layer 4: 5 Clickable Elemental Crystal Nodes
      ...elNodes.map(n => {
        const st = pal.el[n.el];
        const isSel = selectedWuXing === n.el;
        return h('g', {
          key: `el-${n.el}`,
          className: onSelectWuXing ? 'zm-chart-control' : undefined,
          role: onSelectWuXing ? 'button' : undefined,
          tabIndex: onSelectWuXing ? 0 : undefined,
          'aria-label': chart ? `${n.el} · 明干支占比 ${n.pct}%` : n.el,
          'aria-pressed': onSelectWuXing ? isSel : undefined,
          style: { cursor: onSelectWuXing ? 'pointer' : 'default' },
          onClick: onSelectWuXing ? () => onSelectWuXing(n.el) : undefined,
          onKeyDown: onSelectWuXing ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectWuXing(n.el); } } : undefined,
        },
          h('circle', {
            cx: n.x, cy: n.y, r: 19,
            fill: pal.surface,
            stroke: st.ring,
            strokeWidth: isSel ? 2.4 : 1.6,
          }),
          h('circle', { cx: n.x, cy: n.y, r: 16, fill: st.fill }),
          h('text', { x: n.x, y: n.y + (chart ? 0 : 4), textAnchor: 'middle', fill: st.fg, fontSize: 12.5, fontWeight: 800 }, n.el),
          chart ? h('text', { x: n.x, y: n.y + 11, textAnchor: 'middle', fill: pal.inkSub, fontSize: 8.5, fontWeight: 700 }, `${n.pct}%`) : null,
          onSelectWuXing ? h('circle', { className: 'zm-chart-focus-ring', cx: n.x, cy: n.y, r: 23, 'aria-hidden': true }) : null,
        );
      }),

      // Layer 5: 4 Sculpted Celestial Pillar Medallions (Active) OR 4 Sacred Glyph Orbs (Idle)
      ...pillarPos.map(pos => {
        const p = chart?.pillars?.[pos.idx];
        const isSel = !selectedWuXing && selectedPillarIdx === pos.idx && Boolean(p);
        const interactive = p && onSelectPillar;
        const gc = p ? (pal.el[p.ganElement] || pal.el['金']) : pal.el['金'];
        const zc = p ? (pal.el[p.zhiElement] || pal.el['水']) : pal.el['水'];
        return h('g', {
          key: `pil-${pos.idx}`,
          className: interactive ? 'zm-chart-control' : undefined,
          role: interactive ? 'button' : undefined,
          tabIndex: interactive ? 0 : undefined,
          'aria-label': p ? `${p.label} ${p.ganZhi}` : `${pos.tag}柱`,
          'aria-pressed': interactive ? isSel : undefined,
          style: { cursor: interactive ? 'pointer' : 'default' },
          onClick: interactive ? () => onSelectPillar(pos.idx) : undefined,
          onKeyDown: interactive ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPillar(pos.idx); } } : undefined,
        },
          isSel ? h('circle', {
            cx: pos.x, cy: pos.y, r: 30.5,
            fill: 'none', stroke: pal.goldBright, strokeWidth: 1.2, pointerEvents: 'none',
          }) : null,
          h('circle', {
            cx: pos.x, cy: pos.y, r: 26,
            fill: pal.surface,
            stroke: isSel ? pal.goldBright : (pos.idx === 2 ? pal.gold : gc.ring),
            strokeWidth: isSel ? 2.4 : (pos.idx === 2 ? 2 : 1.4),
          }),
          h('circle', { cx: pos.x, cy: pos.y, r: 22, fill: gc.fill }),
          p ? h(React.Fragment, null,
            h('text', { x: pos.x, y: pos.y - 2.5, textAnchor: 'middle', fill: gc.fg, fontSize: 15, fontWeight: 800 }, p.gan),
            h('text', { x: pos.x, y: pos.y + 13.5, textAnchor: 'middle', fill: zc.fg, fontSize: 14, fontWeight: 800 }, p.zhi),
            h('circle', { cx: pos.x + 19, cy: pos.y - 18, r: 8, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.1 }),
            h('text', { x: pos.x + 19, y: pos.y - 15.2, textAnchor: 'middle', fill: pal.gold, fontSize: 8.5, fontWeight: 800 }, pos.tag),
          ) : h(React.Fragment, null,
            h('text', { x: pos.x, y: pos.y + 5, textAnchor: 'middle', fill: pal.gold, fontSize: 15, fontWeight: 800, opacity: 0.72 }, pos.tag),
          ),
          interactive ? h('circle', { className: 'zm-chart-focus-ring', cx: pos.x, cy: pos.y, r: 36.5, 'aria-hidden': true }) : null,
        );
      }),

      // Layer 6: Central Radiant Day Master Solar Core (or Sculpted Taiji in Idle)
      h('circle', { cx, cy, r: 54, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2, className: 'zm-aura' }),
      h('circle', { cx, cy, r: 46, fill: `url(#${coreGrad})`, stroke: chart ? dmStyle.ring : pal.gold, strokeWidth: 2.2 }),
      chart ? h(React.Fragment, null,
        h('circle', {
          cx, cy, r: 39, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '2 2',
          className: 'zm-decorative-orbit', style: { '--zm-orbit-direction': 'reverse' }, 'aria-hidden': true, pointerEvents: 'none',
        }),
        h('text', { x: cx, y: cy - 4, textAnchor: 'middle', fill: dmStyle.fg, fontSize: 24, fontWeight: 800 }, chart.dayMaster.gan),
        h('text', { x: cx, y: cy + 16, textAnchor: 'middle', fill: pal.gold, fontSize: 11, fontWeight: 700 }, `${chart.dayMaster.element} · 日主`),
      ) : h(TaijiCore, { cx, cy, r: 34, pal, spin: true }),
    );
  }

  // =========================================================================
  // 2. IMPERIAL BAZHAI 360° CARVED LUOPAN (420x420)
  // =========================================================================
  const DIR_TRIGRAM = {
    正南: '离', 西南: '坤', 正西: '兑', 西北: '乾',
    正北: '坎', 东北: '艮', 正东: '震', 东南: '巽',
  };

  function BaZhaiCompassSvg({ mingGua, isDark = true, selectedDir, onSelectDir }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const dirs = mingGua?.directions || Object.entries(DIR_TRIGRAM).map(([direction, star]) => ({ direction, star }));
    const lifeDeg = COMPASS_ANGLES[mingGua?.bestWealthDir];

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: onSelectDir ? 'group' : 'img',
      'aria-label': mingGua ? `八宅命卦风水罗盘 ${mingGua.name}` : '八宅风水罗盘',
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h(CompassOrbit, { color: pal.goldBright }),
      // Fixed tick marks follow the compass headings.
      h('g', { 'aria-hidden': true },
        h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.4 }),
        h('circle', { cx, cy, r: 190, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
        ...Array.from({ length: 72 }, (_, i) => {
          const rad = (i * 5 * Math.PI) / 180;
          const major = i % 9 === 0;
          const mid = i % 3 === 0;
          return h('line', {
            key: `bz-${i}`,
            x1: (cx + Math.cos(rad) * (major ? 190 : mid ? 194 : 197)).toFixed(1),
            y1: (cy + Math.sin(rad) * (major ? 190 : mid ? 194 : 197)).toFixed(1),
            x2: (cx + Math.cos(rad) * 202).toFixed(1),
            y2: (cy + Math.sin(rad) * 202).toFixed(1),
            stroke: major ? pal.goldBright : pal.goldLine,
            strokeWidth: major ? 1.8 : 0.9,
          });
        }),
      ),

      // Ring 2: Engraved Vector Trigrams Halo
      h('circle', { cx, cy, r: 162, fill: 'none', stroke: pal.goldLine, strokeWidth: 1 }),
      ...Object.entries(DIR_TRIGRAM).map(([dir, tri]) => {
        const deg = COMPASS_ANGLES[dir] ?? 0;
        const rad = (deg * Math.PI) / 180;
        return h(VectorTrigram, {
          key: `tri-${dir}`,
          name: tri,
          x: cx + Math.cos(rad) * 175,
          y: cy + Math.sin(rad) * 175,
          width: 20,
          thickness: 2.5,
          gap: 2.5,
          angleDeg: deg + 90,
          color: pal.gold,
        });
      }),

      // Ring 3: 8 Interactive Radial Sectors
      ...dirs.map(d => {
        const deg = COMPASS_ANGLES[d.direction] ?? 0;
        const rad = (deg * Math.PI) / 180;
        const isGood = d.luck === '吉';
        const isSel = selectedDir === d.direction;
        const isBest = mingGua?.bestWealthDir === d.direction;
        return h('g', {
          key: d.direction,
          className: onSelectDir ? 'zm-chart-control' : undefined,
          role: onSelectDir ? 'button' : undefined,
          tabIndex: onSelectDir ? 0 : undefined,
          'aria-label': `${d.direction} ${d.star} ${d.luck}`,
          'aria-pressed': onSelectDir ? isSel : undefined,
          style: { cursor: onSelectDir ? 'pointer' : 'default' },
          onClick: onSelectDir ? () => onSelectDir(d.direction) : undefined,
          onKeyDown: onSelectDir ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectDir(d.direction); } } : undefined,
        },
          h('path', {
            d: makeSectorPath(cx, cy, deg, 21.4, 72, 158),
            fill: isSel
              ? (isGood ? pal.goodFillSel : pal.badFillSel)
              : (isGood ? pal.goodFill : pal.wedgeIdle),
            stroke: isSel ? pal.selStroke : (isBest ? pal.goldBright : (isGood ? pal.goodStroke : pal.wedgeBorder)),
            strokeWidth: isSel ? 2.4 : (isBest ? 1.8 : 1.1),
          }),
          h('text', {
            x: cx + Math.cos(rad) * 124,
            y: cy + Math.sin(rad) * 124 + 4,
            textAnchor: 'middle',
            fill: isGood ? pal.goodStroke : pal.inkSub,
            fontSize: 13.5,
            fontWeight: 800,
          }, d.star),
          h('text', {
            x: cx + Math.cos(rad) * 92,
            y: cy + Math.sin(rad) * 92 + 3.5,
            textAnchor: 'middle',
            fill: isSel ? pal.gold : pal.inkMuted,
            fontSize: 10.5,
            fontWeight: 700,
          }, d.direction),
          onSelectDir ? h('path', {
            className: 'zm-chart-focus-ring',
            d: makeSectorPath(cx, cy, deg, 19.5, 76, 154),
            'aria-hidden': true,
          }) : null,
        );
      }),

      // Heaven Pool Center + Gleaming Magnetic Compass Needle pointing to 生气大财位
      h('circle', { cx, cy, r: 66, fill: pal.surface, stroke: pal.gold, strokeWidth: 2 }),
      h('circle', {
        cx, cy, r: 58, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '2 3',
        className: 'zm-decorative-orbit', style: { '--zm-orbit-direction': 'reverse' }, 'aria-hidden': true, pointerEvents: 'none',
      }),
      lifeDeg != null ? h('g', { transform: `rotate(${lifeDeg + 90} ${cx} ${cy})` },
        h('polygon', { points: `${cx},${cy - 54} ${cx - 5.5},${cy} ${cx + 5.5},${cy}`, fill: pal.goodStroke, opacity: 0.92 }),
        h('polygon', { points: `${cx},${cy + 46} ${cx - 4.5},${cy} ${cx + 4.5},${cy}`, fill: pal.goldLine, opacity: 0.65 }),
      ) : null,
      h('circle', { cx, cy, r: 28, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.5 }),
      h('text', { x: cx, y: cy - 1, textAnchor: 'middle', fill: pal.gold, fontSize: 14, fontWeight: 800 }, mingGua ? mingGua.name : '八宅'),
      h('text', { x: cx, y: cy + 15, textAnchor: 'middle', fill: pal.goodStroke, fontSize: 9.5, fontWeight: 700 }, mingGua ? mingGua.group : '罗盘'),
    );
  }

  // =========================================================================
  // 3. QIMEN 360° IMPERIAL ARMILLARY SPHERE (420x420) — Idle + Active!
  // =========================================================================
  const IDLE_QIMEN_SECTORS = [
    { num: 9, direction: '正南', trigram: '离', gate: '景门', star: '天英', deity: '值符', heavenStem: '丙', earthStem: '丙' },
    { num: 2, direction: '西南', trigram: '坤', gate: '死门', star: '天芮', deity: '腾蛇', heavenStem: '丁', earthStem: '丁' },
    { num: 7, direction: '正西', trigram: '兑', gate: '惊门', star: '天柱', deity: '太阴', heavenStem: '庚', earthStem: '庚' },
    { num: 6, direction: '西北', trigram: '乾', gate: '开门', star: '天心', deity: '六合', heavenStem: '辛', earthStem: '辛' },
    { num: 1, direction: '正北', trigram: '坎', gate: '休门', star: '天蓬', deity: '白虎', heavenStem: '壬', earthStem: '壬' },
    { num: 8, direction: '东北', trigram: '艮', gate: '生门', star: '天任', deity: '玄武', heavenStem: '戊', earthStem: '戊' },
    { num: 3, direction: '正东', trigram: '震', gate: '伤门', star: '天冲', deity: '九地', heavenStem: '乙', earthStem: '乙' },
    { num: 4, direction: '东南', trigram: '巽', gate: '杜门', star: '天辅', deity: '九天', heavenStem: '己', earthStem: '己' },
  ];

  function QimenArmillarySvg({ chart, isDark = true, selectedPalaceNum, radarHits = [], onSelectPalace }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const hitSet = new Set(radarHits);
    const outerPalaces = chart ? chart.palaces.filter(p => !p.isCenter) : IDLE_QIMEN_SECTORS;
    const centerPalace = chart?.palaces?.find(p => p.isCenter);
    const interactive = chart && onSelectPalace;
    const isCenterSelected = Boolean(chart) && selectedPalaceNum === 5;

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: interactive ? 'group' : 'img',
      'aria-label': chart ? `奇门遁甲玄天浑天仪 ${chart.meta.juTitle}` : '奇门遁甲玄天浑天仪',
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h(CompassOrbit, { color: pal.goldBright }),
      // Fixed tick marks follow the compass headings.
      h('g', { 'aria-hidden': true },
        h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.4 }),
        ...Array.from({ length: 72 }, (_, i) => {
          const rad = (i * 5 * Math.PI) / 180;
          const major = i % 9 === 0;
          return h('line', {
            key: `qt-${i}`,
            x1: (cx + Math.cos(rad) * (major ? 191 : 196)).toFixed(1),
            y1: (cy + Math.sin(rad) * (major ? 191 : 196)).toFixed(1),
            x2: (cx + Math.cos(rad) * 202).toFixed(1),
            y2: (cy + Math.sin(rad) * 202).toFixed(1),
            stroke: major ? pal.goldBright : pal.goldLine,
            strokeWidth: major ? 1.8 : 0.85,
          });
        }),
      ),

      // Layer 2: Tangential Precision Vector Trigram Bars
      h('circle', { cx, cy, r: 164, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
      ...outerPalaces.map(p => {
        const deg = COMPASS_ANGLES[p.direction] ?? 0;
        const rad = (deg * Math.PI) / 180;
        return h(VectorTrigram, {
          key: `qt-tri-${p.num}`,
          name: p.trigram,
          x: cx + Math.cos(rad) * 177,
          y: cy + Math.sin(rad) * 177,
          width: 19,
          thickness: 2.3,
          gap: 2.3,
          angleDeg: deg + 90,
          color: hitSet.has(p.num) ? pal.blue : pal.gold,
        });
      }),

      // Layer 3: 8 Tiered Palace Wedges
      ...outerPalaces.map(p => {
        const deg = COMPASS_ANGLES[p.direction] ?? 0;
        const rad = (deg * Math.PI) / 180;
        const isSel = Boolean(chart) && selectedPalaceNum === p.num;
        const isHit = chart && hitSet.has(p.num);
        const isGood = ['开门', '休门', '生门'].includes(p.gate);
        const isTough = ['死门', '惊门', '伤门'].includes(p.gate);
        const horizontal = deg === 0 || deg === 180;
        const labelPosition = (radius, baseline, row) => ({
          x: cx + Math.cos(rad) * (horizontal ? 110 : radius),
          y: horizontal ? cy - 23 + row * 17 : cy + Math.sin(rad) * radius + baseline,
        });

        return h('g', {
          key: p.num,
          className: interactive ? 'zm-chart-control' : undefined,
          role: interactive ? 'button' : undefined,
          tabIndex: interactive ? 0 : undefined,
          'aria-label': [p.direction, p.gate, p.star, p.deity, p.isZhiShi && '值使', p.isKong && '空亡', p.isYiMa && '驿马'].filter(Boolean).join(' '),
          'aria-pressed': interactive ? isSel : undefined,
          style: { cursor: interactive ? 'pointer' : 'default' },
          onClick: interactive ? () => onSelectPalace(p.num) : undefined,
          onKeyDown: interactive ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(p.num); } } : undefined,
        },
          h('path', {
            d: makeSectorPath(cx, cy, deg, 21.4, 60, 160),
            fill: isSel ? pal.selFill : pal.wedgeIdle,
            stroke: isSel ? pal.selStroke : isHit ? pal.blue : pal.wedgeBorder,
            strokeWidth: isSel ? 2.4 : isHit ? 1.9 : 1.05,
          }),
          // Mark palaces that match the current topic.
          isHit ? h('g', null,
            h('path', {
              d: makeSectorPath(cx, cy, deg, 14, 160, 165),
              fill: pal.blue,
              pointerEvents: 'none',
            }),
          ) : null,
          // Tiered Glyphs (Deity -> Star -> Gate -> Stems)
          h('text', {
            ...labelPosition(144, 3.5, 0),
            textAnchor: 'middle',
            fill: p.isZhiFu ? pal.goldBright : pal.indigo,
            fontSize: 10.5,
            fontWeight: 700,
          }, `${p.deity}${p.isKong ? '·空' : ''}${p.isYiMa ? '·马' : ''}`),
          h('text', {
            ...labelPosition(123, 3.5, 1),
            textAnchor: 'middle',
            fill: pal.inkSub,
            fontSize: 10.5,
            fontWeight: 600,
          }, p.star),
          h('text', {
            ...labelPosition(101, 4.5, 2),
            textAnchor: 'middle',
            fill: isGood ? pal.goodStroke : isTough ? pal.badStroke : pal.ink,
            fontSize: 13.5,
            fontWeight: 800,
          }, `${p.gate}${p.isZhiShi ? '·使' : ''}`),
          h('text', {
            ...labelPosition(76, 3.5, 3),
            textAnchor: 'middle',
            fill: pal.gold,
            fontSize: 11,
            fontWeight: 800,
          }, `${p.heavenStem}/${p.earthStem}`),
          interactive ? h('path', {
            className: 'zm-chart-focus-ring',
            d: makeSectorPath(cx, cy, deg, 19.5, 64, 156),
            'aria-hidden': true,
          }) : null,
        );
      }),

      // Layer 4: Concentric Separator Hairlines
      h('circle', { cx, cy, r: 87, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.8 }),
      h('circle', { cx, cy, r: 113, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.8 }),

      // Layer 5: Central Sculpted Taiji Pool / Ju Title Core
      h('g', {
        className: interactive ? 'zm-chart-control' : undefined,
        role: interactive ? 'button' : undefined,
        tabIndex: interactive ? 0 : undefined,
        'aria-label': chart ? `中五宫 ${chart.meta.juTitle}` : '太极中宫',
        'aria-pressed': interactive ? isCenterSelected : undefined,
        style: { cursor: interactive ? 'pointer' : 'default' },
        onClick: interactive ? () => onSelectPalace(5) : undefined,
        onKeyDown: interactive ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(5); } } : undefined,
      },
        h('circle', {
          cx, cy, r: 56,
          fill: isCenterSelected ? pal.surfaceMid : pal.surface,
          stroke: isCenterSelected ? pal.selStroke : pal.gold,
          strokeWidth: isCenterSelected ? 2.4 : 2,
        }),
        chart ? h(React.Fragment, null,
          h('g', { opacity: isDark ? 0.22 : 0.14 }, h(TaijiCore, { cx, cy, r: 46, pal, spin: true })),
          h('text', { x: cx, y: cy - 3, textAnchor: 'middle', fill: pal.gold, fontSize: 14.5, fontWeight: 800 }, chart.meta.juTitle),
          h('text', { x: cx, y: cy + 16, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 10.5, fontWeight: 700 }, `中宫地盘 ${centerPalace?.earthStem || ''}`),
        ) : h(TaijiCore, { cx, cy, r: 44, pal, spin: true }),
        interactive ? h('circle', { className: 'zm-chart-focus-ring', cx, cy, r: 51, 'aria-hidden': true }) : null,
      ),
    );
  }

  // =========================================================================
  // 4. MEIHUA XIANTIAN BAGUA & 6-YAO RESONATOR (420x420) — Idle + Active!
  // =========================================================================
  const CONGENITAL_RING = [
    { num: 1, name: '乾', el: '金', deg: -90 },
    { num: 2, name: '兑', el: '金', deg: -135 },
    { num: 3, name: '离', el: '火', deg: 180 },
    { num: 4, name: '震', el: '木', deg: 135 },
    { num: 8, name: '坤', el: '土', deg: 90 },
    { num: 7, name: '艮', el: '土', deg: 45 },
    { num: 6, name: '坎', el: '水', deg: 0 },
    { num: 5, name: '巽', el: '木', deg: -45 },
  ];

  function getMeihuaStageContext(chart, stage) {
    if (!chart?.tiYong || (stage !== 'main' && stage !== 'changed')) return null;
    const ty = chart.tiYong;
    const changed = stage === 'changed';
    return {
      ti: ty.tiTrigram,
      yong: changed ? ty.changedYongTrigram : ty.yongTrigram,
      relation: changed ? ty.changedRelation : ty.mainRelation,
    };
  }

  function MeihuaResonatorSvg({ chart, isDark = true, activeStage = 'main' }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const ringR = 158;
    const glowId = `zm-mh-glow-${pal.key}`;

    const stage = getMeihuaStageContext(chart, activeStage);
    const tiNum = stage?.ti?.num ?? 0;
    const yongNum = stage?.yong?.num ?? 0;
    const posOf = num => {
      const g = CONGENITAL_RING.find(x => x.num === num) || CONGENITAL_RING[0];
      const rad = (g.deg * Math.PI) / 180;
      return { x: cx + Math.cos(rad) * ringR, y: cy + Math.sin(rad) * ringR };
    };
    const pTi = posOf(tiNum);
    const pYong = posOf(yongNum);
    const relation = stage?.relation?.relation;
    const beamColor = pal.gold;

    const hex = chart?.hexagrams?.[activeStage] || chart?.hexagrams?.main;
    const movingLine = activeStage === 'main' || activeStage === 'changed' ? (chart?.meta?.movingLine || 0) : 0;

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: 'img',
      'aria-label': chart ? `先天八卦星轨仪 ${hex?.fullName || ''}` : '先天八卦太极星轮',
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h('defs', null,
        h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
          h('feGaussianBlur', { stdDeviation: isDark ? 4.2 : 2, result: 'b' }),
          h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
        ),
      ),

      // Outer 64-Hexagram Celestial Ring
      h('g', { className: 'zm-spin-slow' },
        h('circle', { cx, cy, r: 200, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2 }),
        ...Array.from({ length: 64 }, (_, i) => {
          const rad = (i * (360 / 64) * Math.PI) / 180;
          const major = i % 8 === 0;
          return h('line', {
            key: `m64-${i}`,
            x1: (cx + Math.cos(rad) * (major ? 191 : 195)).toFixed(1),
            y1: (cy + Math.sin(rad) * (major ? 191 : 195)).toFixed(1),
            x2: (cx + Math.cos(rad) * 200).toFixed(1),
            y2: (cy + Math.sin(rad) * 200).toFixed(1),
            stroke: major ? pal.goldBright : pal.goldFaint,
            strokeWidth: major ? 1.6 : 0.9,
          });
        }),
      ),

      // Octagonal sacred halo linking the 8 Bagua nodes
      h('polygon', {
        points: CONGENITAL_RING.map(g => {
          const rad = (g.deg * Math.PI) / 180;
          return `${(cx + Math.cos(rad) * ringR).toFixed(1)},${(cy + Math.sin(rad) * ringR).toFixed(1)}`;
        }).join(' '),
        fill: 'none',
        stroke: pal.goldFaint,
        strokeWidth: 1,
      }),
      h('circle', {
        cx, cy, r: ringR, fill: 'none', stroke: pal.goldLine, strokeWidth: 1, strokeDasharray: '3 5',
        className: 'zm-decorative-orbit', style: { '--zm-orbit-direction': 'reverse' }, 'aria-hidden': true, pointerEvents: 'none',
      }),

      // Thick Multi-Layer Glowing Ti <-> Yong Energy Stream
      chart && tiNum && yongNum ? (
        tiNum !== yongNum ? h('g', null,
          h('path', {
            d: `M ${pYong.x.toFixed(1)} ${pYong.y.toFixed(1)} Q ${cx} ${cy} ${pTi.x.toFixed(1)} ${pTi.y.toFixed(1)}`,
            fill: 'none', stroke: beamColor, strokeWidth: 7, opacity: isDark ? 0.22 : 0.16, filter: `url(#${glowId})`,
          }),
          h('path', {
            d: `M ${pYong.x.toFixed(1)} ${pYong.y.toFixed(1)} Q ${cx} ${cy} ${pTi.x.toFixed(1)} ${pTi.y.toFixed(1)}`,
            fill: 'none', stroke: beamColor, strokeWidth: 2.6, strokeDasharray: '7 5', className: 'zm-dash-flow',
          }),
        ) : h('circle', {
          cx: pTi.x, cy: pTi.y, r: 34,
          fill: 'none', stroke: beamColor, strokeWidth: 2.2, strokeDasharray: '5 4', className: 'zm-dash-flow',
        })
      ) : null,

      // 8 Congenital Bagua Crystal Medallions (with crisp Vector Trigrams!)
      ...CONGENITAL_RING.map(g => {
        const rad = (g.deg * Math.PI) / 180;
        const x = cx + Math.cos(rad) * ringR;
        const y = cy + Math.sin(rad) * ringR;
        const isTi = chart && g.num === tiNum;
        const isYong = chart && g.num === yongNum;
        const elSt = pal.el[g.el];
        const ringColor = isTi ? pal.goldBright : (isYong ? pal.purple : elSt.ring);

        return h('g', { key: g.num },
          (isTi || isYong) ? h('circle', {
            cx: x, cy: y, r: 29,
            fill: 'none', stroke: ringColor, strokeWidth: 1.5, strokeDasharray: '3 3', className: 'zm-spin-rev',
          }) : null,
          h('circle', {
            cx: x, cy: y, r: 24,
            fill: pal.surface,
            stroke: ringColor,
            strokeWidth: (isTi || isYong) ? 2.4 : 1.3,
          }),
          h('circle', { cx: x, cy: y, r: 20.5, fill: isTi ? pal.goldSoft : isYong ? pal.trineFill : elSt.fill }),
          h(VectorTrigram, {
            name: g.name,
            x, y: y - 5.5,
            width: 18, thickness: 2.2, gap: 2, angleDeg: 0,
            color: isTi ? pal.gold : isYong ? pal.purple : elSt.fg,
          }),
          h('text', {
            x, y: y + 13.5,
            textAnchor: 'middle',
            fill: isTi ? pal.gold : isYong ? pal.purple : pal.ink,
            fontSize: 10.5,
            fontWeight: 800,
          }, isTi && isYong ? `${g.name}·体用` : isTi ? `${g.name}·体` : isYong ? `${g.name}·用` : g.name),
        );
      }),

      // Central Monumental Hexagram Altar (Active) OR Grand Sculpted Taiji Sphere (Idle)
      h('circle', { cx, cy, r: 96, fill: 'none', stroke: chart ? beamColor : pal.goldLine, strokeWidth: 1.4, opacity: 0.55, className: 'zm-aura' }),
      h('circle', { cx, cy, r: 90, fill: pal.surface, stroke: chart ? beamColor : pal.gold, strokeWidth: 2.2 }),
      hex ? h('g', null,
        h('g', { opacity: isDark ? 0.13 : 0.09 }, h(TaijiCore, { cx, cy, r: 82, pal })),
        // 6 Monumental Sculpted Yao Bars
        ...[5, 4, 3, 2, 1, 0].flatMap((idx, row) => {
          const yaoNum = idx + 1;
          const isYang = hex.lines[idx] === 1;
          const isMov = movingLine === yaoNum;
          const barW = 84;
          const barH = 8.5;
          const gapY = 6.5;
          const startY = cy - 54;
          const yy = startY + row * (barH + gapY);
          const isUpper = idx >= 3;
          const isTiBar = stage && ((chart.tiYong.tiPosition === 'upper') === isUpper);
          const barCol = isMov ? pal.amber : isTiBar ? pal.goldBright : stage ? pal.purple : pal.ink;
          const els = [];
          if (isYang) {
            els.push(h('rect', {
              key: `yao-${yaoNum}`,
              x: cx - barW / 2, y: yy, width: barW, height: barH, rx: 4.25,
              fill: barCol,
              filter: isMov ? `url(#${glowId})` : undefined,
              className: isMov ? 'zm-pulse-glow' : '',
            }));
          } else {
            const segW = (barW - 16) / 2;
            els.push(
              h('rect', { key: `yao-${yaoNum}-l`, x: cx - barW / 2, y: yy, width: segW, height: barH, rx: 4.25, fill: barCol, filter: isMov ? `url(#${glowId})` : undefined, className: isMov ? 'zm-pulse-glow' : '' }),
              h('rect', { key: `yao-${yaoNum}-r`, x: cx + 8, y: yy, width: segW, height: barH, rx: 4.25, fill: barCol, filter: isMov ? `url(#${glowId})` : undefined, className: isMov ? 'zm-pulse-glow' : '' }),
            );
          }
          if (isMov) {
            els.push(h('polygon', {
              key: `mov-${yaoNum}`,
              points: `${cx + barW / 2 + 7},${yy + 4.25} ${cx + barW / 2 + 12},${yy} ${cx + barW / 2 + 17},${yy + 4.25} ${cx + barW / 2 + 12},${yy + 8.5}`,
              fill: pal.amber,
            }));
          }
          return els;
        }),
        h('text', { x: cx, y: cy + 50, textAnchor: 'middle', fill: pal.gold, fontSize: 13.5, fontWeight: 800 }, hex.fullName),
        relation ? h('text', { x: cx, y: cy + 66, textAnchor: 'middle', fill: beamColor, fontSize: 10, fontWeight: 700 }, relation) : null,
      ) : h(TaijiCore, { cx, cy, r: 70, pal, spin: true }),
    );
  }

  // =========================================================================
  // 5. ZIWEI 12-PALACE CELESTIAL STAR-CHART WHEEL (420x420) — Idle + Active!
  // =========================================================================
  const IDLE_ZW_PALACES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'].map((br, i) => ({
    index: i,
    name: ['命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟'][i],
    earthlyBranch: br,
    majorStars: [],
    minorStars: [],
    oppositeIndex: (i + 6) % 12,
    trineIndices: [(i + 4) % 12, (i + 8) % 12],
  }));

  // Map 12 branches clockwise like traditional chart: 巳(3) top-left -> 午(4) top -> ...
  function ziweiAngleForIndex(idx) {
    // 午 (idx 4) at -75° / -105°, placing 巳(3)..申(6) across top, 亥(9)..寅(0) across bottom
    return -135 + (idx - 3) * 30;
  }

  function ZiweiStarWheelSvg({ chart, isDark = true, selectedPalaceIdx = 0, yearlyObj = null, onSelectPalace }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const palaces = chart?.palaces || IDLE_ZW_PALACES;
    const selPalace = palaces[selectedPalaceIdx] || palaces[0];
    const triSet = new Set(selPalace.trineIndices || []);
    const innerR = 98;
    const outerR = 192;
    const glowId = `zm-zw-glow-${pal.key}`;
    const interactive = chart && onSelectPalace;

    const yearlyMutByStar = {};
    if (yearlyObj?.mutagens) {
      for (const m of yearlyObj.mutagens) yearlyMutByStar[m.star] = m.mutagen;
    }

    const anchorOnInner = idx => {
      const rad = (ziweiAngleForIndex(idx) * Math.PI) / 180;
      return { x: cx + Math.cos(rad) * (innerR - 4), y: cy + Math.sin(rad) * (innerR - 4) };
    };

    const pSelf = anchorOnInner(selPalace.index);
    const pOpp = anchorOnInner(selPalace.oppositeIndex);
    const pT1 = anchorOnInner(selPalace.trineIndices[0]);
    const pT2 = anchorOnInner(selPalace.trineIndices[1]);

    const mutDotColor = { 禄: pal.goodStroke, 权: pal.amber, 科: pal.blue, 忌: pal.badStroke };

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: interactive ? 'group' : 'img',
      'aria-label': chart ? `紫微垣十二宫星图 ${chart.title}` : '紫微垣十二宫星图轮盘',
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h('defs', null,
        h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
          h('feGaussianBlur', { stdDeviation: isDark ? 3.5 : 1.6, result: 'b' }),
          h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
        ),
      ),

      // Outer Astronomical Degree Ring
      h('g', { className: 'zm-spin-slow' },
        h('circle', { cx, cy, r: 204, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2 }),
        ...Array.from({ length: 48 }, (_, i) => {
          const rad = (i * 7.5 * Math.PI) / 180;
          const maj = i % 4 === 0;
          return h('line', {
            key: `zt-${i}`,
            x1: (cx + Math.cos(rad) * (maj ? 196 : 199)).toFixed(1),
            y1: (cy + Math.sin(rad) * (maj ? 196 : 199)).toFixed(1),
            x2: (cx + Math.cos(rad) * 204).toFixed(1),
            y2: (cy + Math.sin(rad) * 204).toFixed(1),
            stroke: maj ? pal.goldBright : pal.goldFaint,
            strokeWidth: maj ? 1.5 : 0.8,
          });
        }),
      ),

      // 12 Radial Palace Wedges
      ...palaces.map(p => {
        const deg = ziweiAngleForIndex(p.index);
        const rad = (deg * Math.PI) / 180;
        const isSelf = Boolean(chart) && p.index === selectedPalaceIdx;
        const isOpposite = chart && p.index === selPalace.oppositeIndex;
        const isTrine = chart && !isSelf && triSet.has(p.index);
        const isYearly = chart && yearlyObj && yearlyObj.palaceIndex === p.index;
        const starLabel = p.majorStars.slice(0, 2).map(s => s.name).join('·') || (chart ? '空' : p.earthlyBranch);
        const firstMut = p.majorStars.find(s => s.mutagen)?.mutagen || p.minorStars.find(s => s.mutagen)?.mutagen;
        const firstYMut = p.majorStars.map(s => yearlyMutByStar[s.name]).find(Boolean) || p.minorStars.map(s => yearlyMutByStar[s.name]).find(Boolean);

        return h('g', {
          key: p.index,
          className: interactive ? 'zm-chart-control' : undefined,
          role: interactive ? 'button' : undefined,
          tabIndex: interactive ? 0 : undefined,
          'aria-label': `${p.name} ${starLabel}`,
          'aria-pressed': interactive ? isSelf : undefined,
          style: { cursor: interactive ? 'pointer' : 'default' },
          onClick: interactive ? () => onSelectPalace(p.index) : undefined,
          onKeyDown: interactive ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(p.index); } } : undefined,
        },
          h('path', {
            d: makeSectorPath(cx, cy, deg, 14.2, innerR, outerR),
            fill: isSelf ? pal.selFill : isOpposite ? pal.goldSoft : isTrine ? pal.trineFill : pal.wedgeIdle,
            stroke: isSelf || isOpposite ? pal.selStroke : isYearly ? pal.cyan : isTrine ? pal.trineStroke : pal.wedgeBorder,
            strokeWidth: (isSelf || isYearly) ? 2.2 : isTrine ? 1.6 : 1,
            strokeDasharray: isOpposite ? '4 3' : undefined,
          }),
          h('circle', {
            cx: (cx + Math.cos(rad) * 116).toFixed(1),
            cy: (cy + Math.sin(rad) * 116).toFixed(1),
            r: p.majorStars.length ? 3.5 : 1.8,
            fill: isSelf ? pal.goldBright : (p.majorStars.length ? pal.purple : pal.inkMuted),
            filter: p.majorStars.length ? `url(#${glowId})` : undefined,
          }),
          // Primary Star Name(s)
          h('text', {
            x: cx + Math.cos(rad) * 145,
            y: cy + Math.sin(rad) * 145 + 3.5,
            textAnchor: 'middle',
            fill: p.majorStars.length ? (isSelf ? pal.gold : pal.purple) : pal.inkMuted,
            fontSize: starLabel.length > 3 ? 9 : 10.5,
            fontWeight: 800,
          }, starLabel),
          // Palace Name on outer rim
          h('text', {
            x: cx + Math.cos(rad) * 176,
            y: cy + Math.sin(rad) * 176 + 3.5,
            textAnchor: 'middle',
            fill: p.isSoulPalace ? pal.gold : isYearly ? pal.cyan : pal.inkSub,
            fontSize: 10,
            fontWeight: (p.isSoulPalace || isYearly) ? 800 : 600,
          }, isYearly ? `${p.name}·流命` : p.name),
          // Natal Mutagen Gem
          firstMut ? h('g', null,
            h('circle', {
              cx: (cx + Math.cos(rad - 0.12) * 130).toFixed(1),
              cy: (cy + Math.sin(rad - 0.12) * 130).toFixed(1),
              r: 6.5,
              fill: mutDotColor[firstMut] || pal.gold,
            }),
            h('text', {
              x: (cx + Math.cos(rad - 0.12) * 130).toFixed(1),
              y: (cy + Math.sin(rad - 0.12) * 130 + 2.8).toFixed(1),
              textAnchor: 'middle',
              fill: '#ffffff',
              fontSize: 7.5,
              fontWeight: 800,
            }, firstMut),
          ) : null,
          // Yearly Flying Mutagen Gem
          firstYMut ? h('g', null,
            h('circle', {
              cx: (cx + Math.cos(rad + 0.12) * 130).toFixed(1),
              cy: (cy + Math.sin(rad + 0.12) * 130).toFixed(1),
              r: 6.5,
              fill: pal.cyan,
            }),
            h('text', {
              x: (cx + Math.cos(rad + 0.12) * 130).toFixed(1),
              y: (cy + Math.sin(rad + 0.12) * 130 + 2.8).toFixed(1),
              textAnchor: 'middle',
              fill: '#ffffff',
              fontSize: 7.5,
              fontWeight: 800,
            }, firstYMut),
          ) : null,
          interactive ? h('path', {
            className: 'zm-chart-focus-ring',
            d: makeSectorPath(cx, cy, deg, 12.6, innerR + 4, outerR - 4),
            'aria-hidden': true,
          }) : null,
        );
      }),

      // Inner Polaris Star-Chart Core + Tri-Aspect Constellation Laser Geometry
      h('circle', { cx, cy, r: innerR - 2, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.8 }),
      h('circle', {
        cx, cy, r: innerR - 14, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.9, strokeDasharray: '2 4',
        className: 'zm-decorative-orbit', style: { '--zm-orbit-direction': 'reverse' }, 'aria-hidden': true, pointerEvents: 'none',
      }),
      // Luminous Tri-Aspect Triangle (三合)
      h('polygon', {
        points: `${pSelf.x.toFixed(1)},${pSelf.y.toFixed(1)} ${pT1.x.toFixed(1)},${pT1.y.toFixed(1)} ${pT2.x.toFixed(1)},${pT2.y.toFixed(1)}`,
        fill: pal.trineFill,
        stroke: pal.trineStroke,
        strokeWidth: 1.8,
        strokeLinejoin: 'round',
        filter: `url(#${glowId})`,
      }),
      // Golden Opposition Spear (对宫冲照)
      h('line', {
        x1: pSelf.x.toFixed(1), y1: pSelf.y.toFixed(1), x2: pOpp.x.toFixed(1), y2: pOpp.y.toFixed(1),
        stroke: pal.goldBright,
        strokeWidth: 2,
        strokeDasharray: '6 4',
        className: 'zm-dash-flow',
      }),
      ...[pSelf, pOpp, pT1, pT2].map((pt, i) => h('circle', {
        key: `v-${i}`,
        cx: pt.x, cy: pt.y,
        r: i === 0 ? 5.2 : 3.8,
        fill: i <= 1 ? pal.goldBright : pal.trineStroke,
      })),

      // Center Core Medallion
      h('circle', { cx, cy, r: 42, fill: pal.surface, stroke: pal.goldLine, strokeWidth: 1.2, opacity: 0.92 }),
      chart ? h(React.Fragment, null,
        h('text', { x: cx, y: cy - 7, textAnchor: 'middle', fill: pal.gold, fontSize: 13.5, fontWeight: 800 }, chart.meta.fiveElementsClass),
        h('text', { x: cx, y: cy + 9, textAnchor: 'middle', fill: pal.ink, fontSize: 11, fontWeight: 700 }, selPalace.name),
        h('text', { x: cx, y: cy + 23, textAnchor: 'middle', fill: yearlyObj ? pal.cyan : pal.inkMuted, fontSize: 9.5, fontWeight: 700 },
          yearlyObj ? `${yearlyObj.year} ${yearlyObj.stemBranch}` : `主星 ${chart.meta.soulStar}`,
        ),
      ) : h(React.Fragment, null,
        h('text', { x: cx, y: cy - 2, textAnchor: 'middle', fill: pal.gold, fontSize: 15, fontWeight: 800 }, '紫微垣'),
        h('text', { x: cx, y: cy + 15, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9.5 }, '十二宫星盘'),
      ),
    );
  }

  // =========================================================================
  // 6. HEPAN FORTUNE PERIOD TIMELINE
  // =========================================================================
  function HepanTimeline30ySvg({ timeline30y, nameA, nameB, isDark = true }) {
    const pal = getPalette(isDark);
    const { from, toExclusive, personA, personB } = timeline30y;
    const left = 36;
    const right = 402;
    const first = Date.parse(from);
    const last = Date.parse(toExclusive);
    const xAt = date => left + ((Math.max(first, Math.min(last, Date.parse(date))) - first) / (last - first)) * (right - left);
    const startYear = Number(from.slice(0, 4));

    const row = (periods, name, y, accent, key) => h('g', { key },
      h('text', { x: left, y: y - 7, fill: pal.inkSub, fontSize: 11, fontWeight: 700 }, name),
      h('rect', { x: left, y, width: right - left, height: 24, rx: 5, fill: pal.surface, stroke: pal.goldFaint }),
      ...periods.map(period => {
        const x = xAt(period.startDate);
        const width = xAt(period.endExclusive) - x;
        return h('g', { key: period.startDate },
          h('title', null, `${period.ganZhi} · ${period.startDate} 至 ${period.endExclusive} 交下一运`),
          h('rect', { x, y, width, height: 24, rx: 4, fill: accent, fillOpacity: 0.22, stroke: accent }),
          width >= 23 ? h('text', { x: x + width / 2, y: y + 16, fill: pal.ink, textAnchor: 'middle', fontWeight: 700, fontSize: 11 }, period.ganZhi) : null,
        );
      }),
    );

    return h('svg', { viewBox: '0 0 420 170', width: '100%', role: 'img', 'aria-label': '未来三十年大运起止日期对照' },
      row(personA, nameA, 42, pal.blue, 'a'),
      row(personB, nameB, 92, pal.pink, 'b'),
      ...[0, 5, 10, 15, 20, 25, 30].map(offset => {
        const year = startYear + offset;
        const x = xAt(`${year}-01-01`);
        return h('g', { key: year },
          h('line', { x1: x, y1: 120, x2: x, y2: 125, stroke: pal.goldLine }),
          h('text', { x, y: 140, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9.5 }, year),
        );
      }),
    );
  }

  // =========================================================================
  // 7. XUANKONG NINE FLYING STARS OCTAGONAL LUOPAN ALTAR (420x420)
  // =========================================================================
  const FLYING_STAR_INFO = {
    1: { name: '一白贪狼', short: '一白', tag: '水', colorD: '#60a5fa', colorL: '#1d4ed8' },
    2: { name: '二黑巨门', short: '二黑', tag: '土', colorD: '#fbbf24', colorL: '#b45309' },
    3: { name: '三碧禄存', short: '三碧', tag: '木', colorD: '#34d399', colorL: '#047857' },
    4: { name: '四绿文曲', short: '四绿', tag: '木', colorD: '#10b981', colorL: '#059669' },
    5: { name: '五黄廉贞', short: '五黄', tag: '土', colorD: '#fb7185', colorL: '#c81e3a' },
    6: { name: '六白武曲', short: '六白', tag: '金', colorD: '#fde047', colorL: '#9a6700' },
    7: { name: '七赤破军', short: '七赤', tag: '金', colorD: '#cbd5e1', colorL: '#475569' },
    8: { name: '八白左辅', short: '八白', tag: '土', colorD: '#f59e0b', colorL: '#b45309' },
    9: { name: '九紫右弼', short: '九紫', tag: '火', colorD: '#f472b6', colorL: '#be185d' },
  };

  function getFlyingStarsForYear(year) {
    // 《协纪辨方书·三元年九星入中宫》以康熙二十三年甲子为上元一白。
    const centerStar = ((1684 - year) % 9 + 9) % 9 + 1;
    const flyOrder = [5, 6, 7, 8, 9, 1, 2, 3, 4];
    const starByPalace = {};
    flyOrder.forEach((pNum, offset) => {
      starByPalace[pNum] = ((centerStar - 1 + offset) % 9) + 1;
    });
    const gridMeta = [
      [4, '东南', '巽', 0, 0], [9, '正南', '离', 0, 1], [2, '西南', '坤', 0, 2],
      [3, '正东', '震', 1, 0], [5, '中宫', '中', 1, 1], [7, '正西', '兑', 1, 2],
      [8, '东北', '艮', 2, 0], [1, '正北', '坎', 2, 1], [6, '西北', '乾', 2, 2],
    ];
    return gridMeta.map(([pNum, dir, tri, row, col]) => {
      const starNum = starByPalace[pNum];
      const info = FLYING_STAR_INFO[starNum];
      return { palaceNum: pNum, direction: dir, trigram: tri, row, col, starNum, flyStep: flyOrder.indexOf(pNum), ...info };
    });
  }

  function FlyingStarsAltarSvg({ flyingStars = [], year, isDark = true, selectedPalaceNum, onSelectPalace }) {
    const pal = getPalette(isDark);
    const cx = 210;
    const cy = 210;
    const cellSize = 68;
    const gap = 7;
    const gridW = cellSize * 3 + gap * 2;
    const origin = cx - gridW / 2;

    return h('svg', {
      viewBox: '0 0 420 420',
      width: '100%',
      role: onSelectPalace ? 'group' : 'img',
      'aria-label': `${year} 年玄空流年九宫飞星罗盘`,
      style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
    },
      h(CompassOrbit, { color: pal.goldBright }),
      // Fixed tick marks follow the grid's headings.
      h('g', { 'aria-hidden': true },
        h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.3 }),
        ...Array.from({ length: 48 }, (_, i) => {
          const rad = (i * 7.5 * Math.PI) / 180;
          const maj = i % 6 === 0;
          return h('line', {
            key: `fs-${i}`,
            x1: (cx + Math.cos(rad) * (maj ? 193 : 197)).toFixed(1),
            y1: (cy + Math.sin(rad) * (maj ? 193 : 197)).toFixed(1),
            x2: (cx + Math.cos(rad) * 202).toFixed(1),
            y2: (cy + Math.sin(rad) * 202).toFixed(1),
            stroke: maj ? pal.goldBright : pal.goldFaint,
            strokeWidth: maj ? 1.6 : 0.85,
          });
        }),
      ),
      // Engraved Octagonal Frame (apothem ~162.6 cleanly encloses grid corner ~154.1) + 8 Outer Vector Trigrams
      h('polygon', {
        points: Array.from({ length: 8 }, (_, i) => {
          const rad = ((i * 45 + 22.5) * Math.PI) / 180;
          return `${(cx + Math.cos(rad) * 176).toFixed(1)},${(cy + Math.sin(rad) * 176).toFixed(1)}`;
        }).join(' '),
        fill: 'none',
        stroke: pal.goldLine,
        strokeWidth: 1.2,
      }),
      ...Object.entries(DIR_TRIGRAM).map(([dir, tri]) => {
        const deg = COMPASS_ANGLES[dir] ?? 0;
        const rad = (deg * Math.PI) / 180;
        return h(VectorTrigram, {
          key: `fstri-${dir}`,
          name: tri,
          x: cx + Math.cos(rad) * 182,
          y: cy + Math.sin(rad) * 182,
          width: 16, thickness: 2, gap: 2, angleDeg: deg + 90,
          color: pal.gold,
        });
      }),

      // 3x3 Luminous Geometric Flying-Star Chambers
      ...flyingStars.map(cell => {
        const x = origin + cell.col * (cellSize + gap);
        const y = origin + cell.row * (cellSize + gap);
        const isSel = selectedPalaceNum === cell.palaceNum;
        const stCol = isDark ? cell.colorD : cell.colorL;
        return h('g', {
          key: cell.palaceNum,
          className: onSelectPalace ? 'zm-chart-control' : undefined,
          role: onSelectPalace ? 'button' : undefined,
          tabIndex: onSelectPalace ? 0 : undefined,
          'aria-label': `${cell.direction} ${cell.name} ${cell.tag}`,
          'aria-pressed': onSelectPalace ? isSel : undefined,
          style: { cursor: onSelectPalace ? 'pointer' : 'default' },
          onClick: onSelectPalace ? () => onSelectPalace(cell.palaceNum) : undefined,
          onKeyDown: onSelectPalace ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(cell.palaceNum); } } : undefined,
        },
          h('rect', {
            x, y, width: cellSize, height: cellSize, rx: 11,
            fill: isSel ? pal.selFill : pal.wedgeIdle,
            stroke: isSel ? pal.selStroke : pal.wedgeBorder,
            strokeWidth: isSel ? 2.4 : 1.1,
          }),
          h('text', { x: x + cellSize / 2, y: y + 16, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9, fontWeight: 700 }, cell.direction),
          h('text', { x: x + cellSize / 2, y: y + 39, textAnchor: 'middle', fill: stCol, fontSize: 18, fontWeight: 800 }, cell.short),
          h('text', { x: x + cellSize / 2, y: y + 56, textAnchor: 'middle', fill: pal.inkSub, fontSize: 9, fontWeight: 700 }, cell.tag),
          onSelectPalace ? h('rect', {
            className: 'zm-chart-focus-ring',
            x: x + 4, y: y + 4, width: cellSize - 8, height: cellSize - 8, rx: 7,
            'aria-hidden': true,
          }) : null,
        );
      }),
    );
  }

  return {
    getPalette,
    ChartCanvas,
    BaziOrrerySvg,
    BaZhaiCompassSvg,
    QimenArmillarySvg,
    MeihuaResonatorSvg,
    getMeihuaStageContext,
    ZiweiStarWheelSvg,
    HepanTimeline30ySvg,
    FlyingStarsAltarSvg,
    getFlyingStarsForYear,
  };
}

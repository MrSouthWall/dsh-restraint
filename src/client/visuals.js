function createVisuals(React) {
  const h = React.createElement;

  class ZhimingErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, message: '' };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true, message: error?.message || String(error) };
    }
    render() {
      if (this.state.hasError) {
        return h('div', { className: 'zm-card', style: { margin: 8 } },
          h('div', { style: { fontWeight: 600, marginBottom: 6 } }, this.props.fallbackText || '知命视图渲染异常'),
          h('div', { className: 'zm-muted', style: { marginBottom: 8 } }, this.state.message),
          h('button', {
            type: 'button',
            className: 'zm-btn zm-btn-sm',
            onClick: () => this.setState({ hasError: false, message: '' }),
          }, this.props.resetText || '重新加载视图'),
        );
      }
      return this.props.children;
    }
  }

  function LuopanEmblem({ size = 34, spin = true }) {
    const ticks = [];
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      const rad = (deg * Math.PI) / 180;
      const x1 = 32 + Math.cos(rad) * 23;
      const y1 = 32 + Math.sin(rad) * 23;
      const x2 = 32 + Math.cos(rad) * 28.5;
      const y2 = 32 + Math.sin(rad) * 28.5;
      ticks.push(h('line', {
        key: i,
        x1: x1.toFixed(2), y1: y1.toFixed(2),
        x2: x2.toFixed(2), y2: y2.toFixed(2),
        stroke: i % 3 === 0 ? '#c9973b' : 'rgba(201,151,59,0.55)',
        strokeWidth: i % 3 === 0 ? 1.8 : 1.1,
        strokeLinecap: 'round',
      }));
    }
    const baguaMarks = [];
    for (let i = 0; i < 8; i++) {
      const deg = i * 45 + 22.5;
      const rad = (deg * Math.PI) / 180;
      const cx = 32 + Math.cos(rad) * 18.5;
      const cy = 32 + Math.sin(rad) * 18.5;
      baguaMarks.push(h('circle', {
        key: i,
        cx: cx.toFixed(2),
        cy: cy.toFixed(2),
        r: 1.35,
        fill: i % 2 === 0 ? '#c9973b' : '#6366f1',
      }));
    }
    return h('svg', {
      width: size,
      height: size,
      viewBox: '0 0 64 64',
      fill: 'none',
      'aria-hidden': true,
      style: { flexShrink: 0, display: 'block' },
    },
      h('g', { className: spin ? 'zm-spin-slow' : '' },
        h('circle', { cx: 32, cy: 32, r: 29, stroke: 'rgba(201,151,59,0.55)', strokeWidth: 1.4 }),
        ...ticks,
      ),
      h('g', { className: spin ? 'zm-spin-rev' : '' },
        h('circle', { cx: 32, cy: 32, r: 21.5, stroke: 'rgba(99,102,241,0.45)', strokeWidth: 1, strokeDasharray: '3 3' }),
        ...baguaMarks,
      ),
      h('circle', { cx: 32, cy: 32, r: 12.5, fill: '#1e1b2e', stroke: '#c9973b', strokeWidth: 1.5 }),
      h('path', {
        d: 'M32 19.5 A12.5 12.5 0 0 1 32 44.5 A6.25 6.25 0 0 1 32 32 A6.25 6.25 0 0 0 32 19.5 Z',
        fill: '#f3d999',
      }),
      h('circle', { cx: 32, cy: 25.75, r: 2.1, fill: '#1e1b2e' }),
      h('circle', { cx: 32, cy: 38.25, r: 2.1, fill: '#f3d999' }),
    );
  }

  function GuideArtworkSvg({ size = 20 }) {
    return h(LuopanEmblem, { size, spin: false });
  }

  function WuXingPentagonSvg({ percentages = {}, favorable = [], selectedElement = null, onSelectElement }) {
    const elements = ['木', '火', '土', '金', '水'];
    const cx = 75;
    const cy = 76;
    const outerR = 54;
    const pts = elements.map((el, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return { el, x: cx + Math.cos(angle) * outerR, y: cy + Math.sin(angle) * outerR, angle };
    });

    const maxPct = Math.max(35, ...elements.map(e => Number(percentages[e]) || 0));
    const dataPoints = pts.map(p => {
      const val = Number(percentages[p.el]) || 10;
      const ratio = 0.22 + (val / maxPct) * 0.72;
      return `${(cx + Math.cos(p.angle) * outerR * ratio).toFixed(1)},${(cy + Math.sin(p.angle) * outerR * ratio).toFixed(1)}`;
    }).join(' ');

    const starOrder = [0, 2, 4, 1, 3, 0];
    const starPath = starOrder.map((idx, k) => `${k === 0 ? 'M' : 'L'}${pts[idx].x.toFixed(1)} ${pts[idx].y.toFixed(1)}`).join(' ');

    return h('svg', {
      viewBox: '0 0 150 150',
      width: 146,
      height: 146,
      role: 'img',
      'aria-label': '五行能量五角星图',
      style: { display: 'block', margin: '0 auto', overflow: 'visible' },
    },
      h('polygon', {
        points: pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
        fill: 'none',
        stroke: 'rgba(201,151,59,0.42)',
        strokeWidth: 1.2,
      }),
      h('path', {
        d: starPath,
        fill: 'none',
        stroke: 'rgba(148,163,184,0.28)',
        strokeWidth: 1,
        strokeDasharray: '2.5 2.5',
      }),
      h('polygon', {
        points: dataPoints,
        fill: 'rgba(201,151,59,0.20)',
        stroke: '#c9973b',
        strokeWidth: 1.8,
        strokeLinejoin: 'round',
      }),
      ...pts.map(p => {
        const meta = WUXING_STYLE[p.el];
        const isFav = favorable.includes(p.el);
        const isSel = selectedElement === p.el;
        return h('g', {
          key: p.el,
          role: onSelectElement ? 'button' : undefined,
          tabIndex: onSelectElement ? 0 : undefined,
          'aria-label': meta.label,
          style: { cursor: onSelectElement ? 'pointer' : 'default' },
          onClick: onSelectElement ? () => onSelectElement(p.el) : undefined,
          onKeyDown: onSelectElement ? e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectElement(p.el);
            }
          } : undefined,
        },
          isFav ? h('circle', {
            cx: p.x, cy: p.y, r: 16.5,
            fill: 'none', stroke: meta.color, strokeWidth: 1.2, strokeDasharray: '2 2',
          }) : null,
          h('circle', {
            cx: p.x,
            cy: p.y,
            r: isSel ? 14 : 12.5,
            fill: meta.soft,
            stroke: meta.color,
            strokeWidth: isSel ? 2.2 : 1.5,
          }),
          h('text', {
            x: p.x,
            y: p.y + 4,
            textAnchor: 'middle',
            fill: meta.color,
            fontSize: 11,
            fontWeight: 800,
          }, p.el),
        );
      }),
    );
  }

  function HexagramLinesSvg({ lines = [1, 1, 1, 1, 1, 1], movingLine = 0, tiPosition = '', compact = false }) {
    const w = compact ? 66 : 92;
    const lineH = compact ? 6 : 8;
    const gap = compact ? 4 : 6;
    const totalH = 6 * lineH + 5 * gap + 8;

    const rows = [];
    for (let idx = 5; idx >= 0; idx--) {
      const yaoNum = idx + 1;
      const isYang = lines[idx] === 1;
      const isMoving = movingLine === yaoNum;
      const y = (5 - idx) * (lineH + gap) + 4;
      const isUpper = idx >= 3;
      const isTi = (tiPosition === 'upper' && isUpper) || (tiPosition === 'lower' && !isUpper);
      const fill = isMoving ? 'var(--zm-red)' : isTi ? 'var(--zm-gold-bright)' : 'var(--zm-indigo)';

      if (isYang) {
        rows.push(h('rect', {
          key: `y-${yaoNum}`,
          x: 6, y, width: w - 12, height: lineH, rx: lineH / 2,
          fill,
          className: isMoving ? 'zm-pulse-glow' : '',
        }));
      } else {
        const segW = (w - 22) / 2;
        rows.push(
          h('rect', {
            key: `y-${yaoNum}-l`,
            x: 6, y, width: segW, height: lineH, rx: lineH / 2,
            fill,
            className: isMoving ? 'zm-pulse-glow' : '',
          }),
          h('rect', {
            key: `y-${yaoNum}-r`,
            x: 6 + segW + 10, y, width: segW, height: lineH, rx: lineH / 2,
            fill,
            className: isMoving ? 'zm-pulse-glow' : '',
          }),
        );
      }

      if (isMoving) {
        rows.push(h('circle', {
          key: `dot-${yaoNum}`,
          cx: w - 2,
          cy: y + lineH / 2,
          r: 2.5,
          fill: 'var(--zm-red)',
        }));
      }
    }

    const midY = 3 * lineH + 2.5 * gap + 4;
    rows.push(h('line', {
      key: 'div',
      x1: 2, y1: midY, x2: w - 2, y2: midY,
      stroke: 'rgba(148,163,184,0.28)',
      strokeWidth: 0.8,
      strokeDasharray: '2 2',
    }));

    return h('svg', {
      viewBox: `0 0 ${w} ${totalH}`,
      width: w,
      height: totalH,
      'aria-hidden': true,
      style: { display: 'block' },
    }, ...rows);
  }

  function ScoreRingSvg({ score = 80, label = '', accent = 'var(--zm-gold)', size = 112 }) {
    const r = 42;
    const c = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(100, Number(score) || 0));
    const offset = c * (1 - clamped / 100);
    return h('svg', {
      viewBox: '0 0 108 108',
      width: size,
      height: size,
      role: 'img',
      'aria-label': `${clamped} ${label}`,
      style: { display: 'block' },
    },
      h('circle', {
        cx: 54, cy: 54, r,
        fill: 'none',
        stroke: 'rgba(148,163,184,0.22)',
        strokeWidth: 8,
      }),
      h('circle', {
        cx: 54, cy: 54, r,
        fill: 'none',
        stroke: accent,
        strokeWidth: 8,
        strokeLinecap: 'round',
        strokeDasharray: c.toFixed(2),
        strokeDashoffset: offset.toFixed(2),
        transform: 'rotate(-90 54 54)',
        style: { transition: 'stroke-dashoffset 0.6s ease' },
      }),
      h('text', {
        x: 54, y: 53,
        textAnchor: 'middle',
        fill: 'currentColor',
        fontSize: 24,
        fontWeight: 800,
      }, String(clamped)),
      h('text', {
        x: 54, y: 70,
        textAnchor: 'middle',
        fill: accent,
        fontSize: 10,
        fontWeight: 700,
      }, label),
    );
  }

  function RadarChartSvg({ dimensions = [] }) {
    const items = dimensions.slice(0, 6);
    if (items.length < 3) return null;
    const cx = 105;
    const cy = 92;
    const r = 60;
    const n = items.length;
    const rings = [0.35, 0.68, 1.0];

    const pointAt = (i, ratio) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return { x: cx + Math.cos(a) * r * ratio, y: cy + Math.sin(a) * r * ratio };
    };

    const dataPoly = items.map((d, i) => {
      const p = pointAt(i, Math.max(0.2, (Number(d.score) || 60) / 100));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

    return h('svg', {
      viewBox: '0 0 210 184',
      width: '100%',
      height: 176,
      role: 'img',
      'aria-label': '六维合盘雷达图',
      style: { display: 'block', maxWidth: 230, margin: '0 auto' },
    },
      ...rings.map((ratio, ri) => h('polygon', {
        key: `r-${ri}`,
        points: items.map((_, i) => {
          const p = pointAt(i, ratio);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' '),
        fill: 'none',
        stroke: 'rgba(148,163,184,0.28)',
        strokeWidth: 1,
      })),
      ...items.map((_, i) => {
        const p = pointAt(i, 1);
        return h('line', {
          key: `ax-${i}`,
          x1: cx, y1: cy, x2: p.x.toFixed(1), y2: p.y.toFixed(1),
          stroke: 'rgba(148,163,184,0.22)',
          strokeWidth: 1,
        });
      }),
      h('polygon', {
        points: dataPoly,
        fill: 'rgba(236,72,153,0.22)',
        stroke: 'var(--zm-pink)',
        strokeWidth: 2,
        strokeLinejoin: 'round',
      }),
      ...items.map((d, i) => {
        const p = pointAt(i, Math.max(0.2, (Number(d.score) || 60) / 100));
        const lp = pointAt(i, 1.24);
        return h('g', { key: d.key || i },
          h('circle', { cx: p.x, cy: p.y, r: 3.4, fill: 'var(--zm-pink)' }),
          h('text', {
            x: lp.x,
            y: lp.y + 3,
            textAnchor: 'middle',
            fill: 'currentColor',
            fontSize: 9.5,
            fontWeight: 600,
          }, `${d.label} ${d.score}`),
        );
      }),
    );
  }

  const ZW_ANCHOR = {
    3: { x: 4, y: 4 },
    4: { x: 26, y: 4 },
    5: { x: 74, y: 4 },
    6: { x: 96, y: 4 },
    2: { x: 4, y: 26 },
    7: { x: 96, y: 26 },
    1: { x: 4, y: 74 },
    8: { x: 96, y: 74 },
    0: { x: 4, y: 96 },
    11: { x: 26, y: 96 },
    10: { x: 74, y: 96 },
    9: { x: 96, y: 96 },
  };

  function ZiweiTriAspectSvg({ selectedPalace }) {
    if (!selectedPalace) return null;
    const pSelf = ZW_ANCHOR[selectedPalace.index];
    const pOpp = ZW_ANCHOR[selectedPalace.oppositeIndex];
    const pT1 = ZW_ANCHOR[selectedPalace.trineIndices?.[0]];
    const pT2 = ZW_ANCHOR[selectedPalace.trineIndices?.[1]];
    if (!pSelf || !pOpp || !pT1 || !pT2) return null;

    return h('svg', {
      viewBox: '0 0 100 100',
      preserveAspectRatio: 'xMidYMid meet',
      'aria-hidden': true,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.78,
      },
    },
      h('line', {
        x1: pSelf.x, y1: pSelf.y, x2: pOpp.x, y2: pOpp.y,
        stroke: 'var(--zm-gold-bright)',
        strokeWidth: 1.5,
        strokeDasharray: '3 2',
      }),
      h('polygon', {
        points: `${pSelf.x},${pSelf.y} ${pT1.x},${pT1.y} ${pT2.x},${pT2.y}`,
        fill: 'rgba(168,85,247,0.10)',
        stroke: 'var(--zm-purple)',
        strokeWidth: 1.4,
      }),
      h('circle', { cx: pSelf.x, cy: pSelf.y, r: 3.2, fill: 'var(--zm-gold-bright)' }),
      h('circle', { cx: pOpp.x, cy: pOpp.y, r: 2.5, fill: 'var(--zm-gold-bright)' }),
      h('circle', { cx: pT1.x, cy: pT1.y, r: 2.5, fill: 'var(--zm-purple)' }),
      h('circle', { cx: pT2.x, cy: pT2.y, r: 2.5, fill: 'var(--zm-purple)' }),
    );
  }

  return {
    ZhimingErrorBoundary,
    LuopanEmblem,
    GuideArtworkSvg,
    WuXingPentagonSvg,
    HexagramLinesSvg,
    ScoreRingSvg,
    RadarChartSvg,
    ZiweiTriAspectSvg,
  };
}

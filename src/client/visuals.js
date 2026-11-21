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
          h('div', { style: { fontWeight: 600, marginBottom: 6 } }, this.props.fallbackText || '虚白视图渲染异常'),
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

  function DeepSeekButton({ children, primary = false, disabled, onClick }) {
    return h('button', {
      type: 'button',
      className: `zm-btn zm-btn-sm${primary ? ' zm-btn-gold' : ''}`,
      disabled,
      onClick,
    },
      h('svg', {
        className: 'zm-deepseek-mark',
        width: 16,
        height: 16,
        viewBox: '145.467 11.5215 23.16 17.0435',
        fill: 'currentColor',
        'aria-hidden': true,
        focusable: 'false',
      },
        // Official whale outline from DeepSeek Harness's welcome-brand.svg.
        h('path', { d: `
          M168.384 12.9517C168.138 12.8317 168.033 13.0607 167.889 13.1767
          C167.84 13.2142 167.799 13.2632 167.757 13.3082C167.399 13.6912 166.98 13.9427 166.433 13.9127
          C165.632 13.8677 164.949 14.1192 164.345 14.7312C164.217 13.9767 163.79 13.5262 163.141 13.2372
          C162.802 13.0872 162.458 12.9367 162.22 12.6102C162.054 12.3776 162.009 12.1186 161.926 11.8631
          C161.873 11.7091 161.82 11.5516 161.643 11.5251C161.45 11.4951 161.375 11.6566 161.299 11.7916
          C160.997 12.3436 160.88 12.9517 160.892 13.5677C160.918 14.9532 161.503 16.0568 162.666 16.8418
          C162.798 16.9318 162.832 17.0218 162.79 17.1533C162.711 17.4238 162.617 17.6863 162.534 17.9568
          C162.481 18.1293 162.402 18.1673 162.217 18.0918C161.579 17.8253 161.028 17.4308 160.541 16.9543
          C159.714 16.1548 158.967 15.2722 158.035 14.5812C157.816 14.4197 157.597 14.2697 157.37 14.1267
          C156.419 13.2032 157.495 12.4446 157.744 12.3546C158.004 12.2606 157.834 11.9376 156.993 11.9416
          C156.151 11.9451 155.381 12.2271 154.4 12.6027C154.256 12.6592 154.105 12.7002 153.951 12.7342
          C153.06 12.5652 152.135 12.5277 151.169 12.6367C149.35 12.8392 147.897 13.6992 146.829 15.1672
          C145.546 16.9318 145.244 18.9368 145.613 21.0279C146.002 23.232 147.127 25.0565 148.855 26.4831
          C150.648 27.9621 152.713 28.6871 155.068 28.5481C156.499 28.4656 158.091 28.2741 159.888 26.7536
          C160.341 26.9791 160.816 27.0691 161.605 27.1366C162.212 27.1931 162.797 27.1066 163.25 27.0126
          C163.96 26.8626 163.911 26.2056 163.654 26.0851C161.575 25.1165 162.031 25.5105 161.616 25.1915
          C162.673 23.9415 164.287 21.7194 164.785 18.6938C164.834 18.3598 164.896 17.8893 164.889 17.6188
          C164.885 17.4538 164.923 17.3898 165.111 17.3708C165.632 17.3108 166.138 17.1683 166.603 16.9128
          C167.95 16.1768 168.494 14.9677 168.622 13.5187C168.641 13.2972 168.618 13.0682 168.384 12.9517Z
          M156.642 25.9951C154.626 24.4105 153.649 23.889 153.245 23.9115C152.868 23.934 152.936 24.366 153.019 24.6475
          C153.106 24.9255 153.219 25.117 153.377 25.361C153.487 25.5225 153.562 25.7625 153.268 25.9431
          C152.619 26.3446 151.49 25.808 151.437 25.7815C150.124 25.008 149.025 23.987 148.251 22.5905
          C147.504 21.2464 147.07 19.8044 146.998 18.2653C146.979 17.8938 147.089 17.7623 147.459 17.6948
          C147.946 17.6048 148.448 17.5858 148.934 17.6573C150.992 17.9578 152.743 18.8773 154.211 20.3344
          C155.049 21.1639 155.683 22.1554 156.336 23.124C157.03 24.1525 157.777 25.1325 158.729 25.9361
          C159.065 26.2176 159.333 26.4316 159.589 26.5896C158.816 26.6761 157.525 26.6946 156.642 25.9961V25.9951Z
          M157.608 19.7814C157.608 19.6164 157.74 19.4849 157.906 19.4849
          C157.943 19.4849 157.977 19.4924 158.008 19.5034C158.049 19.5184 158.087 19.5409 158.117 19.5749
          C158.17 19.6274 158.2 19.7024 158.2 19.7814C158.2 19.9464 158.068 20.0779 157.902 20.0779
          C157.736 20.0779 157.608 19.9464 157.608 19.7814ZM160.608 21.3204
          C160.416 21.3994 160.223 21.4669 160.038 21.4744C159.751 21.4894 159.438 21.3729 159.268 21.2304
          C159.004 21.0089 158.815 20.8849 158.736 20.4984C158.702 20.3334 158.721 20.0779 158.751 19.9314
          C158.819 19.6159 158.744 19.4134 158.521 19.2294C158.34 19.0793 158.11 19.0378 157.857 19.0378
          C157.762 19.0378 157.676 18.9963 157.611 18.9628C157.506 18.9103 157.419 18.7788 157.502 18.6173
          C157.528 18.5648 157.657 18.4373 157.687 18.4148C158.03 18.2193 158.426 18.2833 158.793 18.4298
          C159.132 18.5688 159.389 18.8238 159.759 19.1844C160.136 19.6199 160.204 19.7399 160.419 20.0669
          C160.589 20.3224 160.744 20.5849 160.85 20.8854C160.914 21.0729 160.831 21.2264 160.608 21.3204Z
        ` }),
      ),
      h('span', null, children),
    );
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
      role: onSelectElement ? 'group' : 'img',
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
          className: onSelectElement ? 'zm-chart-control' : undefined,
          role: onSelectElement ? 'button' : undefined,
          tabIndex: onSelectElement ? 0 : undefined,
          'aria-label': meta.label,
          'aria-pressed': onSelectElement ? isSel : undefined,
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
          onSelectElement ? h('circle', { className: 'zm-chart-focus-ring', cx: p.x, cy: p.y, r: 19.5, 'aria-hidden': true }) : null,
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
    DeepSeekButton,
    LuopanEmblem,
    GuideArtworkSvg,
    WuXingPentagonSvg,
    HexagramLinesSvg,
    ScoreRingSvg,
    ZiweiTriAspectSvg,
  };
}

function createQimenView(React, Visuals) {
  const h = React.createElement;
  const { CelestialBackdropSvg, QimenArmillarySvg } = Visuals;

  return function QimenView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('compass'); // 'compass' | 'grid'
    const [radarKey, setRadarKey] = React.useState('all');
    const [date, setDate] = React.useState(todayStr);
    const [time, setTime] = React.useState(timeStr);
    const [question, setQuestion] = React.useState('');
    const [selectedPalaceNum, setSelectedPalaceNum] = React.useState(null);

    React.useEffect(() => {
      if (chart) {
        setFormOpen(false);
        setRadarKey('all');
        const zf = chart.palaces?.find(p => p.isZhiFu);
        setSelectedPalaceNum(zf ? zf.num : 9);
      } else {
        setFormOpen(true);
      }
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      onCast({ system: 'qimen', date, time, question });
    };

    const castNow = () => {
      const d = new Date();
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const ts = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      setDate(ds);
      setTime(ts);
      onCast({ system: 'qimen', date: ds, time: ts, question });
    };

    const selectedPalace = chart?.palaces?.find(p => p.num === selectedPalaceNum) || chart?.palaces?.[0];
    const activeRadar = chart?.yongshenGuides?.[radarKey] || null;
    const radarHitSet = new Set(activeRadar?.palaceNums || []);

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      // 1. MONUMENTAL 360° QIMEN ARMILLARY SPHERE CANVAS
      h('div', { className: 'zm-canvas' },
        h(CelestialBackdropSvg, { isDark }),
        h('div', { className: 'zm-canvas-bar' },
          h('div', { className: 'zm-stage-tabs', role: 'tablist' },
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': stageMode === 'compass',
              className: `zm-stage-tab ${stageMode === 'compass' ? 'zm-on' : ''}`,
              onClick: () => setStageMode('compass'),
            }, '360° 浑天仪'),
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': stageMode === 'grid',
              className: `zm-stage-tab ${stageMode === 'grid' ? 'zm-on' : ''}`,
              onClick: () => setStageMode('grid'),
            }, '洛书九宫'),
          ),
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: castNow }, t('action.castNow')),
            chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}，${chart.meta.juTitle}，四柱${chart.meta.fourPillars}${chart.question ? `，问：${chart.question}` : ''}），用新手白话为我分析整体走势、奇门格局、三吉门方位和行动建议。`),
            }, `✦ ${t('dock.ask')}`) : h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
              onClick: () => onDemo('qimen'),
            }, `✦ ${t('action.demo')}`),
          ),
        ),

        // Full-Scale Graphic Centerpiece
        stageMode === 'compass'
          ? h('div', { className: 'zm-canvas-artwork' },
            h(QimenArmillarySvg, {
              chart,
              isDark,
              selectedPalaceNum,
              radarHits: activeRadar?.palaceNums || [],
              onSelectPalace: setSelectedPalaceNum,
            }),
          )
          : (chart ? h('div', { className: 'zm-qimen-grid', style: { position: 'relative', zIndex: 2 } },
            ...chart.palaces.map(p => {
              const isSel = selectedPalaceNum === p.num;
              const isHit = radarHitSet.has(p.num);
              if (p.isCenter) {
                return h('button', {
                  key: p.num, type: 'button', 'aria-pressed': isSel,
                  className: `zm-qimen-cell zm-center ${isSel ? 'zm-selected' : ''}`,
                  onClick: () => setSelectedPalaceNum(p.num),
                },
                  h('span', { className: 'zm-muted', style: { fontSize: 10 } }, '中五宫'),
                  h('div', { style: { textAlign: 'center', fontSize: 22, fontWeight: 800, color: 'var(--zm-gold)' } }, p.earthStem),
                  h('span', { className: 'zm-muted', style: { fontSize: 10, textAlign: 'center' } }, chart.meta.juTitle),
                );
              }
              const isGoodGate = ['开门', '休门', '生门'].includes(p.gate);
              const isToughGate = ['死门', '惊门', '伤门'].includes(p.gate);
              return h('button', {
                key: p.num, type: 'button', 'aria-pressed': isSel,
                className: `zm-qimen-cell ${isSel ? 'zm-selected' : ''} ${isHit ? 'zm-radar-hit' : ''}`,
                onClick: () => setSelectedPalaceNum(p.num),
              },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10.5 } },
                  h('span', { style: { fontWeight: 700, color: p.isZhiFu ? 'var(--zm-gold)' : 'var(--zm-indigo)' } }, p.deity),
                  h('span', { style: { fontWeight: 800, color: 'var(--zm-gold)' } }, `${p.heavenStem}/${p.earthStem}`),
                ),
                h('div', { style: { textAlign: 'center', margin: '3px 0' } },
                  h('div', { style: { fontSize: 13.5, fontWeight: 800, color: isGoodGate ? 'var(--zm-green)' : isToughGate ? 'var(--zm-red)' : 'var(--zm-text)' } }, p.gate),
                  h('div', { className: 'zm-muted', style: { fontSize: 10 } }, p.star),
                ),
                h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10 } },
                  h('span', { className: 'zm-muted' }, p.direction),
                  h('span', { style: { color: p.isKong ? 'var(--zm-red)' : 'var(--zm-text-muted)', fontWeight: 700 } }, p.isKong ? '空' : p.auspiciousness),
                ),
              );
            }),
          ) : h('div', { className: 'zm-canvas-artwork' }, h(QimenArmillarySvg, { chart: null, isDark }))),

        // YongShen Radar Minimal Pill Switcher (inside canvas bottom)
        chart?.yongshenGuides ? h('div', { className: 'zm-canvas-footer' },
          h('div', { className: 'zm-stage-tabs', role: 'group', 'aria-label': '用神雷达' },
            ...Object.entries(chart.yongshenGuides).map(([key, g]) => h('button', {
              key, type: 'button',
              className: `zm-stage-tab ${radarKey === key ? 'zm-on' : ''}`,
              onClick: () => {
                setRadarKey(key);
                if (g.palaceNums?.[0]) setSelectedPalaceNum(g.palaceNums[0]);
              },
            }, g.label.slice(0, 2))),
          ),
        ) : null,
      ),

      beginnerMode && activeRadar ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, `用神雷达 · ${activeRadar.label}：`),
        activeRadar.tip,
      ) : null,

      // 2. Concise Clicked Palace Inspector
      chart && selectedPalace ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${selectedPalace.symbol} ${selectedPalace.name}（${selectedPalace.direction}）${selectedPalace.isCenter ? '' : ` · ${selectedPalace.gate} / ${selectedPalace.star} / ${selectedPalace.deity}`}`),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}），详细解读「${selectedPalace.name}（${selectedPalace.direction}）」的白话含义与行动建议。`),
          }, t('action.askFocus')),
        ),
        selectedPalace.isCenter
          ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedPalace.note)
          : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
            h('div', null, h('strong', null, `${selectedPalace.gate}：`), selectedPalace.gateInfo?.summary || ''),
            h('div', null, h('strong', null, `${selectedPalace.star} · ${selectedPalace.deity}：`), `${selectedPalace.starInfo?.summary || ''} ${selectedPalace.deityInfo?.summary || ''}`),
            selectedPalace.alerts?.length ? h('div', { style: { color: 'var(--zm-red)' } }, selectedPalace.alerts.map(a => `⚠ ${a.tag}：${a.desc}`).join(' ')) : null,
          ),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { onSubmit: submit },
          h('div', { className: 'zm-form-grid' },
            h('div', { className: 'zm-field' }, h('label', null, t('form.qimenDate')), h('input', { className: 'zm-input', type: 'date', value: date, onChange: e => setDate(e.target.value), required: true })),
            h('div', { className: 'zm-field' }, h('label', null, t('form.qimenTime')), h('input', { className: 'zm-input', type: 'time', value: time, onChange: e => setTime(e.target.value), required: true })),
            h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
              h('label', null, t('form.qimenQuestion')),
              h('input', { className: 'zm-input', placeholder: '所问之事（如：谈合作、出差方位）', value: question, onChange: e => setQuestion(e.target.value) }),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: castNow }, t('action.castNow')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Formations & Auspicious Gates Drawer
      chart ? h('details', { className: 'zm-details' },
        h('summary', null,
          h('span', null, `三吉门方位 · 奇门格局${chart.formations?.length ? ` (${chart.formations.length})` : ''}`),
          h('span', { className: 'zm-muted' }, '展开详览 ▾'),
        ),
        h('div', { className: 'zm-details-body' },
          chart.formations?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
            ...chart.formations.map((f, i) => h('div', { key: i, style: { fontSize: 12 } },
              h('strong', { style: { color: (f.nature === '大吉' || f.nature === '吉') ? 'var(--zm-green)' : 'var(--zm-red)' } }, `${f.name}（${f.nature}）：`),
              f.desc,
            )),
          ) : null,
          chart.goodDirections?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
            ...chart.goodDirections.map((gd, i) => h('div', { key: i, style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
              h('strong', { style: { color: gd.clean ? 'var(--zm-green)' : 'var(--zm-amber)' } }, `${gd.direction} · ${gd.gate}：`),
              gd.tip,
            )),
          ) : null,
        ),
      ) : null,
    );
  };
}

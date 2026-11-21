function createZiweiView(React, Visuals) {
  const h = React.createElement;
  const { BirthFields, DeepSeekButton, ChartCanvas, ZiweiStarWheelSvg, ZiweiTriAspectSvg } = Visuals;

  return function ZiweiView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, profileTools, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('wheel'); // 'wheel' | 'square'
    const [birth, setBirth] = React.useState(() => createBirthDraft({ date: '1998-03-12', time: '21:30', gender: 'female' }, '1998-2-14'));
    const [question, setQuestion] = React.useState('');
    const [selectedPalaceIdx, setSelectedPalaceIdx] = React.useState(0);
    const [activeYear, setActiveYear] = React.useState('natal');

    React.useEffect(() => {
      if (chart) {
        setFormOpen(false);
        setSelectedPalaceIdx(chart.meta?.soulPalaceIndex ?? 0);
        setActiveYear('natal');
      } else {
        setFormOpen(true);
      }
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      onCast({ system: 'ziwei', ...birthParams(birth), question });
    };

    const selectedPalace = chart?.palaces?.[selectedPalaceIdx] || chart?.palaces?.[0];
    const triSet = new Set(selectedPalace?.trineIndices || []);
    const oppositePalace = chart?.palaces?.find(p => p.index === selectedPalace?.oppositeIndex);
    const relatedPalaces = [
      oppositePalace && { label: '对宫', palace: oppositePalace },
      ...[...triSet].map(idx => ({ label: '三合', palace: chart?.palaces?.find(p => p.index === idx) })),
    ].filter(item => item?.palace);
    const yearlyObj = activeYear !== 'natal'
      ? (chart?.yearlyHoroscopes || []).find(y => y.year === activeYear) || null
      : null;

    const yearlyMutagenByStar = {};
    if (yearlyObj?.mutagens) {
      for (const m of yearlyObj.mutagens) yearlyMutagenByStar[m.star] = m.mutagen;
    }

    const palaceByPos = {};
    if (chart?.palaces) {
      for (const p of chart.palaces) palaceByPos[`${p.gridRow}-${p.gridCol}`] = p;
    }

    const renderSquareCells = () => {
      const cells = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (r === 1 && c === 1) {
            cells.push(h('div', { key: 'center', className: 'zm-zw-center' },
              h(ZiweiTriAspectSvg, { selectedPalace }),
              h('div', { className: 'zm-zw-center-scrim' },
                h('div', { style: { fontSize: 13, fontWeight: 800, color: 'var(--zm-gold)' } }, chart.meta.fiveElementsClass),
                h('div', { style: { fontSize: 11, fontWeight: 700 } }, `${chart.meta.gender}命 · ${chart.meta.zodiac}`),
                yearlyObj
                  ? h('div', { style: { fontSize: 10, fontWeight: 700, color: '#38bdf8' } }, `${yearlyObj.year}流命:${yearlyObj.palaceName}`)
                  : h('div', { className: 'zm-muted', style: { fontSize: 10 } }, `命主 ${chart.meta.soulStar}`),
              ),
            ));
            continue;
          }
          if ((r === 1 && c === 2) || (r === 2 && c === 1) || (r === 2 && c === 2)) continue;
          const p = palaceByPos[`${r}-${c}`];
          if (!p) continue;
          const isSelf = p.index === selectedPalaceIdx;
          const isOpposite = !isSelf && p.index === selectedPalace?.oppositeIndex;
          const isTrine = !isSelf && triSet.has(p.index);
          const isYearlyLife = yearlyObj && yearlyObj.palaceIndex === p.index;

          cells.push(h('button', {
            key: p.index, type: 'button', 'aria-pressed': isSelf,
            className: `zm-zw-cell ${isSelf ? 'zm-zw-self' : isOpposite ? 'zm-zw-opposite' : isTrine ? 'zm-zw-trine' : ''} ${isYearlyLife ? 'zm-zw-yearly' : ''}`,
            onClick: () => setSelectedPalaceIdx(p.index),
          },
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 1.5 } },
              p.majorStars.length === 0
                ? h('span', { className: 'zm-muted', style: { fontSize: 10 } }, '空宫')
                : p.majorStars.map((s, si) => {
                  const mut = s.mutagen ? MUTAGEN_COLOR[s.mutagen] : null;
                  const yMut = yearlyMutagenByStar[s.name];
                  return h('div', { key: si, style: { display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', lineHeight: 1.2 } },
                    h('span', { style: { fontSize: 11, fontWeight: 800, color: 'var(--zm-purple)' } }, s.name),
                    mut ? h('span', { style: { fontSize: 8.5, fontWeight: 800, padding: '0 3px', borderRadius: 3, background: mut.bg, color: mut.fg } }, s.mutagen) : null,
                    yMut ? h('span', { style: { fontSize: 8, fontWeight: 800, padding: '0 3px', borderRadius: 3, background: 'rgba(56,189,248,0.2)', color: '#0284c7' } }, `流${yMut}`) : null,
                  );
                }),
            ),
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 } },
              h('span', { className: 'zm-muted', style: { fontSize: 9.5 } }, p.stemBranch),
              h('span', { style: { fontSize: 10.5, fontWeight: 800, color: p.isSoulPalace ? 'var(--zm-gold)' : isYearlyLife ? '#38bdf8' : 'var(--zm-text)' } },
                `${isYearlyLife ? '流命·' : ''}${p.name}`,
              ),
            ),
          ));
        }
      }
      return cells;
    };

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      h(ChartCanvas, {
        isDark,
        tabs: h('div', { className: 'zm-stage-tabs', role: 'tablist' },
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'wheel',
            className: `zm-stage-tab ${stageMode === 'wheel' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('wheel'),
          }, '星图轮盘'),
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'square',
            className: `zm-stage-tab ${stageMode === 'square' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('square'),
          }, '传统方盘'),
        ),
        actions: h('div', { className: 'zm-button-group' },
          chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
          chart ? h(DeepSeekButton, {
            primary: true,
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的紫微斗数命盘（盘面ID: ${chart.id}，${chart.title}，${chart.meta.fiveElementsClass}${yearlyObj ? `，重点叠加 ${yearlyObj.year} ${yearlyObj.stemBranch}流年` : ''}），用新手白话为我深度解读命宫、身宫、官禄宫、财帛宫、星曜组合与四化布局。`),
          }, t('action.askDeepSeek')) : h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
            onClick: () => onDemo('ziwei'),
          }, `✦ ${t('action.demo')}`),
        ),
        controls: chart?.yearlyHoroscopes?.length ? h('div', { className: 'zm-stage-tabs', role: 'tablist', 'aria-label': '本命和流年' },
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': activeYear === 'natal',
            className: `zm-stage-tab ${activeYear === 'natal' ? 'zm-on' : ''}`,
            onClick: () => setActiveYear('natal'),
          }, '本命'),
          ...chart.yearlyHoroscopes.map(yh => h('button', {
            key: yh.year, type: 'button', role: 'tab', 'aria-selected': activeYear === yh.year,
            className: `zm-stage-tab ${activeYear === yh.year ? 'zm-on' : ''}`,
            onClick: () => { setActiveYear(yh.year); setSelectedPalaceIdx(yh.palaceIndex); },
          }, `${yh.year}流年`)),
        ) : null,
      },
        stageMode === 'wheel' || !chart
          ? h(ZiweiStarWheelSvg, {
            chart,
            isDark,
            selectedPalaceIdx,
            yearlyObj,
            onSelectPalace: setSelectedPalaceIdx,
          })
          : h('div', { className: 'zm-ziwei-scroll' },
            h('div', { className: 'zm-ziwei-grid' }, ...renderSquareCells()),
          ),
      ),

      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        '点选一宫后，可沿金色虚线找对宫、沿紫色三角找两个三合宫。三方四正包含本宫与这三个宫位。',
      ) : null,

      // 2. Concise Selected Palace Inspector
      chart && selectedPalace ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `本命${selectedPalace.name} · ${selectedPalace.stemBranch}`),
          h(DeepSeekButton, {
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取紫微斗数命盘（盘面ID: ${chart.id}），结合三方四正说明本命「${selectedPalace.name}」的星曜组合${yearlyObj ? `，同时说明${yearlyObj.year}流年命宫与流年四化叠加在本命盘的哪些宫位` : ''}。`),
          }, t('action.askDeepSeek')),
        ),
        selectedPalace.decadalRange?.length ? h('div', { className: 'zm-muted', style: { marginBottom: 6 } }, `大限 ${selectedPalace.decadalRange.join('–')} 岁`) : null,
        selectedPalace.majorStars.length
          ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
            ...selectedPalace.majorStars.map((s, i) => h('div', { key: i },
              h('strong', { style: { color: 'var(--zm-purple)' } }, `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}：`),
              s.glossary || '核心主星',
            )),
          )
          : h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `本宫无主星${oppositePalace ? `，可参看对宫${oppositePalace.name}的主星` : ''}。`),
        relatedPalaces.length ? h('div', { className: 'zm-reading-list' },
          h('div', { className: 'zm-muted' }, '三方四正 · 点击换宫'),
          h('div', { className: 'zm-button-group' },
            ...relatedPalaces.map(({ label, palace }) => h('button', {
              type: 'button', key: palace.index, className: 'zm-btn zm-btn-sm',
              style: { color: label === '对宫' ? 'var(--zm-gold)' : 'var(--zm-purple)' },
              onClick: () => setSelectedPalaceIdx(palace.index),
            }, `${label} ${palace.name} · ${palace.majorStars.map(s => s.name).join('、') || '无主星'}`)),
          ),
        ) : null,
        yearlyObj ? h('div', { className: 'zm-reading-list' },
          h('div', null, `${yearlyObj.year} 流年命宫 → 本命${yearlyObj.palaceName}`),
          yearlyObj.mutagens?.length ? h('div', { className: 'zm-button-group' },
            ...yearlyObj.mutagens.filter(m => m.palaceIndex >= 0).map(m => h('button', {
              type: 'button', key: m.mutagen, className: 'zm-btn zm-btn-sm',
              style: { color: 'var(--zm-blue)' },
              onClick: () => setSelectedPalaceIdx(m.palaceIndex),
            }, `流年${m.star}化${m.mutagen} · ${m.palace}`)),
          ) : null,
        ) : null,
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { className: 'zm-form', onSubmit: submit },
          h(BirthFields, { birth, onChange: setBirth, genderFirst: 'female', profileTools, t }),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', disabled: busy, onClick: () => onDemo('ziwei') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Patterns & Four Mutagens Drawer
      chart ? h('details', { key: chart.id, className: 'zm-details', open: true },
        h('summary', null,
          h('span', null, `星曜组合 (${chart.patterns?.length || 0}) · 生年四化`),
        ),
        h('div', { className: 'zm-details-body' },
          h('div', { className: 'zm-button-group' },
            ...(chart.mutagens || []).map((m, i) => {
              const mc = MUTAGEN_COLOR[m.mutagen] || MUTAGEN_COLOR['禄'];
              return h('button', {
                key: i, type: 'button', className: 'zm-chip',
                style: { cursor: 'pointer', background: mc.bg, color: mc.fg, borderColor: mc.border },
                onClick: () => setSelectedPalaceIdx(m.palaceIndex),
              }, `${m.star}化${m.mutagen}→${m.palace}`);
            }),
          ),
          ...(chart.patterns || []).map((pt, i) => h('div', { key: i, style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
            h('strong', { style: { color: 'var(--zm-purple)' } }, `${pt.name}（${pt.nature}）：`),
            pt.desc,
          )),
        ),
      ) : null,
    );
  };
}

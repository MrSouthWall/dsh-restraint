function createZiweiView(React, Visuals) {
  const h = React.createElement;
  const { CelestialBackdropSvg, ZiweiStarWheelSvg, ZiweiTriAspectSvg } = Visuals;

  return function ZiweiView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('wheel'); // 'wheel' | 'square'
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState('1998-03-12');
    const [lunarYear, setLunarYear] = React.useState('1998');
    const [lunarMonth, setLunarMonth] = React.useState('2');
    const [lunarDay, setLunarDay] = React.useState('14');
    const [isLeapMonth, setIsLeapMonth] = React.useState(false);
    const [time, setTime] = React.useState('21:30');
    const [gender, setGender] = React.useState('female');
    const [calendar, setCalendar] = React.useState('solar');
    const [longitude, setLongitude] = React.useState('');
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
      const params = { system: 'ziwei', name, time, gender, calendar, question };
      if (calendar === 'lunar') {
        params.year = Number(lunarYear) || 1998;
        params.month = Number(lunarMonth) || 1;
        params.day = Number(lunarDay) || 1;
        params.isLeapMonth = isLeapMonth;
      } else {
        params.date = date;
      }
      if (longitude !== '' && Number.isFinite(Number(longitude))) {
        params.longitude = Number(longitude);
      }
      onCast(params);
    };

    const selectedPalace = chart?.palaces?.[selectedPalaceIdx] || chart?.palaces?.[0];
    const triSet = new Set(selectedPalace ? [selectedPalace.oppositeIndex, ...(selectedPalace.trineIndices || [])] : []);
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
          const isTrine = !isSelf && triSet.has(p.index);
          const isYearlyLife = yearlyObj && yearlyObj.palaceIndex === p.index;

          cells.push(h('button', {
            key: p.index, type: 'button', 'aria-pressed': isSelf,
            className: `zm-zw-cell ${isSelf ? 'zm-zw-self' : isTrine ? 'zm-zw-trine' : ''} ${isYearlyLife ? 'zm-zw-yearly' : ''}`,
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
      // 1. MONUMENTAL ZIWEI STAR-CHART WHEEL / SQUARE GRID CANVAS
      h('div', { className: 'zm-canvas' },
        h(CelestialBackdropSvg, { isDark }),
        h('div', { className: 'zm-canvas-bar' },
          h('div', { className: 'zm-stage-tabs', role: 'tablist' },
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
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
            chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的紫微斗数命盘（盘面ID: ${chart.id}，${chart.title}，${chart.meta.fiveElementsClass}${yearlyObj ? `，重点叠加 ${yearlyObj.year} ${yearlyObj.stemBranch}流年` : ''}），用新手白话为我深度解读命宫、身宫、官禄宫、财帛宫、紫微格局与四化布局。`),
            }, `✦ ${t('dock.ask')}`) : h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
              onClick: () => onDemo('ziwei'),
            }, `✦ ${t('action.demo')}`),
          ),
        ),

        stageMode === 'wheel' || !chart
          ? h('div', { className: 'zm-canvas-artwork' },
            h(ZiweiStarWheelSvg, {
              chart,
              isDark,
              selectedPalaceIdx,
              yearlyObj,
              onSelectPalace: setSelectedPalaceIdx,
            }),
          )
          : h('div', { className: 'zm-ziwei-scroll', style: { position: 'relative', zIndex: 2 } },
            h('div', { className: 'zm-ziwei-grid' }, ...renderSquareCells()),
          ),

        // Minimal Yearly Horoscope Switcher Bar
        chart?.yearlyHoroscopes?.length ? h('div', { className: 'zm-canvas-footer' },
          h('div', { className: 'zm-stage-tabs', role: 'tablist' },
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
          ),
        ) : null,
      ),

      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        '点击星图任意一宫，中心会亮起金色对宫线与紫色三合三角（三方四正）；点底部流年按钮可查看流年命宫与青色流年四化星点。',
      ) : null,

      // 2. Concise Selected Palace Inspector
      chart && selectedPalace ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${selectedPalace.name}（${selectedPalace.stemBranch} · ${selectedPalace.decadalRange[0]}-${selectedPalace.decadalRange[1]}岁）`),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的紫微斗数命盘（盘面ID: ${chart.id}），结合三方四正重点帮我解读「${selectedPalace.name}」的星曜组合与现实指引。`),
          }, t('action.askFocus')),
        ),
        selectedPalace.majorStars.length
          ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
            ...selectedPalace.majorStars.map((s, i) => h('div', { key: i },
              h('strong', { style: { color: 'var(--zm-purple)' } }, `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}：`),
              s.glossary || '核心主星',
            )),
          )
          : h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `空宫借对宫「${chart.palaces[selectedPalace.oppositeIndex]?.name}」主星参看，弹性与适应力极强。`),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { onSubmit: submit },
          h('div', { className: 'zm-form-grid' },
            h('div', { className: 'zm-field' },
              h('label', null, t('form.calendar')),
              h('select', { className: 'zm-select', value: calendar, onChange: e => setCalendar(e.target.value) },
                h('option', { value: 'solar' }, t('form.solar')),
                h('option', { value: 'lunar' }, t('form.lunar')),
              ),
            ),
            h('div', { className: 'zm-field' },
              h('label', null, t('form.gender')),
              h('select', { className: 'zm-select', value: gender, onChange: e => setGender(e.target.value) },
                h('option', { value: 'female' }, t('form.female')),
                h('option', { value: 'male' }, t('form.male')),
              ),
            ),
            calendar === 'solar' ? h('div', { className: 'zm-field' },
              h('label', null, t('form.birthDate')),
              h('input', { className: 'zm-input', type: 'date', value: date, onChange: e => setDate(e.target.value), required: true }),
            ) : h('div', { className: 'zm-lunar-row' },
              h('div', { className: 'zm-field' }, h('label', null, t('form.lunarYear')), h('input', { className: 'zm-input', type: 'number', min: 1901, max: 2099, value: lunarYear, onChange: e => setLunarYear(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, t('form.lunarMonth')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 12, value: lunarMonth, onChange: e => setLunarMonth(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, t('form.lunarDay')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 30, value: lunarDay, onChange: e => setLunarDay(e.target.value), required: true })),
              h('label', { className: 'zm-check-label' }, h('input', { type: 'checkbox', checked: isLeapMonth, onChange: e => setIsLeapMonth(e.target.checked) }), t('form.leapMonth')),
            ),
            h('div', { className: 'zm-field' },
              h('label', null, t('form.birthTime')),
              h('input', { className: 'zm-input', type: 'time', value: time, onChange: e => setTime(e.target.value), required: true }),
            ),
            h('div', { className: 'zm-field' },
              h('label', null, t('form.name')),
              h('input', { className: 'zm-input', placeholder: '称呼（可选）', value: name, onChange: e => setName(e.target.value) }),
            ),
            h('div', { className: 'zm-field' },
              h('label', null, t('form.advancedTst')),
              h('select', { className: 'zm-select', value: longitude, onChange: e => setLongitude(e.target.value) },
                ...CITY_LONGITUDES.map(c => h('option', { key: c.value || 'off', value: c.value }, c.value === '' ? t('form.longitudeOff') : c.label)),
              ),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('ziwei') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Patterns & Four Mutagens Drawer
      chart ? h('details', { className: 'zm-details' },
        h('summary', null,
          h('span', null, `紫微经典格局识别 (${chart.patterns?.length || 0}) · 生年四化`),
          h('span', { className: 'zm-muted' }, '展开详览 ▾'),
        ),
        h('div', { className: 'zm-details-body' },
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
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

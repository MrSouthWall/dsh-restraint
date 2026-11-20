function createHepanView(React, Visuals) {
  const h = React.createElement;
  const { CelestialBackdropSvg, HepanOrrerySvg, HepanTimeline30ySvg, RadarChartSvg } = Visuals;

  return function HepanView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('orrery'); // 'orrery' | 'radar' | 'wave'
    const [relation, setRelation] = React.useState('love');
    const [nameA, setNameA] = React.useState('甲方');
    const [calA, setCalA] = React.useState('solar');
    const [dateA, setDateA] = React.useState('1995-05-18');
    const [timeA, setTimeA] = React.useState('08:30');
    const [genderA, setGenderA] = React.useState('male');
    const [nameB, setNameB] = React.useState('乙方');
    const [calB, setCalB] = React.useState('solar');
    const [dateB, setDateB] = React.useState('1998-03-12');
    const [timeB, setTimeB] = React.useState('21:30');
    const [genderB, setGenderB] = React.useState('female');
    const [question, setQuestion] = React.useState('');

    React.useEffect(() => {
      if (chart) setFormOpen(false);
      else setFormOpen(true);
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      onCast({
        system: 'hepan',
        relation,
        question,
        personA: { name: nameA || '甲方', date: dateA, time: timeA, gender: genderA, calendar: calA },
        personB: { name: nameB || '乙方', date: dateB, time: timeB, gender: genderB, calendar: calB },
      });
    };

    const scoreTone = s => (s >= 80 ? 'var(--zm-green)' : s >= 65 ? 'var(--zm-gold)' : 'var(--zm-red)');

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      // 1. MONUMENTAL BINARY-STAR GRAVITATIONAL ORRERY CANVAS
      h('div', { className: 'zm-canvas' },
        h(CelestialBackdropSvg, { isDark }),
        h('div', { className: 'zm-canvas-bar' },
          h('div', { className: 'zm-stage-tabs', role: 'tablist' },
            h('button', {
              type: 'button', role: 'tab', 'aria-selected': stageMode === 'orrery',
              className: `zm-stage-tab ${stageMode === 'orrery' ? 'zm-on' : ''}`,
              onClick: () => setStageMode('orrery'),
            }, '双星引力'),
            chart ? h('button', {
              type: 'button', role: 'tab', 'aria-selected': stageMode === 'radar',
              className: `zm-stage-tab ${stageMode === 'radar' ? 'zm-on' : ''}`,
              onClick: () => setStageMode('radar'),
            }, '六维星芒') : null,
            chart?.timeline30y?.length ? h('button', {
              type: 'button', role: 'tab', 'aria-selected': stageMode === 'wave',
              className: `zm-stage-tab ${stageMode === 'wave' ? 'zm-on' : ''}`,
              onClick: () => setStageMode('wave'),
            }, '30年共振波') : null,
          ),
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
            chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '合盘') : null,
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的双人合盘数据（盘面ID: ${chart.id}，${chart.title}，综合${chart.overallScore}分·${chart.grade}），用温暖且务实的白话为我们分析六维优势、30年大运同步节奏、潜在磨合点和相处/家居调和建议。`),
            }, `✦ ${t('dock.ask')}`) : h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
              onClick: () => onDemo('hepan'),
            }, `✦ ${t('action.demo')}`),
          ),
        ),

        h('div', { className: 'zm-canvas-artwork' },
          stageMode === 'radar' && chart
            ? h(RadarChartSvg, { dimensions: chart.dimensions })
            : stageMode === 'wave' && chart?.timeline30y?.length
              ? h(HepanTimeline30ySvg, { timeline30y: chart.timeline30y, nameA: chart.personA.name, nameB: chart.personB.name, isDark })
              : h(HepanOrrerySvg, { chart, isDark }),
        ),

        chart ? h('div', { className: 'zm-canvas-footer' },
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-blue)' } }, `${chart.personA.name} · ${chart.personA.dayMaster} · 喜${chart.personA.favorable.join('')}`),
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-pink)' } }, `${chart.personB.name} · ${chart.personB.dayMaster} · 喜${chart.personB.favorable.join('')}`),
        ) : null,
      ),

      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        '左右两颗主星周围的 5 颗卫星大小代表各自五行能量，中央光环与六瓣星芒展示综合缘分分；可切换顶部看六维雷达与未来 30 年大运共振波。',
      ) : null,

      // 2. Concise Highlight Card
      chart ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${chart.title} · ${chart.overallScore}分`),
          h('span', { className: 'zm-chip', style: { color: 'var(--zm-pink)' } }, chart.grade),
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 } },
          chart.highlights[0] ? h('div', { style: { color: 'var(--zm-green)' } }, `✓ ${chart.highlights[0]}`) : null,
          chart.cautions[0] ? h('div', { style: { color: 'var(--zm-amber)' } }, `△ ${chart.cautions[0]}`) : null,
        ),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { onSubmit: submit },
          h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 } },
            ...[['love', '恋爱婚姻'], ['business', '事业合伙'], ['family', '挚友亲子']].map(([r, label]) =>
              h('button', {
                key: r, type: 'button', 'aria-pressed': relation === r,
                className: `zm-nav-pill ${relation === r ? 'zm-active' : ''}`,
                style: { '--zm-accent': 'var(--zm-pink)' },
                onClick: () => setRelation(r),
              }, label),
            ),
          ),
          h('div', { className: 'zm-two-col' },
            h('div', { style: { padding: 8, borderRadius: 9, border: '1px solid var(--zm-border)' } },
              h('div', { style: { fontWeight: 700, fontSize: 11.5, marginBottom: 6, color: 'var(--zm-blue)' } }, t('form.hepanPersonA')),
              h('div', { className: 'zm-form-grid' },
                h('div', { className: 'zm-field' }, h('label', null, t('form.name')), h('input', { className: 'zm-input', value: nameA, onChange: e => setNameA(e.target.value) })),
                h('div', { className: 'zm-field' }, h('label', null, t('form.gender')), h('select', { className: 'zm-select', value: genderA, onChange: e => setGenderA(e.target.value) }, h('option', { value: 'male' }, t('form.male')), h('option', { value: 'female' }, t('form.female')))),
                h('div', { className: 'zm-field' }, h('label', null, t('form.calendar')), h('select', { className: 'zm-select', value: calA, onChange: e => setCalA(e.target.value) }, h('option', { value: 'solar' }, t('form.solar')), h('option', { value: 'lunar' }, t('form.lunar')))),
                h('div', { className: 'zm-field' }, h('label', null, t('form.birthDate')), calA === 'solar'
                  ? h('input', { className: 'zm-input', type: 'date', value: dateA, onChange: e => setDateA(e.target.value), required: true })
                  : h('input', { className: 'zm-input', placeholder: 'YYYY-MM-DD', value: dateA, onChange: e => setDateA(e.target.value), required: true })),
                h('div', { className: 'zm-field' }, h('label', null, t('form.birthTime')), h('input', { className: 'zm-input', type: 'time', value: timeA, onChange: e => setTimeA(e.target.value), required: true })),
              ),
            ),
            h('div', { style: { padding: 8, borderRadius: 9, border: '1px solid var(--zm-border)' } },
              h('div', { style: { fontWeight: 700, fontSize: 11.5, marginBottom: 6, color: 'var(--zm-pink)' } }, t('form.hepanPersonB')),
              h('div', { className: 'zm-form-grid' },
                h('div', { className: 'zm-field' }, h('label', null, t('form.name')), h('input', { className: 'zm-input', value: nameB, onChange: e => setNameB(e.target.value) })),
                h('div', { className: 'zm-field' }, h('label', null, t('form.gender')), h('select', { className: 'zm-select', value: genderB, onChange: e => setGenderB(e.target.value) }, h('option', { value: 'female' }, t('form.female')), h('option', { value: 'male' }, t('form.male')))),
                h('div', { className: 'zm-field' }, h('label', null, t('form.calendar')), h('select', { className: 'zm-select', value: calB, onChange: e => setCalB(e.target.value) }, h('option', { value: 'solar' }, t('form.solar')), h('option', { value: 'lunar' }, t('form.lunar')))),
                h('div', { className: 'zm-field' }, h('label', null, t('form.birthDate')), calB === 'solar'
                  ? h('input', { className: 'zm-input', type: 'date', value: dateB, onChange: e => setDateB(e.target.value), required: true })
                  : h('input', { className: 'zm-input', placeholder: 'YYYY-MM-DD', value: dateB, onChange: e => setDateB(e.target.value), required: true })),
                h('div', { className: 'zm-field' }, h('label', null, t('form.birthTime')), h('input', { className: 'zm-input', type: 'time', value: timeB, onChange: e => setTimeB(e.target.value), required: true })),
              ),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('hepan') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHepan')),
          ),
        ),
      ) : null,

      // 4. Collapsible Detailed Breakdown & Five-Element Synergy Matrix
      chart ? h('details', { className: 'zm-details' },
        h('summary', null,
          h('span', null, '双方五行互补对比 · 六大维度拆解 · 调和建议'),
          h('span', { className: 'zm-muted' }, '展开详览 ▾'),
        ),
        h('div', { className: 'zm-details-body' },
          chart.elementSynergy?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
            ...chart.elementSynergy.map(row => h('div', { key: row.element, style: { fontSize: 11.5 } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 3 } },
                h('span', { style: { color: 'var(--zm-blue)', fontWeight: 600 } }, `${chart.personA.name} ${row.pctA}%${row.aNeeds ? '★' : ''}`),
                h('strong', { style: { color: WUXING_STYLE[row.element].color } }, row.element),
                h('span', { style: { color: 'var(--zm-pink)', fontWeight: 600 } }, `${row.bNeeds ? '★' : ''}${row.pctB}% ${chart.personB.name}`),
              ),
              h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 } },
                h('div', { className: 'zm-bar-track', style: { display: 'flex', justifyContent: 'flex-end' } }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.min(100, row.pctA * 2)}%`, background: 'var(--zm-blue)' } })),
                h('div', { className: 'zm-bar-track' }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.min(100, row.pctB * 2)}%`, background: 'var(--zm-pink)' } })),
              ),
            )),
          ) : null,
          h('div', { className: 'zm-sep' }),
          ...chart.dimensions.map(d => h('div', { key: d.key },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 } },
              h('strong', null, d.label),
              h('span', { style: { fontWeight: 700, color: scoreTone(d.score) } }, `${d.score} 分`),
            ),
            h('div', { className: 'zm-bar-track', style: { marginBottom: 2 } }, h('div', { className: 'zm-bar-fill', style: { width: `${d.score}%`, background: scoreTone(d.score) } })),
            h('div', { className: 'zm-muted' }, d.summary),
          )),
          ...chart.advice.map((x, i) => h('div', { key: `adv-${i}`, style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `✦ ${x}`)),
        ),
      ) : null,
    );
  };
}

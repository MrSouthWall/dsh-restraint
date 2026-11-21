function createHepanView(React, Visuals) {
  const h = React.createElement;
  const { BirthFields, DeepSeekButton, ChartCanvas, HepanTimeline30ySvg } = Visuals;

  return function HepanView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, profileTools, t }) {
    const personId = React.useId();
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('compare');
    const [relation, setRelation] = React.useState('love');
    const [personA, setPersonA] = React.useState(() => createBirthDraft({ name: '甲方', date: '1995-05-18', time: '08:30' }, '1995-05-18'));
    const [personB, setPersonB] = React.useState(() => createBirthDraft({ name: '乙方', date: '1998-03-12', time: '21:30', gender: 'female' }, '1998-03-12'));
    const [question, setQuestion] = React.useState('');
    const dayPillar = chart?.dimensions.find(d => d.key === 'dayPillar');
    const showTimeline = stageMode === 'wave' && chart?.timeline30y?.from;

    React.useEffect(() => {
      setFormOpen(!chart);
      setStageMode('compare');
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      onCast({
        system: 'hepan',
        relation,
        question,
        personA: { ...birthParams(personA), name: personA.name || '甲方' },
        personB: { ...birthParams(personB), name: personB.name || '乙方' },
      });
    };

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      h(ChartCanvas, {
        isDark,
        tabs: h('div', { className: 'zm-stage-tabs', role: 'tablist' },
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'compare',
            className: `zm-stage-tab ${stageMode === 'compare' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('compare'),
          }, '五行对照'),
          chart?.timeline30y?.from ? h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'wave',
            className: `zm-stage-tab ${stageMode === 'wave' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('wave'),
          }, '30年大运') : null,
        ),
        actions: h('div', { className: 'zm-button-group' },
          chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '合盘') : null,
          chart ? h(DeepSeekButton, {
            primary: true,
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的双人合盘数据（盘面ID ${chart.id}）。请说明两盘的日柱、地支、十神和紫微宫位有哪些可核对的异同。`),
          }, t('action.askDeepSeek')) : h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
            onClick: () => onDemo('hepan'),
          }, `✦ ${t('action.demo')}`),
        ),
        readout: chart ? h(React.Fragment, null,
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-blue)' } }, `${chart.personA.name} · 日主${chart.personA.dayMaster}`),
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-pink)' } }, `${chart.personB.name} · 日主${chart.personB.dayMaster}`),
        ) : null,
      },
        showTimeline
          ? h(HepanTimeline30ySvg, { timeline30y: chart.timeline30y, nameA: chart.personA.name, nameB: chart.personB.name, isDark })
          : chart?.elementSynergy?.length ? h('table', { className: 'zm-compare-table' },
            h('caption', null, '明干支五行占比 · 每人八字各计八个'),
            h('thead', null,
              h('tr', null,
                h('th', { scope: 'col' }, '五行'),
                h('th', { scope: 'col', style: { color: 'var(--zm-blue)' } }, chart.personA.name),
                h('th', { scope: 'col', style: { color: 'var(--zm-pink)' } }, chart.personB.name),
              ),
            ),
            h('tbody', null,
              ...chart.elementSynergy.map(row => h('tr', { key: row.element },
                h('th', { scope: 'row', style: { color: WUXING_STYLE[row.element]?.color } }, row.element),
                ...[['A', row.pctA, 'blue'], ['B', row.pctB, 'pink']].map(([side, pct, color]) => h('td', { key: side },
                  h('span', null, `${pct}%`),
                  h('div', { className: 'zm-bar-track', 'aria-hidden': true },
                    h('div', { className: 'zm-bar-fill', style: { width: `${pct}%`, background: `var(--zm-${color})` } }),
                  ),
                )),
              )),
            ),
          ) : null,
      ),

      beginnerMode && chart ? h('div', { className: 'zm-tip-banner' },
        stageMode === 'wave' ? '同一时间轴可对照两人何时交运，空段表示该时段没有已排出的大运。'
          : '先对照双方日柱与五行分布，再展开核对地支配对、日干十神和紫微宫位。',
      ) : null,

      showTimeline ? h('div', { className: 'zm-card zm-two-col' },
        ...['personA', 'personB'].map(key => h('div', { key, className: 'zm-reading-list' },
          h('strong', null, chart[key].name),
          ...chart.timeline30y[key].map(period => h('div', { key: period.startDate },
            h('strong', null, period.ganZhi),
            h('div', { className: 'zm-muted' }, `${period.startDate}起 · ${period.endExclusive}交下一运`),
          )),
          chart.timeline30y[key].length === 0 ? h('div', { className: 'zm-muted' }, '此区间无已排大运。') : null,
        )),
      ) : null,

      // 2. Concise Highlight Card
      chart ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, chart.title),
        ),
        dayPillar ? h('div', { className: 'zm-muted' }, dayPillar.summary) : null,
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { className: 'zm-form', onSubmit: submit },
          h('div', { className: 'zm-button-group', style: { marginBottom: 8 } },
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
            h('div', { className: 'zm-person-form', role: 'group', 'aria-labelledby': `${personId}-a` },
              h('div', { id: `${personId}-a`, className: 'zm-person-heading', style: { color: 'var(--zm-blue)' } }, t('form.hepanPersonA')),
              h(BirthFields, { birth: personA, onChange: setPersonA, profileTools, t }),
            ),
            h('div', { className: 'zm-person-form', role: 'group', 'aria-labelledby': `${personId}-b` },
              h('div', { id: `${personId}-b`, className: 'zm-person-heading', style: { color: 'var(--zm-pink)' } }, t('form.hepanPersonB')),
              h(BirthFields, { birth: personB, onChange: setPersonB, genderFirst: 'female', profileTools, t }),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', disabled: busy, onClick: () => onDemo('hepan') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHepan')),
          ),
        ),
      ) : null,

      // 4. Detailed palace and stem/branch comparisons
      chart ? h('details', { key: chart.id, className: 'zm-details', open: true },
        h('summary', null,
          h('span', null, '地支、十神与紫微宫位'),
        ),
        h('div', { className: 'zm-details-body' },
          ...chart.dimensions.filter(d => d.key !== 'wuxing' && d.key !== 'dayPillar').map(d => h('div', { key: d.key },
            h('strong', null, d.label),
            d.key === 'branches' && chart.branchInteractions ? h(React.Fragment, null,
              h('div', { className: 'zm-muted' }, '逐一比对双方各四柱的地支，共十六组跨盘配对。'),
              h('div', { className: 'zm-reading-list' }, ...renderBranchPairDetails(h, chart.branchInteractions)),
            ) : h('div', { className: 'zm-muted' }, d.summary),
          )),
        ),
      ) : null,
    );
  };
}

function createMeihuaView(React, Visuals) {
  const h = React.createElement;
  const { DeepSeekButton, ChartCanvas, MeihuaResonatorSvg, HexagramLinesSvg, getMeihuaStageContext } = Visuals;

  return function MeihuaView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [method, setMethod] = React.useState('numbers');
    const [num1, setNum1] = React.useState('3');
    const [num2, setNum2] = React.useState('7');
    const [num3, setNum3] = React.useState('');
    const [textSeed, setTextSeed] = React.useState('');
    const [question, setQuestion] = React.useState('');
    const [activeStage, setActiveStage] = React.useState('main');

    React.useEffect(() => {
      if (chart) {
        setFormOpen(false);
        setActiveStage('main');
      } else {
        setFormOpen(true);
      }
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      const params = { system: 'meihua', method, question };
      if (method === 'numbers') {
        params.num1 = Number(num1);
        params.num2 = Number(num2);
        if (num3.trim() !== '') params.num3 = Number(num3);
      } else if (method === 'text') {
        params.text = textSeed;
      }
      onCast(params);
    };

    const activeHex = chart?.hexagrams?.[activeStage] || chart?.hexagrams?.main;
    const stageShort = [['main', '本卦'], ['mutual', '互卦'], ['changed', '变卦'], ['opposite', '错卦'], ['inverted', '综卦']];
    const stageName = stageShort.find(([key]) => key === activeStage)?.[1];
    const stageContext = getMeihuaStageContext(chart, activeStage);
    const stageNote = {
      main: chart?.meta?.movingLineLabel && `${chart.meta.movingLineLabel}动。动爻所在的三爻卦为用。`,
      changed: chart?.meta?.movingLineLabel && `本卦的${chart.meta.movingLineLabel}阴阳互换，用卦随之改变。`,
      mutual: chart?.meta?.mutualFromChanged ? '本卦为乾或坤，依本盘取法从变卦中间四爻取互。' : '以本卦二至四爻为下互，三至五爻为上互。',
      opposite: '本卦六爻逐一反转阴阳。',
      inverted: '本卦六爻由上至下倒序。',
    }[activeStage];

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      h(ChartCanvas, {
        isDark,
        tabs: chart ? h('div', { className: 'zm-stage-tabs', role: 'tablist' },
          ...stageShort.map(([k, label]) => h('button', {
            key: k, type: 'button', role: 'tab', 'aria-selected': activeStage === k,
            className: `zm-stage-tab ${activeStage === k ? 'zm-on' : ''}`,
            onClick: () => setActiveStage(k),
          }, label)),
        ) : h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, '先天八卦星轮'),
        actions: h('div', { className: 'zm-button-group' },
          h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onCast({ system: 'meihua', method: 'random', question }) }, '灵感一卦'),
          chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '起卦') : null,
          chart ? h(DeepSeekButton, {
            primary: true,
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦象（盘面ID: ${chart.id}，本卦${chart.hexagrams.main.fullName}、互卦${chart.hexagrams.mutual.fullName}、变卦${chart.hexagrams.changed.fullName}，第${chart.meta.movingLine}爻动${chart.question ? `，问：${chart.question}` : ''}），请按《周易》卦辞和《梅花易数》的体用规则，用白话解释对应关系。`),
          }, t('action.askDeepSeek')) : h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
            onClick: () => onDemo('meihua'),
          }, `✦ ${t('action.demo')}`),
        ),
        readout: stageContext ? h(React.Fragment, null,
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, `体 ${stageContext.ti.name}（${stageContext.ti.element}）`),
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-purple)' } }, `${activeStage === 'changed' ? '变用' : '用'} ${stageContext.yong.name}（${stageContext.yong.element}）`),
          h('span', { className: 'zm-glass-pill' }, stageContext.relation?.relation),
        ) : null,
      }, h(MeihuaResonatorSvg, { chart, isDark, activeStage })),

      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        '先看本卦体用，随后对照互卦和变卦。六爻从最下面的初爻往上数，标记指出本卦发生变化的那一爻。',
      ) : null,

      // 2. Concise Active Hexagram Inspector
      chart && activeHex ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${stageName} · ${activeHex.symbol} 第${activeHex.number}卦 ${activeHex.fullName}`),
          h(DeepSeekButton, {
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦局（盘面ID: ${chart.id}），说明${stageName}「${activeHex.fullName}」在本盘的作用及取卦依据。`),
          }, t('action.askDeepSeek')),
        ),
        h('div', { className: 'zm-reading-list' },
          stageNote ? h('div', null, stageNote) : null,
          stageContext?.relation?.desc ? h('div', null, stageContext.relation.desc) : null,
          activeStage === 'mutual' ? h('div', null, [
            chart.tiYong.mutualUpperRelation?.relation && `上互对本卦体 ${chart.tiYong.mutualUpperRelation.relation}`,
            chart.tiYong.mutualLowerRelation?.relation && `下互对本卦体 ${chart.tiYong.mutualLowerRelation.relation}`,
          ].filter(Boolean).join(' · ')) : null,
          h('div', { className: 'zm-muted' }, `大象 ${activeHex.image}`),
          h('div', { className: 'zm-muted' }, `卦辞 ${activeHex.judgment}`),
        ),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { className: 'zm-form', onSubmit: submit },
          h('div', { className: 'zm-button-group', style: { marginBottom: 8 } },
            ...[['numbers', '报数起卦'], ['time', '时间起卦'], ['text', '字数起卦'], ['random', '程序随机']].map(([m, label]) =>
              h('button', {
                key: m, type: 'button', 'aria-pressed': method === m,
                className: `zm-nav-pill ${method === m ? 'zm-active' : ''}`,
                style: { '--zm-accent': 'var(--zm-red)' },
                onClick: () => setMethod(m),
              }, label),
            ),
          ),
          h('div', { className: 'zm-form-grid' },
            method === 'numbers' ? h(React.Fragment, null,
              h('div', { className: 'zm-field' }, h('label', null, '第一数（上卦）'), h('input', { className: 'zm-input', type: 'number', min: 1, step: 1, value: num1, onChange: e => setNum1(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, '第二数（下卦）'), h('input', { className: 'zm-input', type: 'number', min: 1, step: 1, value: num2, onChange: e => setNum2(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, '第三数（可空）'), h('input', { className: 'zm-input', type: 'number', min: 1, step: 1, placeholder: '留空时以两数加时辰', value: num3, onChange: e => setNum3(e.target.value) })),
            ) : null,
            method === 'text' ? h('div', { className: 'zm-field' },
              h('label', null, '起卦文字'),
              h('input', { className: 'zm-input', placeholder: '至少两个字，例如 春风得意', value: textSeed, onChange: e => setTextSeed(e.target.value), required: true }),
            ) : null,
            h('div', { className: 'zm-field' },
              h('label', null, t('form.question')),
              h('input', { className: 'zm-input', placeholder: '所问之事（可选）', value: question, onChange: e => setQuestion(e.target.value) }),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', disabled: busy, onClick: () => onDemo('meihua') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHex')),
          ),
        ),
      ) : null,

      // 4. Hexagram and trigram details
      chart ? h('details', { key: chart.id, className: 'zm-details', open: true },
        h('summary', null,
          h('span', null, '本卦、互卦、变卦与体用类象'),
        ),
        h('div', { className: 'zm-details-body' },
          h('div', { className: 'zm-hex-stage' },
            ...[['main', '本卦', chart.meta.movingLine], ['mutual', '互卦', 0], ['changed', '变卦', chart.meta.movingLine]].map(([key, tag, mov]) => {
              const hx = chart.hexagrams[key];
              return h('button', {
                key, type: 'button',
                'aria-pressed': activeStage === key,
                className: `zm-hex-card ${activeStage === key ? 'zm-selected' : ''}`,
                onClick: () => setActiveStage(key),
              },
                h('span', { className: 'zm-muted' }, tag),
                h(HexagramLinesSvg, { lines: hx.lines, movingLine: mov, tiPosition: key === 'mutual' ? '' : chart.tiYong.tiPosition, compact: true }),
                h('strong', { style: { fontSize: 12 } }, hx.fullName),
              );
            }),
          ),
          chart.meta.seedDetail ? h('div', { className: 'zm-muted' }, `起卦依据 · ${chart.meta.seedDetail}`) : null,
          chart.meta.mutualFromChanged ? h('div', { className: 'zm-muted' }, '乾、坤本卦从变卦中间四爻取互卦。') : null,
          chart.imagery ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', display: 'flex', flexDirection: 'column', gap: 4 } },
            h('div', null, h('strong', { style: { color: 'var(--zm-gold)' } }, `本卦体 ${chart.imagery.ti.name} · `), `后天${chart.imagery.ti.direction} · ${chart.imagery.ti.color} · ${chart.imagery.ti.role}`),
            h('div', null, h('strong', { style: { color: 'var(--zm-purple)' } }, `本卦用 ${chart.imagery.yong.name} · `), `后天${chart.imagery.yong.direction} · ${chart.imagery.yong.color} · ${chart.imagery.yong.role}`),
          ) : null,
        ),
      ) : null,
    );
  };
}

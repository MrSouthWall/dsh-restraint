function createMeihuaView(React, Visuals) {
  const h = React.createElement;
  const { CelestialBackdropSvg, MeihuaResonatorSvg, HexagramLinesSvg } = Visuals;

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
        params.num1 = Number(num1) || 3;
        params.num2 = Number(num2) || 7;
        if (num3.trim() !== '') params.num3 = Number(num3);
      } else if (method === 'text') {
        params.text = textSeed || question || '知命';
      }
      onCast(params);
    };

    const activeHex = chart?.hexagrams?.[activeStage] || chart?.hexagrams?.main;
    const stageShort = [['main', '本卦'], ['mutual', '互卦'], ['changed', '变卦'], ['opposite', '错卦'], ['inverted', '综卦']];

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      // 1. MONUMENTAL XIANTIAN BAGUA & 6-YAO RESONATOR CANVAS
      h('div', { className: 'zm-canvas' },
        h(CelestialBackdropSvg, { isDark }),
        h('div', { className: 'zm-canvas-bar' },
          chart ? h('div', { className: 'zm-stage-tabs', role: 'tablist' },
            ...stageShort.map(([k, label]) => h('button', {
              key: k, type: 'button', role: 'tab', 'aria-selected': activeStage === k,
              className: `zm-stage-tab ${activeStage === k ? 'zm-on' : ''}`,
              onClick: () => setActiveStage(k),
            }, label)),
          ) : h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, '先天八卦星轮'),
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onCast({ system: 'meihua', method: 'random', question }) }, '灵感一卦'),
            chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '起卦') : null,
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦象（盘面ID: ${chart.id}，本卦${chart.hexagrams.main.fullName}、互卦${chart.hexagrams.mutual.fullName}、变卦${chart.hexagrams.changed.fullName}，第${chart.meta.movingLine}爻动${chart.question ? `，问：${chart.question}` : ''}），结合体用生克、月令旺衰、应期和万物类象给我白话建议。`),
            }, `✦ ${t('dock.ask')}`) : h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
              onClick: () => onDemo('meihua'),
            }, `✦ ${t('action.demo')}`),
          ),
        ),

        h('div', { className: 'zm-canvas-artwork' },
          h(MeihuaResonatorSvg, { chart, isDark, activeStage }),
        ),

        chart ? h('div', { className: 'zm-canvas-footer' },
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, `体 ${chart.tiYong.tiTrigram.name}(${chart.tiYong.tiTrigram.element})`),
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-purple)' } }, `用 ${chart.tiYong.yongTrigram.name}(${chart.tiYong.yongTrigram.element})`),
          chart.timing ? h('span', { className: 'zm-glass-pill' }, `先天应数 ${chart.timing.responseNumber}`) : null,
        ) : null,
      ),

      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        '外圈金色双环为「体卦（自己）」，紫色环为「用卦（事情）」，流动光束表示生克方向（绿/金大吉、红需谨慎）；切换顶部本/互/变看起承转合。',
      ) : null,

      // 2. Concise Active Hexagram Inspector
      chart && activeHex ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${activeHex.symbol} 第${activeHex.number}卦 ${activeHex.fullName} · ${activeHex.luck}`),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦局（盘面ID: ${chart.id}），专门帮我解释「${activeHex.fullName}」的象意与现实启发。`),
          }, t('action.askFocus')),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 6 } }, activeHex.summary),
        h('div', { className: 'zm-muted' }, `卦辞：${activeHex.judgment}`),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { onSubmit: submit },
          h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 } },
            ...[['numbers', '报数起卦'], ['time', '时间起卦'], ['text', '文字起卦'], ['random', '随机触机']].map(([m, label]) =>
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
              h('div', { className: 'zm-field' }, h('label', null, '第一数（上卦）'), h('input', { className: 'zm-input', type: 'number', value: num1, onChange: e => setNum1(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, '第二数（下卦）'), h('input', { className: 'zm-input', type: 'number', value: num2, onChange: e => setNum2(e.target.value), required: true })),
              h('div', { className: 'zm-field' }, h('label', null, '第三数（可空）'), h('input', { className: 'zm-input', type: 'number', placeholder: '留空自动加时辰', value: num3, onChange: e => setNum3(e.target.value) })),
            ) : null,
            method === 'text' ? h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
              h('label', null, '灵感关键词'),
              h('input', { className: 'zm-input', placeholder: '如：春风得意 / 签约', value: textSeed, onChange: e => setTextSeed(e.target.value), required: true }),
            ) : null,
            h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
              h('label', null, t('form.question')),
              h('input', { className: 'zm-input', placeholder: '所问之事（可选）', value: question, onChange: e => setQuestion(e.target.value) }),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('meihua') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHex')),
          ),
        ),
      ) : null,

      // 4. Collapsible Timing, Imagery & 3-Stage Evolution Drawer
      chart ? h('details', { className: 'zm-details' },
        h('summary', null,
          h('span', null, '起承转合三卦 · 应期推算 · 体用万物类象速查'),
          h('span', { className: 'zm-muted' }, '展开详览 ▾'),
        ),
        h('div', { className: 'zm-details-body' },
          h('div', { className: 'zm-hex-stage' },
            ...[['main', '本卦', chart.meta.movingLine], ['mutual', '互卦', 0], ['changed', '变卦', chart.meta.movingLine]].map(([key, tag, mov]) => {
              const hx = chart.hexagrams[key];
              return h('button', {
                key, type: 'button',
                className: `zm-hex-card ${activeStage === key ? 'zm-selected' : ''}`,
                onClick: () => setActiveStage(key),
              },
                h('span', { className: 'zm-muted' }, tag),
                h(HexagramLinesSvg, { lines: hx.lines, movingLine: mov, tiPosition: key === 'mutual' ? '' : chart.tiYong.tiPosition, compact: true }),
                h('strong', { style: { fontSize: 12 } }, hx.fullName),
              );
            }),
          ),
          chart.timing ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, '应期参考：'),
            `${chart.timing.shortRange} · ${chart.timing.favorableMonths}。${chart.timing.desc}`,
          ) : null,
          chart.imagery ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', display: 'flex', flexDirection: 'column', gap: 4 } },
            h('div', null, h('strong', { style: { color: 'var(--zm-gold)' } }, `体卦 ${chart.imagery.ti.name}：`), `${chart.imagery.ti.direction} · ${chart.imagery.ti.color} · ${chart.imagery.ti.role}`),
            h('div', null, h('strong', { style: { color: 'var(--zm-purple)' } }, `用卦 ${chart.imagery.yong.name}：`), `${chart.imagery.yong.direction} · ${chart.imagery.yong.color} · ${chart.imagery.yong.role}`),
          ) : null,
        ),
      ) : null,
    );
  };
}

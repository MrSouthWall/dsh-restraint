function createQimenView(React, Visuals) {
  const h = React.createElement;
  const { DateField, TimeField, DeepSeekButton, ChartCanvas, QimenArmillarySvg } = Visuals;

  return function QimenView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const now = currentBeijingISO();
    const todayStr = now.slice(0, 10);
    const timeStr = now.slice(11, 16);

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
      const beijing = currentBeijingISO();
      setDate(beijing.slice(0, 10));
      setTime(beijing.slice(11, 16));
      onCast({ system: 'qimen', question });
    };

    const selectedPalace = chart?.palaces?.find(p => p.num === selectedPalaceNum) || chart?.palaces?.[0];
    const activeRadar = chart?.yongshenGuides?.[radarKey] || null;
    const radarHitSet = new Set(activeRadar?.palaceNums || []);
    const focusPalaces = chart?.palaces?.filter(p => p.isZhiFu || p.isZhiShi) || [];

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      h(ChartCanvas, {
        isDark,
        tabs: h('div', { className: 'zm-stage-tabs', role: 'tablist' },
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
        actions: h('div', { className: 'zm-button-group' },
          h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: castNow }, t('action.castNow')),
          chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
          chart ? h(DeepSeekButton, {
            primary: true,
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}，${chart.meta.juTitle}，四柱${chart.meta.fourPillars}${chart.question ? `，问：${chart.question}` : ''}），请从节气、符头、值符值使和八门入手解释排布，注明所用取法。`),
          }, t('action.askDeepSeek')) : h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
            onClick: () => onDemo('qimen'),
          }, `✦ ${t('action.demo')}`),
        ),
        controls: chart?.yongshenGuides ? h(React.Fragment, null,
          h('span', { className: 'zm-muted' }, '按主题找宫'),
          h('div', { className: 'zm-stage-tabs', role: 'group', 'aria-label': '按主题找宫' },
            ...Object.entries(chart.yongshenGuides).map(([key, g]) => h('button', {
              key, type: 'button',
              className: `zm-stage-tab ${radarKey === key ? 'zm-on' : ''}`,
              'aria-pressed': radarKey === key,
              onClick: () => {
                setRadarKey(key);
                if (g.palaceNums?.[0]) setSelectedPalaceNum(g.palaceNums[0]);
              },
            }, g.label.slice(0, 2))),
          ),
        ) : null,
        readout: chart ? h(React.Fragment, null,
          h('span', { className: 'zm-glass-pill' }, chart.meta.solarDate),
          h('span', { className: 'zm-glass-pill' }, `${chart.meta.solarTerm}${chart.meta.yuan} · ${chart.meta.juTitle}`),
          h('span', { className: 'zm-glass-pill' }, '上南 · 下北'),
        ) : h('span', { className: 'zm-glass-pill' }, '示意盘 · 上南 · 下北'),
      },
        stageMode === 'compass' || !chart
          ? h(QimenArmillarySvg, {
            chart,
            isDark,
            selectedPalaceNum,
            radarHits: activeRadar?.palaceNums || [],
            onSelectPalace: setSelectedPalaceNum,
          })
          : h('div', { className: 'zm-qimen-grid' },
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
                  h('span', { style: { color: p.isKong ? 'var(--zm-red)' : 'var(--zm-text-muted)', fontWeight: 700, textAlign: 'right' } },
                    [p.isZhiShi && '值使', p.isKong && '空', p.isYiMa && '马'].filter(Boolean).join(' · ') || p.auspiciousness,
                  ),
                ),
              );
            }),
          ),
      ),

      activeRadar ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title' }, h('span', null, `按主题找宫 · ${activeRadar.label}`)),
        h('div', { className: 'zm-button-group' },
          ...(chart.palaces || []).filter(p => radarHitSet.has(p.num)).map(p => h('button', {
            type: 'button', key: p.num, className: 'zm-btn zm-btn-sm',
            'aria-pressed': selectedPalace?.num === p.num,
            style: { color: 'var(--zm-blue)' },
            onClick: () => setSelectedPalaceNum(p.num),
          }, `${p.name} · ${p.direction}`)),
        ),
        beginnerMode ? h('div', { className: 'zm-muted', style: { marginTop: 6 } }, activeRadar.tip) : null,
      ) : null,

      // 2. Concise Clicked Palace Inspector
      chart && selectedPalace ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${selectedPalace.symbol} ${selectedPalace.name}（${selectedPalace.direction}）${selectedPalace.isCenter ? '' : ` · ${selectedPalace.gate} / ${selectedPalace.star} / ${selectedPalace.deity}`}`),
          h(DeepSeekButton, {
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}），详细解读「${selectedPalace.name}（${selectedPalace.direction}）」的白话含义与行动建议。`),
          }, t('action.askDeepSeek')),
        ),
        h('div', { className: 'zm-button-group', style: { marginBottom: 6 } },
          ...focusPalaces.map(p => h('button', {
            type: 'button', key: p.num, className: 'zm-btn zm-btn-sm',
            onClick: () => setSelectedPalaceNum(p.num),
            'aria-pressed': p.num === selectedPalace.num,
          }, [p.isZhiFu && `值符 ${chart.meta.zhiFuStar}`, p.isZhiShi && `值使 ${chart.meta.zhiShiGate}`, p.name].filter(Boolean).join(' · '))),
        ),
        selectedPalace.isCenter
          ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedPalace.note)
          : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
            h('div', { className: 'zm-muted' }, [
              `天盘 ${selectedPalace.heavenStem} · 地盘 ${selectedPalace.earthStem}`,
              selectedPalace.carriedStar && `寄 ${selectedPalace.carriedStar} ${selectedPalace.carriedStem || ''}`.trim(),
              selectedPalace.isKong && '空亡',
              selectedPalace.isYiMa && '驿马',
            ].filter(Boolean).join(' · ')),
            h('div', null, h('strong', null, `${selectedPalace.gate}：`), selectedPalace.gateInfo?.summary || ''),
            h('div', null, h('strong', null, `${selectedPalace.star} · ${selectedPalace.deity}：`), `${selectedPalace.starInfo?.summary || ''} ${selectedPalace.deityInfo?.summary || ''}`),
            selectedPalace.alerts?.length ? h('div', { style: { color: 'var(--zm-red)' } }, selectedPalace.alerts.map(a => `⚠ ${a.tag}：${a.desc}`).join(' ')) : null,
          ),
      ) : null,

      // 3. Input Form
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { className: 'zm-form', onSubmit: submit },
          h('div', { className: 'zm-form-grid' },
            h(DateField, { label: t('form.qimenDate'), value: date, onChange: setDate, t }),
            h(TimeField, { label: t('form.qimenTime'), value: time, onChange: setTime, t }),
            h('div', { className: 'zm-field' },
              h('label', null, t('form.qimenQuestion')),
              h('input', { className: 'zm-input', placeholder: '所问之事（如：谈合作、出差方位）', value: question, onChange: e => setQuestion(e.target.value) }),
            ),
          ),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', disabled: busy, onClick: castNow }, t('action.castNow')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Formations & Auspicious Gates Drawer
      chart ? h('details', { key: chart.id, className: 'zm-details', open: true },
        h('summary', null,
          h('span', null, `三吉门方位 · 奇门格局${chart.formations?.length ? ` (${chart.formations.length})` : ''}`),
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

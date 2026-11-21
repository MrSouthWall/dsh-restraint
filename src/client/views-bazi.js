function renderBranchPairDetails(h, matchesByType) {
  return ['六合', '六冲', '六害', '相刑'].map(type => {
    const pairs = matchesByType[type] || [];
    if (type === '相刑' && !pairs.length) return null;
    return h('div', { key: type },
      h('strong', null, type),
      h('span', { className: 'zm-muted' }, ` · ${pairs.length} 对`),
      BAZI_TERM_GLOSSARY[type] ? h('div', { className: 'zm-muted' }, BAZI_TERM_GLOSSARY[type]) : null,
      pairs.length ? h('div', null, pairs.join('；')) : null,
    );
  });
}

function createBaziView(React, Visuals) {
  const h = React.createElement;
  const { BirthFields, DeepSeekButton, ChartCanvas, BaziOrrerySvg, BaZhaiCompassSvg } = Visuals;

  return function BaziView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, profileTools, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('orrery'); // 'orrery' | 'compass'
    const [birth, setBirth] = React.useState(() => createBirthDraft({ date: '1995-05-18', time: '08:30' }, '1995-4-19'));
    const [question, setQuestion] = React.useState('');
    const [selectedPillarIdx, setSelectedPillarIdx] = React.useState(2);
    const [selectedDaYunIdx, setSelectedDaYunIdx] = React.useState(0);
    const [selectedWuXing, setSelectedWuXing] = React.useState(null);
    const [selectedDir, setSelectedDir] = React.useState(null);

    React.useEffect(() => {
      if (chart) {
        setFormOpen(false);
        setSelectedDir(chart.mingGua?.bestWealthDir || '东南');
      } else {
        setFormOpen(true);
      }
    }, [chart?.id]);

    const submit = e => {
      e.preventDefault();
      onCast({ system: 'bazi', ...birthParams(birth), question });
    };

    const selectedPillar = chart?.pillars?.[selectedPillarIdx] || chart?.pillars?.[2];
    const selectedDaYun = chart?.daYun?.[selectedDaYunIdx] || chart?.daYun?.[0];
    const selectedDirObj = chart?.mingGua?.directions?.find(d => d.direction === selectedDir) || chart?.mingGua?.directions?.[0];
    const selectedLinks = chart?.interactions?.filter(it => it.from === selectedPillarIdx || it.to === selectedPillarIdx) || [];
    const branchPairs = { 六合: [], 六冲: [], 六害: [], 相刑: [] };
    const otherInteractions = [];
    for (const it of chart?.interactions || []) {
      const pairs = branchPairs[it.type.slice(2)];
      if (it.layer === 'zhi' && pairs) {
        const a = chart.pillars[it.from];
        const b = chart.pillars[it.to];
        pairs.push(`${a.label}${a.zhi}与${b.label}${b.zhi}`);
      } else {
        otherInteractions.push(it);
      }
    }
    const fuyi = chart?.fuyi;
    const visibleElementCount = chart?.wuxing?.counts?.[selectedWuXing] ?? 0;
    const hiddenElementCount = chart?.wuxing?.hiddenCounts?.[selectedWuXing]
      ?? chart?.pillars?.flatMap(p => p.hiddenDetails || []).filter(p => p.element === selectedWuXing).length
      ?? 0;
    const selectPillar = idx => { setSelectedPillarIdx(idx); setSelectedWuXing(null); };

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      h(ChartCanvas, {
        isDark,
        tabs: h('div', { className: 'zm-stage-tabs', role: 'tablist' },
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'orrery',
            className: `zm-stage-tab ${stageMode === 'orrery' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('orrery'),
          }, '五行天象仪'),
          h('button', {
            type: 'button', role: 'tab', 'aria-selected': stageMode === 'compass',
            className: `zm-stage-tab ${stageMode === 'compass' ? 'zm-on' : ''}`,
            onClick: () => setStageMode('compass'),
          }, '八宅罗盘'),
        ),
        actions: h('div', { className: 'zm-button-group' },
          chart ? h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => setFormOpen(v => !v),
          }, formOpen ? '收起参数' : '修改参数') : null,
          chart ? h(DeepSeekButton, {
            primary: true,
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的四柱八字盘（盘面ID: ${chart.id}，${chart.title}，四柱：${chart.pillars.map(p => p.ganZhi).join(' ')}），请说明四柱、月令、大运及八宅命卦的取法，并注明解读所依据的传统规则。`),
          }, t('action.askDeepSeek')) : h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
            onClick: () => onDemo('bazi'),
          }, `✦ ${t('action.demo')}`),
        ),
        controls: chart && stageMode === 'orrery' ? h('div', { className: 'zm-stage-tabs', role: 'group', 'aria-label': '四柱' },
          ...chart.pillars.map((p, idx) => h('button', {
            type: 'button', key: p.key,
            className: `zm-stage-tab ${!selectedWuXing && selectedPillarIdx === idx ? 'zm-on' : ''}`,
            'aria-pressed': !selectedWuXing && selectedPillarIdx === idx,
            onClick: () => selectPillar(idx),
          }, `${p.label} ${p.ganZhi}`)),
        ) : stageMode === 'compass' ? h('span', { className: 'zm-glass-pill' }, '上南 · 下北') : null,
        readout: chart ? h(React.Fragment, null,
          chart.meta.apparentSolarDate ? h('span', { className: 'zm-glass-pill' }, `真太阳时 ${chart.meta.apparentSolarDate}`) : null,
          chart.pattern ? h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, chart.pattern.name) : null,
          chart.mingGua ? h('span', { className: 'zm-glass-pill' }, `${chart.mingGua.name}·${chart.mingGua.group}`) : null,
        ) : null,
      },
        stageMode === 'orrery'
          ? h(BaziOrrerySvg, {
            chart,
            isDark,
            selectedPillarIdx,
            selectedWuXing,
            onSelectPillar: chart ? selectPillar : undefined,
            onSelectWuXing: chart ? el => setSelectedWuXing(prev => (prev === el ? null : el)) : undefined,
          })
          : h(BaZhaiCompassSvg, {
            mingGua: chart?.mingGua,
            isDark,
            selectedDir,
            onSelectDir: chart ? setSelectedDir : undefined,
          }),
      ),

      // Compact Beginner Hint (only when toggled ON)
      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        stageMode === 'orrery'
          ? '先看中心日主，再点月柱查月令。外圈百分比按八个明干支计数，点五行可查看藏干。外侧五边形沿顺时针相生，内侧星形连线表示相克。'
          : '中央指针指向本命卦的生气方。点击方位可查对应游年星。',
      ) : null,

      // 2. Interactive Focus Inspector (Single concise card for whatever node user clicked)
      chart && stageMode === 'compass' && selectedDirObj ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
          h('span', { style: { color: selectedDirObj.luck === '吉' ? 'var(--zm-green)' : 'var(--zm-red)' } },
            `${selectedDirObj.direction} · ${selectedDirObj.star}（${selectedDirObj.luck}位）`,
          ),
          h(DeepSeekButton, {
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），说明按八宅游年取法，为什么将${selectedDirObj.direction}标为${selectedDirObj.star}。`),
          }, t('action.askDeepSeek')),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedDirObj.desc),
      ) : null,

      chart && stageMode === 'orrery' && selectedWuXing ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
          h('span', { style: { color: WUXING_STYLE[selectedWuXing].color } },
            `${selectedWuXing} · 明干支占比 ${visibleElementCount * 12.5}%`,
          ),
          h('span', { className: 'zm-chip' }, `明干支 ${visibleElementCount} / 8 · 藏干 ${hiddenElementCount} 个`),
        ),
        h('div', { className: 'zm-muted' }, '取用仍须结合月令、藏干和四柱配合。'),
      ) : null,

      chart && stageMode === 'orrery' && !selectedWuXing && selectedPillar ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${selectedPillar.label}【${selectedPillar.ganZhi}】· ${selectedPillar.shiShenGan} · ${selectedPillar.naYin}`),
          h(DeepSeekButton, {
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），重点解读「${selectedPillar.label} ${selectedPillar.ganZhi}」（天干${selectedPillar.shiShenGan}、纳音${selectedPillar.naYin}）对我的具体影响。`),
          }, t('action.askDeepSeek')),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 6 } }, selectedPillar.shiShenDesc || chart.dayMaster.desc),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
          ...selectedPillar.hiddenDetails.map((hd, i) => h('span', { key: i, className: 'zm-chip' }, `藏${hd.gan}·${hd.shiShen}`)),
          h('span', { className: 'zm-chip' }, `地势:${selectedPillar.diShi}`),
          h('span', { className: 'zm-chip' }, `空亡:${selectedPillar.xunKong}`),
        ),
        selectedPillarIdx === 1 && chart.pattern?.desc ? h('div', { className: 'zm-muted', style: { marginTop: 6 } }, chart.pattern.desc) : null,
        selectedLinks.length ? h('div', { className: 'zm-reading-list' },
          h('div', { className: 'zm-muted' }, '实线为天干关系，虚线为地支关系'),
          ...selectedLinks.map((it, i) => {
            const other = chart.pillars[it.from === selectedPillarIdx ? it.to : it.from];
            return h('div', { key: i },
              h('strong', null, `${other?.label ?? ''} · ${it.type}`),
              h('span', { className: 'zm-muted' }, ` ${it.label}`),
            );
          }),
        ) : null,
      ) : null,

      // 3. Input Form (Shown cleanly below artwork when idle or when user clicks "修改参数")
      formOpen ? h('div', { className: 'zm-card' },
        h('form', { className: 'zm-form', onSubmit: submit },
          h(BirthFields, { birth, onChange: setBirth, profileTools, t }),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', disabled: busy, onClick: () => onDemo('bazi') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Deep Details Drawer (Keeps visual top crystal clean!)
      chart ? h('details', { key: chart.id, className: 'zm-details', open: true },
        h('summary', null,
          h('span', null, '八字详情'),
        ),
        h('div', { className: 'zm-details-body' },
          chart.currentYear ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, `${chart.currentYear.year} ${chart.currentYear.ganZhi}流年简评：`),
            chart.currentYear.note,
          ) : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
            ...['木', '火', '土', '金', '水'].map(el => {
              const st = WUXING_STYLE[el];
              const pct = (chart.wuxing?.counts?.[el] ?? 0) * 12.5;
              return h('div', { key: el, className: 'zm-bar-row', style: { cursor: 'default' } },
                h('span', { style: { fontWeight: 700, color: st.color } }, el),
                h('div', { className: 'zm-bar-track' }, h('div', { className: 'zm-bar-fill', style: { width: `${pct}%`, background: st.color } })),
                h('span', { className: 'zm-muted', style: { textAlign: 'right' } }, `${pct}%`),
              );
            }),
          ),
          h('section', { className: 'zm-bazi-analysis' },
            h('div', { className: 'zm-card-title' }, '干支关系'),
            h('div', { className: 'zm-reading-list' },
              ...renderBranchPairDetails(h, branchPairs),
              chart.branchMeetings ? h('div', null,
                h('strong', null, '三会局'),
                h('div', { className: 'zm-muted' }, BAZI_TERM_GLOSSARY.三会局),
                chart.branchMeetings.length ? chart.branchMeetings.map(meeting => h('div', { key: meeting.name },
                  `${meeting.name} · ${meeting.pillarIndices.map(i => `${chart.pillars[i].label}${chart.pillars[i].zhi}`).join('、')}`,
                )) : h('div', null, '本盘未见同组三支齐全。'),
              ) : null,
            ),
            otherInteractions.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 } },
              ...otherInteractions.map((it, i) => h('span', {
                key: i, className: 'zm-chip',
                style: { color: it.polarity === 'good' ? 'var(--zm-green)' : 'var(--zm-red)' },
              }, `${it.type} · ${it.label}`)),
            ) : null,
          ),
          fuyi ? h('section', { className: 'zm-bazi-analysis' },
            h('div', { className: 'zm-card-title' },
              h('strong', null, '扶抑用神'),
              h(DeepSeekButton, {
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），说明是否适用扶抑取法。请从月令、通根、透干和全局配合说明日主强弱的依据，再解释可能的用神及理由。依据不足时请说明不确定之处。`),
              }, t('action.askDeepSeek')),
            ),
            h('div', { className: 'zm-muted' }, BAZI_TERM_GLOSSARY.扶抑用神),
            h('div', { className: 'zm-reading-list' },
              h('div', null, h('strong', null, '日主与月令'), ` · ${chart.dayMaster.gan}${chart.dayMaster.element}日主 · ${fuyi.monthCommand}`),
              h('div', null, h('strong', null, '同类藏干（根气线索）'), ` · ${fuyi.rootClues.join('、') || '未见'}`),
              h('div', null, h('strong', null, '其余天干'), ` · ${fuyi.otherStems.join('、')}`),
              h('div', null, h('strong', null, '若日主偏弱'), ` · 可考察${fuyi.ifWeak}`),
              h('div', null, h('strong', null, '若日主偏强'), ` · 可考察${fuyi.ifStrong}`),
            ),
          ) : null,
          chart.shenSha?.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
            ...chart.shenSha.map((s, i) => h('span', { key: i, className: 'zm-chip', style: { color: 'var(--zm-gold)' } }, `${s.name}·${s.nature}`)),
          ) : null,
          chart.daYun?.length ? h('div', null,
            h('div', { className: 'zm-muted', style: { marginBottom: 6 } }, `大运排布（${chart.meta.startYunDesc}）`),
            h('div', { className: 'zm-dayun-strip' },
              ...chart.daYun.map((dy, idx) => h('button', {
                key: dy.index, type: 'button',
                'aria-pressed': selectedDaYunIdx === idx,
                className: `zm-dayun-pill ${selectedDaYunIdx === idx ? 'zm-selected' : ''}`,
                onClick: () => setSelectedDaYunIdx(idx),
              },
                h('div', { className: 'zm-muted', style: { fontSize: 10 } }, `${dy.startAge}-${dy.endAge}岁`),
                h('div', { style: { fontSize: 14, fontWeight: 800, color: WUXING_STYLE[dy.ganElement]?.color } }, dy.ganZhi),
                h('div', { className: 'zm-muted', style: { fontSize: 10 } }, dy.shiShenGan),
              )),
            ),
            selectedDaYun?.startDate && selectedDaYun.endExclusive ? h('div', { className: 'zm-muted', style: { marginTop: 6 } },
              `${selectedDaYun.ganZhi}大运 · ${selectedDaYun.startDate}起 · ${selectedDaYun.endExclusive}交下一运`,
            ) : null,
            selectedDaYun?.liuNian?.length ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, marginTop: 6 } },
              ...selectedDaYun.liuNian.map(ln => h('div', {
                key: ln.year,
                style: { padding: '4px 3px', borderRadius: 6, border: '1px solid var(--zm-border)', textAlign: 'center', fontSize: 10.5 },
              },
                h('div', { className: 'zm-muted', style: { fontSize: 9.5 } }, String(ln.year)),
                h('div', { style: { fontWeight: 700 } }, ln.ganZhi),
                ln.shiShen ? h('div', { className: 'zm-muted', style: { fontSize: 9.5 } }, ln.shiShen) : null,
              )),
            ) : null,
          ) : null,
        ),
      ) : null,
    );
  };
}

function createBaziView(React, Visuals) {
  const h = React.createElement;
  const { CelestialBackdropSvg, BaziOrrerySvg, BaZhaiCompassSvg } = Visuals;

  return function BaziView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
    const [formOpen, setFormOpen] = React.useState(!chart);
    const [stageMode, setStageMode] = React.useState('orrery'); // 'orrery' | 'compass'
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState('1995-05-18');
    const [lunarYear, setLunarYear] = React.useState('1995');
    const [lunarMonth, setLunarMonth] = React.useState('4');
    const [lunarDay, setLunarDay] = React.useState('19');
    const [isLeapMonth, setIsLeapMonth] = React.useState(false);
    const [time, setTime] = React.useState('08:30');
    const [gender, setGender] = React.useState('male');
    const [calendar, setCalendar] = React.useState('solar');
    const [longitude, setLongitude] = React.useState('');
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
      const params = { system: 'bazi', name, time, gender, calendar, question };
      if (calendar === 'lunar') {
        params.year = Number(lunarYear) || 1995;
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

    const selectedPillar = chart?.pillars?.[selectedPillarIdx] || chart?.pillars?.[2];
    const selectedDaYun = chart?.daYun?.[selectedDaYunIdx] || chart?.daYun?.[0];
    const selectedDirObj = chart?.mingGua?.directions?.find(d => d.direction === selectedDir) || chart?.mingGua?.directions?.[0];

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      // 1. MONUMENTAL PURE-GRAPHIC SHOWCASE CANVAS (Zero text clutter!)
      h('div', { className: 'zm-canvas' },
        h(CelestialBackdropSvg, { isDark }),
        h('div', { className: 'zm-canvas-bar' },
          h('div', { className: 'zm-stage-tabs', role: 'tablist' },
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
          h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-sm',
              onClick: () => setFormOpen(v => !v),
            }, formOpen ? '收起参数' : '修改参数') : null,
            chart ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的四柱八字盘（盘面ID: ${chart.id}，${chart.title}，四柱：${chart.pillars.map(p => p.ganZhi).join(' ')}），用新手易懂的白话为我深度解读日主性格、格局、五行喜用神、八宅吉位与家居风水建议。`),
            }, `✦ ${t('dock.ask')}`) : h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
              onClick: () => onDemo('bazi'),
            }, `✦ ${t('action.demo')}`),
          ),
        ),

        // Full-Scale 420x420 Interactive Graphical Instrument
        h('div', { className: 'zm-canvas-artwork' },
          stageMode === 'orrery'
            ? h(BaziOrrerySvg, {
              chart,
              isDark,
              selectedPillarIdx,
              selectedWuXing,
              onSelectPillar: idx => { setSelectedPillarIdx(idx); setSelectedWuXing(null); },
              onSelectWuXing: el => setSelectedWuXing(prev => (prev === el ? null : el)),
            })
            : h(BaZhaiCompassSvg, {
              mingGua: chart?.mingGua,
              isDark,
              selectedDir,
              onSelectDir: setSelectedDir,
            }),
        ),

        // Minimal Single-Row Glass Readout Footer
        chart ? h('div', { className: 'zm-canvas-footer' },
          h('span', { className: 'zm-glass-pill' }, chart.pillars.map(p => p.ganZhi).join(' · ')),
          chart.pattern ? h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, chart.pattern.name) : null,
          h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-green)' } }, `喜 ${chart.wuxing.favorable.join('·')}`),
          chart.mingGua ? h('span', { className: 'zm-glass-pill' }, `${chart.mingGua.name}·${chart.mingGua.group}`) : null,
        ) : null,
      ),

      // Compact Beginner Hint (only when toggled ON)
      beginnerMode ? h('div', { className: 'zm-tip-banner' },
        h('strong', null, '看图提示：'),
        stageMode === 'orrery'
          ? '中心为日主（你自己），四角星印为年月日时四柱，外圈五角星显示五行强弱，虚线为合冲能量；点击任意星印或五行珠查看详解。'
          : '绿色扇区为个人四大吉位（生气财位/天医健康/延年人脉/伏位文昌），中央指针直指你的生气大财位，点击方位看布置建议。',
      ) : null,

      // 2. Interactive Focus Inspector (Single concise card for whatever node user clicked)
      chart && stageMode === 'compass' && selectedDirObj ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
          h('span', { style: { color: selectedDirObj.luck === '吉' ? 'var(--zm-green)' : 'var(--zm-red)' } },
            `${selectedDirObj.direction} · ${selectedDirObj.star}（${selectedDirObj.luck}位）`,
          ),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），结合我的八宅命卦（${chart.mingGua.name}·${chart.mingGua.group}）与喜用神，告诉我家里「${selectedDirObj.direction}（${selectedDirObj.star}位）」具体该怎么布置？`),
          }, '问布置'),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedDirObj.desc),
      ) : null,

      chart && stageMode === 'orrery' && selectedWuXing ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
          h('span', { style: { color: WUXING_STYLE[selectedWuXing].color } },
            `${WUXING_STYLE[selectedWuXing].label} · ${chart.wuxing.percentages[selectedWuXing]}%（${WUXING_STYLE[selectedWuXing].dir}）`,
          ),
          h('span', { className: 'zm-chip' }, chart.wuxing.favorable.includes(selectedWuXing) ? '★ 喜用神' : '平衡元素'),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `${WUXING_STYLE[selectedWuXing].trait}。${chart.wuxing.strengthAdvice}`),
      ) : null,

      chart && stageMode === 'orrery' && !selectedWuXing && selectedPillar ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
          h('span', null, `${selectedPillar.label}【${selectedPillar.ganZhi}】· ${selectedPillar.shiShenGan} · ${selectedPillar.naYin}`),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-sm',
            onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），重点解读「${selectedPillar.label} ${selectedPillar.ganZhi}」（天干${selectedPillar.shiShenGan}、纳音${selectedPillar.naYin}）对我的具体影响。`),
          }, t('action.askFocus')),
        ),
        h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 6 } }, selectedPillar.shiShenDesc || chart.dayMaster.desc),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
          ...selectedPillar.hiddenDetails.map((hd, i) => h('span', { key: i, className: 'zm-chip' }, `藏${hd.gan}·${hd.shiShen}`)),
          h('span', { className: 'zm-chip' }, `地势:${selectedPillar.diShi}`),
          h('span', { className: 'zm-chip' }, `空亡:${selectedPillar.xunKong}`),
        ),
      ) : null,

      // 3. Input Form (Shown cleanly below artwork when idle or when user clicks "修改参数")
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
                h('option', { value: 'male' }, t('form.male')),
                h('option', { value: 'female' }, t('form.female')),
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
            h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('bazi') }, t('action.demo')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
          ),
        ),
      ) : null,

      // 4. Collapsible Deep Details Drawer (Keeps visual top crystal clean!)
      chart ? h('details', { className: 'zm-details' },
        h('summary', null,
          h('span', null, `五行详表 · ${chart.currentYear?.year || ''}流年 · 大运神煞`),
          h('span', { className: 'zm-muted' }, '展开详览 ▾'),
        ),
        h('div', { className: 'zm-details-body' },
          chart.currentYear ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, `${chart.currentYear.year} ${chart.currentYear.ganZhi}流年简评：`),
            chart.currentYear.note,
          ) : null,
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
            ...['木', '火', '土', '金', '水'].map(el => {
              const st = WUXING_STYLE[el];
              const pct = chart.wuxing.percentages[el] || 0;
              return h('div', { key: el, className: 'zm-bar-row', style: { cursor: 'default' } },
                h('span', { style: { fontWeight: 700, color: st.color } }, `${el}${chart.wuxing.favorable.includes(el) ? '★' : ''}`),
                h('div', { className: 'zm-bar-track' }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.max(4, pct)}%`, background: st.color } })),
                h('span', { className: 'zm-muted', style: { textAlign: 'right' } }, `${pct}%`),
              );
            }),
          ),
          chart.interactions?.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
            ...chart.interactions.map((it, i) => h('span', {
              key: i, className: 'zm-chip',
              style: { color: it.polarity === 'good' ? 'var(--zm-green)' : 'var(--zm-red)' },
            }, `${it.type}：${it.label}`)),
          ) : null,
          chart.shenSha?.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
            ...chart.shenSha.map((s, i) => h('span', { key: i, className: 'zm-chip', style: { color: 'var(--zm-gold)' } }, `${s.name}·${s.nature}`)),
          ) : null,
          chart.daYun?.length ? h('div', null,
            h('div', { className: 'zm-muted', style: { marginBottom: 6 } }, `大运排布（${chart.meta.startYunDesc}）`),
            h('div', { className: 'zm-dayun-strip' },
              ...chart.daYun.map((dy, idx) => h('button', {
                key: dy.index, type: 'button',
                className: `zm-dayun-pill ${selectedDaYunIdx === idx ? 'zm-selected' : ''}`,
                onClick: () => setSelectedDaYunIdx(idx),
              },
                h('div', { className: 'zm-muted', style: { fontSize: 10 } }, `${dy.startAge}-${dy.endAge}岁`),
                h('div', { style: { fontSize: 14, fontWeight: 800, color: WUXING_STYLE[dy.ganElement]?.color } }, dy.ganZhi),
                h('div', { className: 'zm-muted', style: { fontSize: 10 } }, dy.shiShenGan),
              )),
            ),
            selectedDaYun?.liuNian?.length ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, marginTop: 6 } },
              ...selectedDaYun.liuNian.map(ln => h('div', {
                key: ln.year,
                style: { padding: '4px 3px', borderRadius: 6, border: '1px solid var(--zm-border)', textAlign: 'center', fontSize: 10.5 },
              },
                h('div', { className: 'zm-muted', style: { fontSize: 9.5 } }, String(ln.year)),
                h('div', { style: { fontWeight: 700 } }, ln.ganZhi),
              )),
            ) : null,
          ) : null,
        ),
      ) : null,
    );
  };
}

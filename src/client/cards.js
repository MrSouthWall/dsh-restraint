function createCompanionCards(React, Visuals) {
  const h = React.createElement;
  const { ZhimingErrorBoundary, LuopanEmblem } = Visuals;

  function useProjectionState(useProjectionProp, fallbackFace) {
    const fromStandard = typeof useProjectionProp === 'function' ? useProjectionProp('zhiming') : undefined;
    const subscribe = React.useCallback(
      cb => (fallbackFace && typeof fallbackFace.subscribe === 'function' ? fallbackFace.subscribe(cb) : () => {}),
      [fallbackFace],
    );
    const getSnapshot = React.useCallback(
      () => (fallbackFace && typeof fallbackFace.getSnapshot === 'function' ? fallbackFace.getSnapshot() : undefined),
      [fallbackFace],
    );
    const fromFallback = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return fromStandard !== undefined ? fromStandard : fromFallback;
  }

  function extractErrorText(block, fallback) {
    if (block?.error?.reason) return block.error.reason;
    if (Array.isArray(block?.content)) {
      const txt = block.content.map(c => (c && c.type === 'text' ? c.text : '')).join(' ').trim();
      if (txt) return txt;
    }
    return fallback;
  }

  function renderMiniStrip(chart) {
    if (!chart) return null;
    if (chart.system === 'bazi' && Array.isArray(chart.pillars)) {
      return h('div', { className: 'zm-chat-mini-strip' },
        ...chart.pillars.map(p => {
          const st = WUXING_STYLE[p.ganElement] || WUXING_STYLE['土'];
          return h('span', {
            key: p.key,
            className: 'zm-chip',
            style: { background: st.soft, color: st.color, borderColor: st.border },
          }, `${p.label} ${p.ganZhi}`);
        }),
        chart.wuxing?.favorable?.length
          ? h('span', { className: 'zm-chip' }, `喜用：${chart.wuxing.favorable.join('、')}`)
          : null,
      );
    }
    if (chart.system === 'qimen' && chart.meta) {
      return h('div', { className: 'zm-chat-mini-strip' },
        h('span', { className: 'zm-chip', style: { color: 'var(--zm-indigo)', borderColor: 'rgba(99,102,241,0.45)' } }, chart.meta.juTitle),
        h('span', { className: 'zm-chip' }, `值符 ${chart.meta.zhiFuStar} → ${chart.meta.zhiFuPalace}`),
        h('span', { className: 'zm-chip' }, `值使 ${chart.meta.zhiShiGate} → ${chart.meta.zhiShiPalace}`),
      );
    }
    if (chart.system === 'meihua' && chart.hexagrams) {
      return h('div', { className: 'zm-chat-mini-strip' },
        h('span', { className: 'zm-chip', style: { color: 'var(--zm-red)', borderColor: 'rgba(239,68,68,0.45)' } }, `本：${chart.hexagrams.main.symbol} ${chart.hexagrams.main.fullName}`),
        h('span', { className: 'zm-chip' }, `互：${chart.hexagrams.mutual.fullName}`),
        h('span', { className: 'zm-chip', style: { color: 'var(--zm-gold)', borderColor: 'rgba(201,151,59,0.45)' } }, `变：${chart.hexagrams.changed.symbol} ${chart.hexagrams.changed.fullName}`),
        h('span', { className: 'zm-chip' }, `${chart.tiYong?.overallVerdict || ''} (${chart.tiYong?.overallScore || ''})`),
      );
    }
    if (chart.system === 'ziwei' && chart.meta) {
      return h('div', { className: 'zm-chat-mini-strip' },
        h('span', { className: 'zm-chip', style: { color: 'var(--zm-purple)', borderColor: 'rgba(168,85,247,0.45)' } }, chart.meta.fiveElementsClass),
        h('span', { className: 'zm-chip' }, `命宫：${chart.keyHighlights?.soul?.stars || ''}`),
        ...(chart.mutagens || []).slice(0, 4).map((m, i) => h('span', { key: i, className: 'zm-chip' }, `${m.star}化${m.mutagen}`)),
      );
    }
    if (chart.system === 'hepan') {
      return h('div', { className: 'zm-chat-mini-strip' },
        h('span', { className: 'zm-chip', style: { color: 'var(--zm-pink)', borderColor: 'rgba(236,72,153,0.45)' } }, `${chart.overallScore}分 · ${chart.grade}`),
        ...(chart.dimensions || []).slice(0, 3).map(d => h('span', { key: d.key, className: 'zm-chip' }, `${d.label} ${d.score}`)),
      );
    }
    return null;
  }

  // 1. Composer Dock Pill (calm idle emblem; async ask feedback)
  function ZhimingComposerDock(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const projection = useProjectionState(props.useProjection, props.projectionFace);
    const activeChart = projection?.charts?.find(c => c.id === projection.activeChartId) || projection?.charts?.[0] || null;
    const [sending, setSending] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState('');

    const askCurrent = async () => {
      if (!activeChart || sending) return;
      setSending(true);
      setErrMsg('');
      try {
        const res = await props.sendPrompt(`请读取我当前知命罗盘中的「${activeChart.title}」（盘面ID: ${activeChart.id}），用新手白话为我解读它的核心含义和实用建议。`);
        if (res?.ok === false) setErrMsg(res.error || t('status.syncError'));
      } catch (e) {
        setErrMsg(e?.message || t('status.syncError'));
      } finally {
        setSending(false);
      }
    };

    return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
      h('div', { className: 'zm-dock-wrap' },
        h('button', {
          type: 'button',
          className: 'zm-dock-main',
          onClick: () => props.openStudio(activeChart?.system, activeChart?.id),
        },
          h(LuopanEmblem, { size: 18, spin: false }),
          h('span', { className: 'zm-dock-text' }, errMsg || (activeChart ? `${t('brand.short')} · ${activeChart.title}` : t('dock.empty'))),
        ),
        activeChart ? h('button', {
          type: 'button',
          className: 'zm-btn zm-btn-gold zm-btn-sm',
          style: { padding: '2px 8px', fontSize: 11 },
          disabled: sending,
          onClick: askCurrent,
        }, sending ? t('status.sending') : t('dock.ask')) : h('button', {
          type: 'button',
          className: 'zm-btn zm-btn-sm',
          style: { padding: '2px 8px', fontSize: 11 },
          onClick: () => props.openStudio('tutorial', null),
        }, t('dock.open')),
      ),
    );
  }

  // 2. Inline Chat Tool Card (`tool.call.toolview` for `zhiming_chart`)
  function ZhimingChartToolCard(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const isResult = props.phase === 'result';
    const isError = isResult && (props.block?.isError === true || !props.block?.meta?.chart);
    const chart = isResult && !isError ? props.block.meta.chart : null;

    // Auto-open studio once when a brand-new live chart arrives (never on replay or missing timestamp)
    const openedRef = React.useRef(null);
    React.useEffect(() => {
      const ts = props.block?.time;
      const ageMs = typeof ts === 'number' && ts > 0 ? Math.abs(Date.now() - ts) : Infinity;
      if (chart?.id && ageMs < 15000 && openedRef.current !== chart.id && props.autoOpenOnNew) {
        openedRef.current = chart.id;
        props.autoOpenOnNew(chart.system, chart.id);
      }
    }, [chart?.id, props.block?.time]);

    if (isError) {
      return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
        h('div', { className: 'zm-chat-card', style: { borderColor: 'rgba(239,68,68,0.48)' } },
          h('div', { style: { color: 'var(--zm-red)', fontWeight: 700, marginBottom: 3 } }, t('tool.chartError')),
          h('div', { className: 'zm-muted' }, extractErrorText(props.block, t('status.syncError'))),
        ),
      );
    }

    return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
      h('div', { className: 'zm-chat-card' },
        h('div', { className: 'zm-chat-card-head' },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 } },
            h(LuopanEmblem, { size: 22, spin: !isResult }),
            h('div', { style: { minWidth: 0 } },
              h('div', { style: { fontWeight: 700, fontSize: 13 } }, chart ? chart.title : t('tool.charting')),
              chart ? h('div', { className: 'zm-muted' }, chart.subtitle) : null,
            ),
          ),
          chart ? h('button', {
            type: 'button',
            className: 'zm-btn zm-btn-gold zm-btn-sm',
            onClick: () => props.openStudio(chart.system, chart.id),
          }, `${t('action.openStudio')} →`) : null,
        ),
        chart ? renderMiniStrip(chart) : null,
      ),
    );
  }

  // 3. Inline Chat Tool Card (`tool.call.toolview` for `zhiming_read`)
  function ZhimingReadToolCard(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const done = props.phase === 'result';
    const isError = done && props.block?.isError === true;
    return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
      h('div', { className: 'zm-chat-card', style: { padding: '7px 10px', borderColor: isError ? 'rgba(239,68,68,0.48)' : undefined } },
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 7 } },
            h(LuopanEmblem, { size: 18, spin: !done }),
            h('span', { style: { fontSize: 12, fontWeight: 600, color: isError ? 'var(--zm-red)' : undefined } },
              isError ? t('tool.readError') : (done ? t('tool.readDone') : t('tool.reading')),
            ),
          ),
          h('button', {
            type: 'button',
            className: 'zm-btn zm-btn-sm',
            onClick: () => props.openStudio(null, null),
          }, t('dock.open')),
        ),
      ),
    );
  }

  // 4. Inline Chat Command Card (`conversation.chat.commandview` for `/zhiming`)
  function ZhimingCommandCard(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const [sending, setSending] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState('');
    const outcome = props.node?.outcome;
    let envelope = null;
    let isPlainHelp = false;

    if (outcome?.kind === 'success' && typeof outcome.text === 'string') {
      if (outcome.text.startsWith('ZHIMING_STATE:')) {
        try {
          envelope = JSON.parse(outcome.text.slice('ZHIMING_STATE:'.length));
        } catch {
          envelope = null;
        }
      } else if (outcome.text.trim()) {
        isPlainHelp = true;
      }
    }
    const chart = envelope?.op === 'chart' ? envelope.chart : null;

    if (outcome?.kind === 'error') {
      return h('div', { className: 'zm-chat-card', style: { borderColor: 'rgba(239,68,68,0.48)' } },
        h('div', { style: { color: 'var(--zm-red)', fontWeight: 600 } }, outcome.text || t('status.syncError')),
      );
    }

    if (isPlainHelp) {
      return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
        h('div', { className: 'zm-chat-card' },
          h('div', { style: { fontWeight: 700, marginBottom: 4 } }, t('cmd.help')),
          h('div', { style: { whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, outcome.text),
        ),
      );
    }

    const askFromCard = async () => {
      if (!chart || sending) return;
      setSending(true);
      setErrMsg('');
      try {
        const res = await props.sendPrompt(`请读取我在知命罗盘刚排好的「${chart.title}」（盘面ID: ${chart.id}），用新手白话为我解读它的风水含义与建议。`);
        if (res?.ok === false) setErrMsg(res.error || t('status.syncError'));
      } catch (e) {
        setErrMsg(e?.message || t('status.syncError'));
      } finally {
        setSending(false);
      }
    };

    const headingText = chart
      ? chart.title
      : envelope?.op === 'clear'
        ? t('cmd.cleared')
        : envelope?.op === 'focus'
          ? t('cmd.focused')
          : t('cmd.synced');

    return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
      h('div', { className: 'zm-chat-card' },
        h('div', { className: 'zm-chat-card-head' },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h(LuopanEmblem, { size: 20, spin: !outcome }),
            h('div', null,
              h('div', { style: { fontWeight: 700, fontSize: 12.5 } }, headingText),
              chart ? h('div', { className: 'zm-muted' }, chart.subtitle) : null,
            ),
          ),
          chart ? h('div', { style: { display: 'flex', gap: 5 } },
            h('button', {
              type: 'button',
              className: 'zm-btn zm-btn-sm',
              onClick: () => props.openStudio(chart.system, chart.id),
            }, t('dock.open')),
            h('button', {
              type: 'button',
              className: 'zm-btn zm-btn-gold zm-btn-sm',
              disabled: sending,
              onClick: askFromCard,
            }, sending ? t('status.sending') : t('dock.ask')),
          ) : null,
        ),
        chart ? renderMiniStrip(chart) : null,
        errMsg ? h('div', { style: { marginTop: 6, color: 'var(--zm-red)', fontSize: 11 } }, errMsg) : null,
      ),
    );
  }

  // 5. Right Sidebar Dynamic Tab Title
  function ZhimingTabTitle(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const projection = useProjectionState(props.useProjection, props.projectionFace);
    const activeChart = projection?.charts?.find(c => c.id === projection.activeChartId) || projection?.charts?.[0] || null;
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5 } },
      h(LuopanEmblem, { size: 14, spin: false }),
      h('span', null, activeChart ? `${t('tab.title')} · ${activeChart.title.split(' · ')[0]}` : t('tab.title')),
    );
  }

  return {
    ZhimingComposerDock,
    ZhimingChartToolCard,
    ZhimingReadToolCard,
    ZhimingCommandCard,
    ZhimingTabTitle,
  };
}

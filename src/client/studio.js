function createStudioComponent(React, Visuals, Views) {
  const h = React.createElement;
  const { ZhimingErrorBoundary, LuopanEmblem } = Visuals;
  const { BaziView, QimenView, MeihuaView, ZiweiView, HepanView, TutorialView } = Views;

  const EMPTY_PROJECTION = {
    version: 1,
    activeChartId: null,
    activeSystem: 'tutorial',
    focusedPart: null,
    charts: [],
  };

  function detectHostTheme() {
    try {
      if (typeof document !== 'undefined') {
        const rootEl = document.documentElement;
        const bodyEl = document.body;
        const attr = rootEl?.getAttribute?.('data-theme') || bodyEl?.getAttribute?.('data-theme') || '';
        if (attr.toLowerCase().includes('dark')) return 'dark';
        if (attr.toLowerCase().includes('light')) return 'light';
        if (rootEl?.classList?.contains('dark') || bodyEl?.classList?.contains('dark')) return 'dark';
        if (typeof getComputedStyle === 'function' && rootEl) {
          const bg = getComputedStyle(rootEl).getPropertyValue('--dsw-alias-bg-base')?.trim() || '';
          const rgb = bg.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const lum = (0.299 * Number(rgb[0]) + 0.587 * Number(rgb[1]) + 0.114 * Number(rgb[2])) / 255;
            return lum < 0.5 ? 'dark' : 'light';
          }
          if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bg)) {
            const hex = bg.length === 4 ? bg.slice(1).split('').map(c => c + c).join('') : bg.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return lum < 0.5 ? 'dark' : 'light';
          }
        }
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch {
      // ignore detection errors in non-DOM test runtimes
    }
    return 'light';
  }

  function readSavedTheme() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('dsh-zhiming-theme');
        if (v === 'dark' || v === 'light') return v;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  }

  function saveTheme(val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('dsh-zhiming-theme', val);
      }
    } catch {
      // ignore storage errors
    }
  }

  function useObservableFace(face) {
    const subscribe = React.useCallback(
      cb => (face && typeof face.subscribe === 'function' ? face.subscribe(cb) : () => {}),
      [face],
    );
    const getSnapshot = React.useCallback(
      () => (face && typeof face.getSnapshot === 'function' ? face.getSnapshot() : undefined),
      [face],
    );
    return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  function useZhimingState(useProjectionProp, fallbackFace) {
    const fromStandard = typeof useProjectionProp === 'function' ? useProjectionProp('zhiming') : undefined;
    const fromFallback = useObservableFace(fallbackFace);
    return fromStandard ?? fromFallback ?? EMPTY_PROJECTION;
  }

  return function ZhimingStudio(props) {
    const t = props.t || (k => ZH_DICT[k] || k);
    const projection = useZhimingState(props.useProjection, props.projectionFace);
    const uiNav = useObservableFace(props.uiNavFace);

    const [activeTab, setActiveTab] = React.useState(() => {
      if (uiNav?.tab) return uiNav.tab;
      if (projection.activeChartId) {
        const active = projection.charts.find(c => c.id === projection.activeChartId);
        if (active?.system) return active.system;
      }
      return projection.activeSystem || 'tutorial';
    });
    const [selectedChartId, setSelectedChartId] = React.useState(projection.activeChartId);
    const [themeOverride, setThemeOverride] = React.useState(() => readSavedTheme());
    const [hostTheme, setHostTheme] = React.useState(() => detectHostTheme());
    const [beginnerMode, setBeginnerMode] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    const lastActiveRef = React.useRef(projection.activeChartId);
    const lastNavSeqRef = React.useRef(uiNav?.seq || 0);
    const toastTimerRef = React.useRef(null);

    const resolvedTheme = themeOverride || hostTheme;
    const isDark = resolvedTheme === 'dark';

    const setTheme = next => {
      setThemeOverride(next);
      saveTheme(next);
    };

    React.useEffect(() => {
      const cleanups = [];
      try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
          const mq = window.matchMedia('(prefers-color-scheme: dark)');
          const onChange = () => setHostTheme(detectHostTheme());
          if (mq.addEventListener) {
            mq.addEventListener('change', onChange);
            cleanups.push(() => mq.removeEventListener('change', onChange));
          }
        }
        if (typeof MutationObserver === 'function' && typeof document !== 'undefined' && document.documentElement) {
          const obs = new MutationObserver(() => setHostTheme(detectHostTheme()));
          obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
          cleanups.push(() => obs.disconnect());
        }
      } catch {
        // ignore in headless runtimes
      }
      return () => {
        cleanups.forEach(fn => fn());
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      };
    }, []);

    // Auto-switch tab whenever a new chart arrives from DeepSeek or UI casting
    React.useEffect(() => {
      if (projection.activeChartId && projection.activeChartId !== lastActiveRef.current) {
        lastActiveRef.current = projection.activeChartId;
        setSelectedChartId(projection.activeChartId);
        const found = projection.charts.find(c => c.id === projection.activeChartId);
        if (found?.system) setActiveTab(found.system);
      }
    }, [projection.activeChartId, projection.charts]);

    // Respond to explicit "Open in Studio" click from inline Chat cards
    React.useEffect(() => {
      if (uiNav?.seq && uiNav.seq !== lastNavSeqRef.current) {
        lastNavSeqRef.current = uiNav.seq;
        if (uiNav.chartId) setSelectedChartId(uiNav.chartId);
        if (uiNav.tab) setActiveTab(uiNav.tab);
      }
    }, [uiNav?.seq, uiNav?.chartId, uiNav?.tab]);

    const showToast = React.useCallback((msg, isError = false) => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ msg, isError });
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, 3600);
    }, []);

    const handleCast = React.useCallback(async params => {
      if (busy) return;
      setBusy(true);
      try {
        const res = await props.executeZhiming({ op: 'cast', params });
        if (!res.ok) {
          showToast(res.error || t('status.syncError'), true);
        }
      } catch (err) {
        showToast(err?.message || t('status.syncError'), true);
      } finally {
        setBusy(false);
      }
    }, [busy, props.executeZhiming, showToast, t]);

    const handleDemo = React.useCallback(async system => {
      if (busy) return;
      setBusy(true);
      setActiveTab(system);
      try {
        const res = await props.executeZhiming({ op: 'demo', system });
        if (!res.ok) {
          showToast(res.error || t('status.syncError'), true);
        }
      } catch (err) {
        showToast(err?.message || t('status.syncError'), true);
      } finally {
        setBusy(false);
      }
    }, [busy, props.executeZhiming, showToast, t]);

    const handleClearHistory = React.useCallback(async () => {
      if (!confirmClear) {
        setConfirmClear(true);
        return;
      }
      setConfirmClear(false);
      setBusy(true);
      try {
        const res = await props.executeZhiming({ op: 'clear' });
        if (!res.ok) {
          showToast(res.error || t('status.syncError'), true);
        } else {
          setSelectedChartId(null);
          showToast(t('cmd.cleared'), false);
        }
      } catch (err) {
        showToast(err?.message || t('status.syncError'), true);
      } finally {
        setBusy(false);
      }
    }, [confirmClear, props.executeZhiming, showToast, t]);

    const handleAskDeepSeek = React.useCallback(async promptText => {
      try {
        const res = await props.sendPrompt(promptText);
        if (res?.ok === false) {
          showToast(res.error || t('status.syncError'), true);
        } else {
          showToast(t('status.sentPrompt'), false);
        }
      } catch (err) {
        showToast(err?.message || t('status.syncError'), true);
      }
    }, [props.sendPrompt, showToast, t]);

    const chartForTab = React.useMemo(() => {
      if (activeTab === 'tutorial') return null;
      const picked = projection.charts.find(c => c.id === selectedChartId && c.system === activeTab);
      if (picked) return picked;
      return projection.charts.find(c => c.system === activeTab) || null;
    }, [activeTab, selectedChartId, projection.charts]);

    const renderBody = () => {
      const commonProps = {
        chart: chartForTab,
        isDark,
        beginnerMode,
        busy,
        onCast: handleCast,
        onDemo: handleDemo,
        onAskDeepSeek: handleAskDeepSeek,
        t,
      };
      switch (activeTab) {
        case 'bazi':
          return h(BaziView, commonProps);
        case 'qimen':
          return h(QimenView, commonProps);
        case 'meihua':
          return h(MeihuaView, commonProps);
        case 'ziwei':
          return h(ZiweiView, commonProps);
        case 'hepan':
          return h(HepanView, commonProps);
        default:
          return h(TutorialView, {
            isDark,
            busy,
            onSelectTab: setActiveTab,
            onDemo: handleDemo,
            onAskDeepSeek: handleAskDeepSeek,
            t,
          });
      }
    };

    return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
      h('div', { className: 'zm-root', 'data-zm-theme': resolvedTheme },
        // Sleek Dual-Theme Header + Navigation Bar
        h('div', { className: 'zm-hero-bar' },
          h('div', { className: 'zm-hero-top' },
            h('div', { className: 'zm-brand-wrap' },
              h(LuopanEmblem, { size: 28, spin: true }),
              h('div', { className: 'zm-brand-title' }, t('brand.short')),
            ),
            h('div', { className: 'zm-hero-actions' },
              // Dedicated Light / Dark Theme Segmented Switch
              h('div', { className: 'zm-theme-seg', role: 'group', 'aria-label': '主题切换' },
                h('button', {
                  type: 'button',
                  className: !isDark ? 'zm-on' : '',
                  'aria-pressed': !isDark,
                  onClick: () => setTheme('light'),
                }, `☀ ${t('action.themeLight')}`),
                h('button', {
                  type: 'button',
                  className: isDark ? 'zm-on' : '',
                  'aria-pressed': isDark,
                  onClick: () => setTheme('dark'),
                }, `☾ ${t('action.themeDark')}`),
              ),
              h('button', {
                type: 'button',
                className: `zm-btn zm-btn-sm ${beginnerMode ? 'zm-btn-primary' : ''}`,
                role: 'switch',
                'aria-checked': beginnerMode,
                onClick: () => setBeginnerMode(v => !v),
              }, beginnerMode ? '白话提示' : '白话'),
              projection.charts.length > 0 ? h(React.Fragment, null,
                h('select', {
                  className: 'zm-select',
                  style: { width: 'auto', maxWidth: 124, padding: '3px 7px', fontSize: 11 },
                  'aria-label': t('action.history'),
                  value: chartForTab?.id || '',
                  onChange: e => {
                    const id = e.target.value;
                    const found = projection.charts.find(c => c.id === id);
                    if (found) {
                      setSelectedChartId(found.id);
                      setActiveTab(found.system);
                    }
                  },
                },
                  h('option', { value: '' }, `${t('action.history')} (${projection.charts.length})`),
                  ...projection.charts.map(c => h('option', { key: c.id, value: c.id }, c.title)),
                ),
                h('button', {
                  type: 'button',
                  className: 'zm-btn zm-btn-sm',
                  disabled: busy,
                  style: confirmClear ? { color: 'var(--zm-red)', borderColor: 'rgba(239,68,68,0.5)' } : undefined,
                  onClick: handleClearHistory,
                  onBlur: () => setConfirmClear(false),
                }, confirmClear ? t('action.confirmClear') : t('action.clearHistory')),
              ) : null,
            ),
          ),
          // 6 Navigation Pills
          h('div', { className: 'zm-nav', role: 'tablist' },
            ...SYSTEM_TABS.map(tab => {
              const hasChart = tab.id !== 'tutorial' && projection.charts.some(c => c.system === tab.id);
              return h('button', {
                key: tab.id,
                type: 'button',
                role: 'tab',
                'aria-selected': activeTab === tab.id,
                className: `zm-nav-pill ${activeTab === tab.id ? 'zm-active' : ''}`,
                style: { '--zm-accent': tab.accent },
                onClick: () => setActiveTab(tab.id),
              },
                h('span', { className: 'zm-nav-glyph' }, tab.icon),
                h('span', null, t(tab.labelKey)),
                hasChart ? h('span', {
                  style: { width: 5, height: 5, borderRadius: '50%', background: tab.accent },
                }) : null,
              );
            }),
          ),
        ),

        // Scrollable View Body
        h('div', { className: 'zm-body' },
          renderBody(),
          toast ? h('div', {
            className: 'zm-toast',
            role: 'status',
            'aria-live': 'polite',
            style: toast.isError ? { background: '#991b1b', color: '#fff', borderColor: '#dc2626' } : undefined,
          },
            h('span', null, toast.msg),
            h('button', {
              type: 'button',
              'aria-label': 'Close',
              style: { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 12 },
              onClick: () => setToast(null),
            }, '✕'),
          ) : null,
        ),
      ),
    );
  };
}

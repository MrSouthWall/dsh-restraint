function createPluginEntry(React) {
  const Visuals = { ...createVisuals(React), ...createStageVisuals(React) };
  const Views = {
    BaziView: createBaziView(React, Visuals),
    QimenView: createQimenView(React, Visuals),
    MeihuaView: createMeihuaView(React, Visuals),
    ZiweiView: createZiweiView(React, Visuals),
    HepanView: createHepanView(React, Visuals),
    TutorialView: createTutorialView(React, Visuals),
  };
  const ZhimingStudio = createStudioComponent(React, Visuals, Views);
  const Cards = createCompanionCards(React, Visuals);

  const PLUGIN_ID = '@local/dsh-zhiming';
  const TAB_KIND = 'zhiming';
  const NS = 'zhiming';

  function createLocalNavObservable() {
    let snapshot = { seq: 0, tab: null, chartId: null };
    const listeners = new Set();
    return {
      face: {
        getSnapshot: () => snapshot,
        subscribe: fn => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
      },
      navigate(tab, chartId) {
        snapshot = { seq: snapshot.seq + 1, tab: tab || null, chartId: chartId || null };
        for (const fn of listeners) fn();
      },
    };
  }

  return {
    inject: ['slots', 'locale', 'sessions', 'remote', 'remote.commands'],
    apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh: ZH_DICT, en: EN_DICT }));
      const t = ctx.locale.bind(NS);

      // Mount one shared stylesheet for the lifetime of this plugin (cleanly removed on unload)
      ctx.effect(() => {
        if (typeof document === 'undefined' || !document.head) return undefined;
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-zhiming-style', '1');
        styleEl.textContent = ZHIMING_CSS;
        document.head.appendChild(styleEl);
        return () => {
          styleEl.remove();
        };
      });

      const navBySession = new Map();
      const autoOpenedChartIds = new Set();
      ctx.effect(() => () => {
        navBySession.clear();
        autoOpenedChartIds.clear();
      });

      const navFor = sessionId => {
        const key = String(sessionId || 'default');
        let item = navBySession.get(key);
        if (!item) {
          item = createLocalNavObservable();
          navBySession.set(key, item);
        }
        return item;
      };

      const makeSessionHelpers = sessionId => {
        const sessions = ctx.sessions;
        const remote = ctx.remote;
        const nav = navFor(sessionId);

        const getCurrentBinding = () => (
          sessions && typeof sessions.binding === 'function' ? sessions.binding(sessionId) : undefined
        );

        const openStudio = (tab, chartId) => {
          if (tab || chartId) nav.navigate(tab, chartId);
          try {
            const sidebarRight = ctx.get ? ctx.get('sidebarRight') : ctx.sidebarRight;
            if (sidebarRight && typeof sidebarRight.openTab === 'function') {
              sidebarRight.openTab(TAB_KIND);
              return true;
            }
          } catch {
            return false;
          }
          return false;
        };

        const autoOpenOnNew = (tab, chartId) => {
          if (!chartId || autoOpenedChartIds.has(chartId)) return;
          if (openStudio(tab, chartId)) {
            autoOpenedChartIds.add(chartId);
          }
        };

        const executeZhiming = async payload => {
          const line = `/zhiming ${JSON.stringify(payload)}`;
          try {
            const remoteCommands = (ctx.get && ctx.get('remote.commands')) || remote?.commands;
            if (remoteCommands && typeof remoteCommands.execute === 'function') {
              const res = await remoteCommands.execute(sessionId, line, []);
              if (!res || res.ok === false) {
                return { ok: false, error: res?.error?.message || t('status.syncError') };
              }
              if (res.value === undefined) {
                return { ok: false, error: t('status.cmdMissing') };
              }
              if (res.value?.result?.kind === 'error') {
                return { ok: false, error: res.value.result.text || t('status.syncError') };
              }
              return { ok: true };
            }
            const binding = getCurrentBinding();
            if (binding?.session && typeof binding.session.command === 'function') {
              const res = await binding.session.command(line);
              if (!res || res.ok === false) {
                return { ok: false, error: res?.error?.message || t('status.syncError') };
              }
              if (res.value?.matched === false) {
                return { ok: false, error: t('status.cmdMissing') };
              }
              return { ok: true };
            }
            return { ok: false, error: t('status.noCommandChannel') };
          } catch (err) {
            return { ok: false, error: err?.message || String(err) };
          }
        };

        const sendPrompt = async text => {
          const binding = getCurrentBinding();
          if (binding?.session && typeof binding.session.prompt === 'function') {
            const res = await binding.session.prompt([{ type: 'text', text }], 'queue');
            if (!res || res.ok === false) {
              return { ok: false, error: res?.error?.message || t('status.syncError') };
            }
            return { ok: true };
          }
          return { ok: false, error: t('status.noPromptChannel') };
        };

        return {
          get projectionFace() {
            return getCurrentBinding()?.session?.projections?.faceOf?.('zhiming');
          },
          uiNavFace: nav.face,
          openStudio,
          autoOpenOnNew,
          executeZhiming,
          sendPrompt,
        };
      };

      // 1. Register Right Sidebar Tab Type + Body + Live Title
      ctx.inject(['sidebarRight', 'sidebarRightTabs'], scope => {
        scope.effect(() => scope.sidebarRightTabs.register({
          id: PLUGIN_ID,
          kind: TAB_KIND,
          multiple: false,
          priority: 'extension',
          title: () => t('tab.title'),
          guide: [{
            id: 'studio',
            order: 42,
            title: () => t('guide.title'),
            description: () => t('guide.description'),
            icon: Visuals.GuideArtworkSvg,
          }],
        }));

        scope.effect(() => scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
          name: 'sidebar.right.pane.tab',
          key: PLUGIN_ID,
          locale: NS,
          inject: sessionId => makeSessionHelpers(sessionId),
        }, ZhimingStudio)));

        scope.effect(() => scope.slots.inject('sidebar.right.pane.tab.title', () => scope.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: PLUGIN_ID,
          locale: NS,
          inject: sessionId => {
            const helpers = makeSessionHelpers(sessionId);
            return {
              get projectionFace() { return helpers.projectionFace; },
            };
          },
        }, Cards.ZhimingTabTitle)));
      });

      // 2. Register Composer Dock Pill
      ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
        name: 'conversation.composer.dock',
        id: 'dsh-zhiming-dock',
        order: 8,
        locale: NS,
        inject: sessionId => makeSessionHelpers(sessionId),
      }, Cards.ZhimingComposerDock)));

      // 3. Register Custom Inline Chat Tool Views (`zhiming_chart` & `zhiming_read`)
      ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
        name: 'tool.call.toolview',
        key: 'zhiming_chart',
        locale: NS,
        inject: sessionId => makeSessionHelpers(sessionId),
      }, Cards.ZhimingChartToolCard)));

      ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
        name: 'tool.call.toolview',
        key: 'zhiming_read',
        locale: NS,
        inject: sessionId => makeSessionHelpers(sessionId),
      }, Cards.ZhimingReadToolCard)));

      // 4. Register Custom Inline Chat Command View (`/zhiming`)
      ctx.effect(() => ctx.slots.inject('conversation.chat.commandview', () => ctx.slots.register({
        name: 'conversation.chat.commandview',
        key: 'zhiming',
        locale: NS,
        inject: sessionId => makeSessionHelpers(sessionId),
      }, Cards.ZhimingCommandCard)));
    },
  };
}

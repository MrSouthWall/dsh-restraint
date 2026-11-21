function createPluginEntry(React) {
  const h = React.createElement;
  const Visuals = {
    ...createVisuals(React),
    ...createStageVisuals(React),
    ...createDateTimeFields(React),
    ChoiceMenu: createChoiceMenu(React),
  };
  Visuals.BirthFields = createBirthFields(React, Visuals);
  const Views = {
    BaziView: createBaziView(React, Visuals),
    QimenView: createQimenView(React, Visuals),
    MeihuaView: createMeihuaView(React, Visuals),
    ZiweiView: createZiweiView(React, Visuals),
    HepanView: createHepanView(React, Visuals),
    TutorialView: createTutorialView(React, Visuals),
  };
  const ZhimingStudio = createStudioComponent(React, Visuals, Views, createBirthProfileStore());
  const Cards = createCompanionCards(React, Visuals);

  const PLUGIN_ID = '@local/dsh-zhiming';
  const TAB_KIND = 'zhiming';
  const WORKSPACE_SLOT = 'zhiming.workspace';
  const NS = 'zhiming';

  function ZhimingSidebarIcon({ size = 20 }) {
    return h('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.6,
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
      h('circle', { cx: 12, cy: 12, r: 8.75 }),
      h('path', { d: 'M15.8 8.2 13.9 13.9 8.2 15.8 10.1 10.1Z' }),
    );
  }

  function ZhimingWorkspace({ renderSlot }) {
    return h('div', { className: 'zm-workspace' }, renderSlot(WORKSPACE_SLOT, {}));
  }

  function ZhimingWorkspaceBody(props) {
    if (props.sessionId !== undefined) return h(ZhimingStudio, { ...props, key: props.sessionId });

    return h('section', { className: 'zm-workspace-empty' },
      h(Visuals.LuopanEmblem, { size: 44, spin: false }),
      h('h1', null, props.t('tab.title')),
      h('p', null, props.t('workspace.noSession')),
      h('button', { type: 'button', className: 'zm-btn', onClick: props.onReturnToConversation },
        props.t('workspace.openConversation')),
    );
  }

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

      // Use the native global panel list, then bind the workspace body to the current conversation.
      ctx.inject(['layout'], scope => {
        scope.effect(() => scope.slots.inject('main', function* () {
          yield scope.slots.register({
            name: 'main',
            key: PLUGIN_ID,
            children: { [WORKSPACE_SLOT]: { kind: 'single', scope: 'session-maybe' } },
          }, ZhimingWorkspace);

          yield scope.slots.register({
            name: WORKSPACE_SLOT,
            locale: NS,
            inject: sessionId => ({
              ...(sessionId === undefined ? {} : makeSessionHelpers(sessionId)),
              onReturnToConversation: () => scope.layout.selectPanel(null),
            }),
          }, ZhimingWorkspaceBody);
        }));

        scope.effect(() => scope.slots.inject('sidebar.panellist', () => scope.slots.register({
          name: 'sidebar.panellist',
          id: PLUGIN_ID,
          order: 15,
          label: () => t('tab.title'),
        }, ZhimingSidebarIcon)));
      });

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

      // 2. Register Custom Inline Chat Tool Views (`zhiming_chart` & `zhiming_read`)
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

      // 3. Register Custom Inline Chat Command View (`/zhiming`)
      ctx.effect(() => ctx.slots.inject('conversation.chat.commandview', () => ctx.slots.register({
        name: 'conversation.chat.commandview',
        key: 'zhiming',
        locale: NS,
        inject: sessionId => makeSessionHelpers(sessionId),
      }, Cards.ZhimingCommandCard)));
    },
  };
}

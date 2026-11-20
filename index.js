/**
 * Host half of @local/dsh-zhiming (知命 · 风水玄学罗盘插件).
 *
 * Exposes:
 *  - Session Projection (`zhiming`, wire.view pushed live to Client UI)
 *  - Agent Tools: `zhiming_chart`, `zhiming_read`, `zhiming_tutorial`
 *  - Slash Command: `/zhiming` (shared Host entrypoint for Client UI & human CLI/chat commands)
 *  - System Prompt Section: guides DeepSeek on bidirectional chart rendering & beginner-friendly readings
 */

import {
  castChart,
  lookupTutorial,
  formatChartForModel,
  VALID_SYSTEMS,
  DEMO_PRESETS,
} from './lib/engine/index.js';

export const inject = ['tools'];

const PROJECTION_KEY = 'zhiming';
const META_TAG = 'zhiming_chart_v1';
const CMD_PREFIX = 'ZHIMING_STATE:';
const MAX_CHARTS_PER_SESSION = 16;

function createEmptyState() {
  return {
    version: 1,
    activeChartId: null,
    activeSystem: 'tutorial',
    focusedPart: null,
    charts: [],
  };
}

function validateState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return createEmptyState();
  }
  const charts = Array.isArray(value.charts) ? value.charts.slice(0, MAX_CHARTS_PER_SESSION) : [];
  return {
    version: 1,
    activeChartId: typeof value.activeChartId === 'string' ? value.activeChartId : null,
    activeSystem: typeof value.activeSystem === 'string' ? value.activeSystem : 'tutorial',
    focusedPart: value.focusedPart ?? null,
    charts,
  };
}

const stateSchema = { parse: validateState };
const viewSchema = { parse: validateState };

function reduceEnvelope(state, envelope) {
  if (!envelope || typeof envelope !== 'object') return state;

  if (envelope.op === 'chart' && envelope.chart && typeof envelope.chart === 'object') {
    const chart = envelope.chart;
    const filtered = state.charts.filter(c => c && c.id !== chart.id);
    const nextCharts = [chart, ...filtered].slice(0, MAX_CHARTS_PER_SESSION);
    return {
      version: 1,
      activeChartId: chart.id,
      activeSystem: chart.system || state.activeSystem,
      focusedPart: envelope.focusedPart ?? null,
      charts: nextCharts,
    };
  }

  if (envelope.op === 'focus') {
    const nextChartId = typeof envelope.chartId === 'string' ? envelope.chartId : state.activeChartId;
    const matched = nextChartId ? state.charts.find(c => c.id === nextChartId) : null;
    const nextSystem = typeof envelope.system === 'string'
      ? envelope.system
      : (matched?.system || state.activeSystem);
    const nextFocus = envelope.focusedPart !== undefined ? envelope.focusedPart : state.focusedPart;
    if (
      nextChartId === state.activeChartId &&
      nextSystem === state.activeSystem &&
      JSON.stringify(nextFocus) === JSON.stringify(state.focusedPart)
    ) {
      return state;
    }
    return {
      version: 1,
      activeChartId: nextChartId,
      activeSystem: nextSystem,
      focusedPart: nextFocus,
      charts: state.charts,
    };
  }

  if (envelope.op === 'clear') {
    if (state.charts.length === 0 && state.activeChartId === null) return state;
    return createEmptyState();
  }

  return state;
}

export const zhimingProjectionDefinition = {
  key: PROJECTION_KEY,
  stateVersion: 1,
  stateSchema,
  init() {
    return createEmptyState();
  },
  apply(state, event) {
    if (!event || typeof event !== 'object') return state;

    // 1. Fold DeepSeek tool call results (`zhiming_chart`)
    if (event.type === 'tool/result') {
      const meta = event.data?.meta;
      if (meta && typeof meta === 'object' && meta._zhiming === META_TAG) {
        return reduceEnvelope(state, meta);
      }
      return state;
    }

    // 2. Fold Client UI & human slash command results (`/zhiming`)
    if (event.type === 'command/done' && event.data?.kind === 'success') {
      const text = event.data?.text;
      if (typeof text === 'string' && text.startsWith(CMD_PREFIX)) {
        try {
          const envelope = JSON.parse(text.slice(CMD_PREFIX.length));
          return reduceEnvelope(state, envelope);
        } catch {
          return state;
        }
      }
      return state;
    }

    return state;
  },
  wire: {
    viewSchema,
    view(state) {
      return state;
    },
    summary: false,
  },
};

function parseHumanSlashArgs(rawInput) {
  const trimmed = String(rawInput || '').trim();
  if (!trimmed) {
    return { op: 'demo', system: 'bazi' };
  }
  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed);
  }
  const parts = trimmed.split(/\s+/);
  const head = parts[0].toLowerCase();

  if (head === 'help' || head === 'tutorial' || head === '?') {
    return { op: 'help' };
  }
  if (head === 'demo') {
    const sys = (parts[1] || 'bazi').toLowerCase();
    return { op: 'demo', system: VALID_SYSTEMS.includes(sys) ? sys : 'bazi' };
  }
  if (head === 'clear') {
    return { op: 'clear' };
  }
  if (head === 'bazi' || head === 'ziwei') {
    if (!parts[1]) {
      return { op: 'demo', system: head };
    }
    return {
      op: 'cast',
      params: {
        system: head,
        date: parts[1],
        time: parts[2] || '12:00',
        gender: parts[3] || 'male',
        question: parts.slice(4).join(' '),
      },
    };
  }
  if (head === 'qimen') {
    return {
      op: 'cast',
      params: {
        system: 'qimen',
        date: parts[1] && /^\d{4}-\d{1,2}-\d{1,2}$/.test(parts[1]) ? parts[1] : undefined,
        time: parts[2] && /^\d{1,2}:\d{1,2}$/.test(parts[2]) ? parts[2] : undefined,
        question: parts[1] && !/^\d{4}-/.test(parts[1]) ? parts.slice(1).join(' ') : parts.slice(3).join(' '),
      },
    };
  }
  if (head === 'meihua') {
    const n1 = Number(parts[1]);
    const n2 = Number(parts[2]);
    if (Number.isFinite(n1) && Number.isFinite(n2)) {
      return {
        op: 'cast',
        params: {
          system: 'meihua',
          method: 'numbers',
          num1: n1,
          num2: n2,
          question: parts.slice(3).join(' '),
        },
      };
    }
    if (parts[1]) {
      return {
        op: 'cast',
        params: {
          system: 'meihua',
          method: 'text',
          text: parts.slice(1).join(' '),
          question: parts.slice(1).join(' '),
        },
      };
    }
    return { op: 'cast', params: { system: 'meihua', method: 'time' } };
  }
  if (head === 'hepan') {
    return { op: 'demo', system: 'hepan' };
  }
  return { op: 'cast', params: { system: 'meihua', method: 'text', text: trimmed, question: trimmed } };
}

export function apply(ctx) {
  let projectionHandle = null;
  const fallbackCache = new WeakMap();

  const readStateForSession = session => {
    if (session && projectionHandle) {
      try {
        return projectionHandle.stateOf(session);
      } catch {
        // Fall through to cache when session is synthetic
      }
    }
    if (session && fallbackCache.has(session)) {
      return fallbackCache.get(session);
    }
    return createEmptyState();
  };

  const rememberFallback = (session, envelope) => {
    if (!session) return;
    const prev = fallbackCache.get(session) || createEmptyState();
    fallbackCache.set(session, reduceEnvelope(prev, envelope));
  };

  // 1. Register Session Projection (durable single source of truth pushed live to Client UI)
  ctx.inject(['sessionProjections'], scope => {
    scope.effect(() => {
      let disposed = false;
      const regPromise = scope.sessionProjections.register(zhimingProjectionDefinition);
      void Promise.resolve(regPromise).then(handle => {
        if (disposed) {
          if (handle && typeof handle.dispose === 'function') void handle.dispose();
          return;
        }
        projectionHandle = handle;
      }).catch(err => {
        scope.get?.('logger')?.warn?.('dsh-zhiming: failed to register session projection', err);
      });
      return () => {
        disposed = true;
        const current = projectionHandle;
        projectionHandle = null;
        if (current && typeof current.dispose === 'function') {
          return current.dispose();
        }
      };
    });
  });

  // 2. Register System Prompt guidance for DeepSeek
  ctx.inject(['systemPrompt'], scope => {
    scope.effect(() => scope.systemPrompt.section({
      name: 'dsh-zhiming',
      order: 65,
      interpolate: false,
      text: [
        '## 知命 · 风水玄学罗盘插件（ZhiMing Studio）',
        '你已接入「知命」可视化风水玄学插件，支持五种体系：四柱八字（bazi）、奇门遁甲（qimen）、梅花易数（meihua）、紫微斗数（ziwei）、双人合盘（hepan）。',
        '- 当用户要求排盘、起卦、合盘或查看上述任一体系时，务必调用 `zhiming_chart` 工具将准确结果同步呈现在插件罗盘界面上，切勿手算干支星曜。若用户未提供出生日期而要求排八字/紫微/合盘，先礼貌询问或征得同意后用 `useDemo: true` 演示。',
        '- 当用户要求解读插件中的盘面或某个具体宫位/柱位/卦象时，务必先调用 `zhiming_read` 读取真实数据（若消息中带有盘面 ID，使用 `action: "by_id"` 精准定位；若不确定看哪份盘，先用 `action: "list"` 或 `action: "current"`）。',
        '- 默认用户为新手：解读时先给清晰总论，再拆解关键符号并用通俗白话解释专业术语（如喜用神、值符、体用、三方四正、四化），最后给出务实、积极的行动或家居风水建议；以传统文化与自我探索视角交流，避免宿命论恐吓。',
      ].join('\n'),
    }));
  });

  // 3. Register Agent Tools (DeepSeek <-> Plugin bidirectional bridge)
  ctx.effect(() => {
    const disposeChart = ctx.tools.register({
      name: 'zhiming_chart',
      description: 'Calculate and display a Feng Shui / Chinese metaphysics chart on the ZhiMing interactive plugin UI. Supports five systems: bazi (四柱八字), qimen (奇门遁甲), meihua (梅花易数), ziwei (紫微斗数), and hepan (双人合盘).',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['system'],
        properties: {
          system: {
            type: 'string',
            enum: ['bazi', 'qimen', 'meihua', 'ziwei', 'hepan'],
            description: 'Which system to cast: bazi, qimen, meihua, ziwei, or hepan.',
          },
          useDemo: {
            type: 'boolean',
            description: 'Set true to load the built-in beginner demo case for the chosen system.',
          },
          name: {
            type: 'string',
            description: 'Optional label or person name for bazi/ziwei.',
          },
          date: {
            type: 'string',
            description: 'Date in YYYY-MM-DD format (defaults to current date for qimen/meihua).',
          },
          time: {
            type: 'string',
            description: 'Time in HH:MM 24-hour format (defaults to current time).',
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', '男', '女'],
            description: 'Gender for bazi/ziwei (male/男 or female/女).',
          },
          calendar: {
            type: 'string',
            enum: ['solar', 'lunar'],
            description: 'Calendar type of the input date: solar (公历, default) or lunar (农历).',
          },
          isLeapMonth: {
            type: 'boolean',
            description: 'Only when calendar is lunar: true if the birth month is a leap month (闰月).',
          },
          longitude: {
            type: 'number',
            description: 'Optional birthplace east longitude in degrees (e.g. 116.4) for True Solar Time adjustment.',
          },
          question: {
            type: 'string',
            description: 'The user question or decision topic associated with this reading.',
          },
          method: {
            type: 'string',
            enum: ['time', 'numbers', 'text', 'random'],
            description: 'For meihua only: casting method (time, numbers, text, or random).',
          },
          num1: {
            type: 'integer',
            description: 'For meihua with method=numbers: first integer (upper trigram).',
          },
          num2: {
            type: 'integer',
            description: 'For meihua with method=numbers: second integer (lower trigram).',
          },
          num3: {
            type: 'integer',
            description: 'For meihua with method=numbers: optional third integer for moving line.',
          },
          text: {
            type: 'string',
            description: 'For meihua with method=text: word or phrase used to derive the hexagram.',
          },
          relation: {
            type: 'string',
            enum: ['love', 'business', 'family'],
            description: 'For hepan only: love (恋爱婚姻), business (事业合伙), or family (挚友亲子).',
          },
          personA: {
            type: 'object',
            additionalProperties: false,
            description: 'For hepan only: first person birth info.',
            properties: {
              name: { type: 'string', description: 'Display name or role.' },
              date: { type: 'string', description: 'YYYY-MM-DD' },
              time: { type: 'string', description: 'HH:MM' },
              gender: { type: 'string', enum: ['male', 'female', '男', '女'] },
              calendar: { type: 'string', enum: ['solar', 'lunar'] },
            },
          },
          personB: {
            type: 'object',
            additionalProperties: false,
            description: 'For hepan only: second person birth info.',
            properties: {
              name: { type: 'string', description: 'Display name or role.' },
              date: { type: 'string', description: 'YYYY-MM-DD' },
              time: { type: 'string', description: 'HH:MM' },
              gender: { type: 'string', enum: ['male', 'female', '男', '女'] },
              calendar: { type: 'string', enum: ['solar', 'lunar'] },
            },
          },
        },
      },
      output: {
        schema: { type: 'object', additionalProperties: true },
        render(_args, value) {
          return [{
            type: 'text',
            text: `${value.markdown}\n\n（该盘面已实时同步到「知命罗盘」可视化界面，用户可在右侧面板中交互查看各宫位/柱位详情。）`,
          }];
        },
        presentationMeta(_args, value) {
          return {
            _zhiming: META_TAG,
            op: 'chart',
            chart: value.chart,
            focusedPart: null,
          };
        },
      },
      async execute(args, exec) {
        const chart = castChart(args);
        const markdown = formatChartForModel(chart);
        rememberFallback(exec?.agent?.session, { op: 'chart', chart, focusedPart: null });
        return { chart, markdown };
      },
    });

    const disposeRead = ctx.tools.register({
      name: 'zhiming_read',
      description: 'Read live chart data currently displayed in the ZhiMing plugin UI (including charts cast interactively by the user, the currently focused palace/pillar/hexagram, and session chart history) so you can interpret its Feng Shui meaning.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: {
            type: 'string',
            enum: ['current', 'list', 'by_id'],
            description: 'current (default): read the active chart and focused element; list: list saved charts in this session; by_id: read a specific chart by chartId.',
          },
          chartId: {
            type: 'string',
            description: 'Required when action is by_id.',
          },
        },
      },
      output: {
        schema: { type: 'object', additionalProperties: true },
        render(_args, value) {
          return [{ type: 'text', text: value.text }];
        },
      },
      async execute(args, exec) {
        const action = args?.action || 'current';
        const state = readStateForSession(exec?.agent?.session);

        if (action === 'list') {
          if (state.charts.length === 0) {
            return {
              count: 0,
              charts: [],
              text: '当前会话的「知命罗盘」插件中还没有已排好的盘面。你可以询问用户的生辰/问题并调用 `zhiming_chart` 排盘，或引导用户在右侧「知命罗盘」面板中操作。',
            };
          }
          const summaryList = state.charts.map((c, i) => ({
            index: i + 1,
            id: c.id,
            system: c.system,
            title: c.title,
            subtitle: c.subtitle,
            active: c.id === state.activeChartId,
          }));
          const text = [
            `当前会话「知命罗盘」共有 ${state.charts.length} 份盘面：`,
            ...summaryList.map(item => `${item.index}. ${item.active ? '[当前查看] ' : ''}${item.title}（${item.subtitle}，id: ${item.id}）`),
          ].join('\n');
          return { count: state.charts.length, activeChartId: state.activeChartId, charts: summaryList, text };
        }

        const targetChart = action === 'by_id' && args?.chartId
          ? state.charts.find(c => c.id === args.chartId)
          : (state.charts.find(c => c.id === state.activeChartId) || state.charts[0] || null);

        if (!targetChart) {
          return {
            found: false,
            activeSystem: state.activeSystem,
            text: '当前「知命罗盘」插件中尚未排盘。请向用户确认想要测算的体系（八字/奇门/梅花/紫微/合盘）及必要信息，或调用 `zhiming_chart`（可设 `useDemo: true` 演示）。',
          };
        }

        const focusedPart = targetChart.id === state.activeChartId ? state.focusedPart : null;
        return {
          found: true,
          activeChartId: state.activeChartId,
          activeSystem: state.activeSystem,
          focusedPart,
          chart: targetChart,
          text: formatChartForModel(targetChart, focusedPart),
        };
      },
    });

    const disposeTutorial = ctx.tools.register({
      name: 'zhiming_tutorial',
      description: 'Look up beginner-friendly tutorials for the 5 Feng Shui / Chinese metaphysics systems or plain-language definitions of technical terms (e.g. 喜用神, 值符, 体用, 三方四正, 化忌, 门迫).',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          topic: {
            type: 'string',
            description: 'System id (overview, bazi, qimen, meihua, ziwei, hepan) or a Chinese metaphysics term to explain.',
          },
        },
      },
      output: {
        schema: { type: 'object', additionalProperties: true },
        render(_args, value) {
          return [{ type: 'text', text: JSON.stringify(value, null, 2) }];
        },
      },
      async execute(args) {
        return lookupTutorial(args?.topic || 'overview');
      },
    });

    return () => {
      disposeChart();
      disposeRead();
      disposeTutorial();
    };
  });

  // 4. Register shared `/zhiming` Host command (called by both Client UI and human `/zhiming` slash commands)
  ctx.inject(['commands'], scope => {
    scope.effect(() => scope.commands.register({
      name: 'zhiming',
      description: '知命风水罗盘排盘与同步指令（支持 bazi / qimen / meihua / ziwei / hepan / demo）',
      input: { hint: 'bazi 1995-05-18 08:30 男 | qimen | meihua 3 7 | ziwei 1998-03-12 21:30 女 | demo bazi' },
      recordInput: false,
      handler({ agent, rawInput }) {
        try {
          const payload = parseHumanSlashArgs(rawInput);
          const session = agent?.session;

          if (payload.op === 'help') {
            return {
              kind: 'success',
              text: [
                '知命 · 风水玄学罗盘指令用法：',
                '• /zhiming demo bazi|qimen|meihua|ziwei|hepan — 一键加载新手演示盘',
                '• /zhiming bazi 1995-05-18 08:30 男 — 排四柱八字',
                '• /zhiming qimen [2026-11-20 12:00] [所问事项] — 起时家拆补奇门局',
                '• /zhiming meihua 3 7 [问题] — 报数起梅花易数卦（或 /zhiming meihua 关键词）',
                '• /zhiming ziwei 1998-03-12 21:30 女 — 排紫微斗数十二宫',
                '• /zhiming clear — 清空当前会话历史盘面',
              ].join('\n'),
            };
          }

          if (payload.op === 'clear') {
            const env = { op: 'clear' };
            rememberFallback(session, env);
            return { kind: 'success', text: CMD_PREFIX + JSON.stringify(env) };
          }

          if (payload.op === 'focus') {
            const env = {
              op: 'focus',
              chartId: payload.chartId || null,
              system: payload.system || null,
              focusedPart: payload.focusedPart ?? null,
            };
            rememberFallback(session, env);
            return { kind: 'success', text: CMD_PREFIX + JSON.stringify(env) };
          }

          if (payload.op === 'demo') {
            const sys = VALID_SYSTEMS.includes(payload.system) ? payload.system : 'bazi';
            const chart = castChart({ ...DEMO_PRESETS[sys] });
            const env = { op: 'chart', chart, focusedPart: null };
            rememberFallback(session, env);
            return { kind: 'success', text: CMD_PREFIX + JSON.stringify(env) };
          }

          const chart = castChart(payload.params || payload);
          const env = { op: 'chart', chart, focusedPart: null };
          rememberFallback(session, env);
          return { kind: 'success', text: CMD_PREFIX + JSON.stringify(env) };
        } catch (err) {
          return {
            kind: 'error',
            text: `知命排盘失败：${err instanceof Error ? err.message : String(err)}`,
          };
        }
      },
    }));
  });
}

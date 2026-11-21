/**
 * Restraint prompt guidance policy.
 *
 * The plugin's tools are always registered, but its system-prompt guidance is
 * contextual: a session only sees the metaphysics instructions once it shows a
 * metaphysics intent (a cast chart exists, or the human asked for one). Fresh,
 * unrelated conversations therefore get no fortune-telling framing at all.
 */

/** Instruction block shown only inside a metaphysics context. */
export const ZHIMING_GUIDANCE = [
  '## 虚白罗盘工具（Restraint，仅在命理语境下使用）',
  '本会话装有虚白插件工具：`zhiming_chart`（排盘）、`zhiming_read`（读取界面上的真实盘面）、`zhiming_tutorial`（术语与入门解释）。',
  '只有当用户明确要求排盘、起卦、合盘，或要求解读命理盘面时，才进入命理语境。其余任何话题（写代码、写作、数据分析、日常问答等）都不要提及算命、玄学、风水、命盘或本插件，也不要主动提供命理建议。',
  '- 排盘一律调用 `zhiming_chart`，不要手算干支、星曜或卦象。',
  '- 解读盘面前先调用 `zhiming_read` 读取真实数据（有盘面 ID 用 `action: "by_id"`，不确定看哪份盘用 `list` 或 `current`），并引用实际宫位、干支、卦辞与传统取法。',
  '- 缺出生日期时先询问；用户同意后才用 `useDemo: true` 演示。以用户最新确认的出生时间为准（盘面标注「出生时间（北京时间 UTC+8）」），需要时另行说明真太阳时换算。',
  '- 合盘分数、应期与现实结果只在有可追溯资料时给出；盘面标记为旧版时，先请用户提供原始资料重排。',
].join('\n');

/**
 * Terms that put a conversation into a metaphysics context. Kept deliberately
 * broad: a false positive only enables the guarded guidance above, while a
 * false negative would hide the guidance exactly when it is needed.
 */
const ZHIMING_TOPIC = new RegExp([
  '八字', '四柱', '命盘', '命理', '紫微', '斗数', '奇门', '遁甲', '梅花易', '易数',
  '起卦', '六爻', '占卜', '占卦', '卦象', '变卦', '解卦', '排盘', '合盘', '合婚',
  '罗盘', '风水', '玄学', '算命', '批命', '看相', '择日', '流年', '大运', '小运',
  '干支', '天干', '地支', '日主', '月令', '藏干', '喜用神', '用神', '化忌', '四化',
  '值符', '值使', '体用', '纳音', '神煞', '卦',
  'bazi', 'ziwei', 'qimen', 'meihua', 'hepan', 'feng shui', 'fengshui',
].join('|'), 'i');

/** Read the text of one user message without assuming a single block shape. */
export function messageText(message) {
  const content = message?.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map(part => (typeof part === 'string' ? part : (typeof part?.text === 'string' ? part.text : '')))
    .filter(Boolean)
    .join('\n');
}

/** Whether a human message asks for something this plugin covers. */
export function mentionsZhimingTopic(message) {
  if (!message || typeof message !== 'object') return false;
  const source = message.source;
  if (source && typeof source === 'object' && typeof source.kind === 'string' && source.kind !== 'user') {
    return false;
  }
  return ZHIMING_TOPIC.test(messageText(message));
}

/** Whether any human message of a batch mentions the plugin's subject matter. */
export function batchMentionsZhimingTopic(messages) {
  if (!Array.isArray(messages)) return false;
  return messages.some(mentionsZhimingTopic);
}

/**
 * Decide the prompt contribution for one session.
 * @param {{ hasChart: boolean, armed: boolean }} input
 * @returns {string} the guidance block, or '' when the session has no metaphysics context
 */
export function guidanceForSession({ hasChart, armed }) {
  return hasChart || armed ? ZHIMING_GUIDANCE : '';
}

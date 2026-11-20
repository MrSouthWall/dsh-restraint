function createTutorialView(React, Visuals) {
  const h = React.createElement;
  const { WuXingPentagonSvg, CelestialBackdropSvg, FlyingStarsAltarSvg, getFlyingStarsForYear } = Visuals;

  return function TutorialView({ isDark, busy, onSelectTab, onDemo, onAskDeepSeek, t }) {
    const [activeSection, setActiveSection] = React.useState('flyingstars');
    const [selectedEl, setSelectedEl] = React.useState('木');
    const [searchTerm, setSearchTerm] = React.useState('');
    const currentYear = new Date().getFullYear();
    const [fsYear, setFsYear] = React.useState(currentYear);
    const [selectedFsPalace, setSelectedFsPalace] = React.useState(4);

    const trimmedQuery = searchTerm.trim();
    const filteredGlossary = CLIENT_TUTORIAL_DATA.glossary.filter(([term, desc]) => {
      if (!trimmedQuery) return true;
      return term.includes(trimmedQuery) || desc.includes(trimmedQuery);
    });

    const flyingStars = React.useMemo(() => getFlyingStarsForYear(fsYear), [fsYear]);
    const activeFsCell = flyingStars.find(f => f.palaceNum === selectedFsPalace) || flyingStars[0];

    return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      // Sleek Section Switcher
      h('div', { style: { display: 'flex', justifyContent: 'center' } },
        h('div', { className: 'zm-stage-tabs', role: 'tablist', style: { flexWrap: 'wrap', justifyContent: 'center' } },
          ...[
            ['flyingstars', '九宫飞星罗盘'],
            ['quickstart', '快速体验'],
            ['systems', '五大术数'],
            ['basics', '五行时辰'],
            ['glossary', '白话词典'],
          ].map(([id, label]) => h('button', {
            key: id, type: 'button', role: 'tab', 'aria-selected': activeSection === id,
            className: `zm-stage-tab ${activeSection === id ? 'zm-on' : ''}`,
            onClick: () => setActiveSection(id),
          }, label)),
        ),
      ),

      // Section 1: Monumental XuanKong Annual Nine Flying Stars Octagonal Altar
      activeSection === 'flyingstars' ? h(React.Fragment, null,
        h('div', { className: 'zm-canvas' },
          h(CelestialBackdropSvg, { isDark }),
          h('div', { className: 'zm-canvas-bar' },
            h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, `${fsYear} 玄空流年九宫飞星`),
            h('div', { className: 'zm-stage-tabs', role: 'tablist' },
              ...[currentYear - 1, currentYear, currentYear + 1].map(y => h('button', {
                key: y, type: 'button', role: 'tab', 'aria-selected': fsYear === y,
                className: `zm-stage-tab ${fsYear === y ? 'zm-on' : ''}`,
                onClick: () => setFsYear(y),
              }, `${y}年`)),
            ),
          ),
          h('div', { className: 'zm-canvas-artwork' },
            h(FlyingStarsAltarSvg, {
              flyingStars,
              year: fsYear,
              isDark,
              selectedPalaceNum: selectedFsPalace,
              onSelectPalace: setSelectedFsPalace,
            }),
          ),
        ),
        activeFsCell ? h('div', { className: 'zm-card' },
          h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
            h('span', null, `${fsYear}年 · ${activeFsCell.direction} · ${activeFsCell.name}（${activeFsCell.tag}）`),
            h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
              onClick: () => onAskDeepSeek(`请结合 ${fsYear} 年流年九宫飞星中「${activeFsCell.direction}方飞临${activeFsCell.name}（${activeFsCell.tag}）」，用新手易操作的白话告诉我客厅、卧室或办公桌在这个方位具体怎么布置最加分？`),
            }, '✦ 问 DeepSeek'),
          ),
          h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, activeFsCell.tip),
        ) : null,
      ) : null,

      // Section 2: One-Click DeepSeek & Demo Prompts
      activeSection === 'quickstart' ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title' }, h('span', null, '一键体验五大星台或对话 DeepSeek 排盘')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
          ...CLIENT_TUTORIAL_DATA.quickPrompts.map((item, i) => h('div', {
            key: i,
            style: {
              padding: '8px 10px', borderRadius: 9, border: '1px solid var(--zm-border)',
              background: 'var(--zm-bg)', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: 8, flexWrap: 'wrap',
            },
          },
            h('div', { style: { flex: 1, minWidth: 160 } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 } },
                h('span', { className: 'zm-chip', style: { color: 'var(--zm-gold)' } }, item.tag),
                h('strong', { style: { fontSize: 12 } }, item.title),
              ),
              h('div', { className: 'zm-muted' }, `“${item.prompt}”`),
            ),
            h('div', { style: { display: 'flex', gap: 5 } },
              h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo(item.system) }, t('action.demo')),
              h('button', { type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', onClick: () => onAskDeepSeek(item.prompt) }, t('action.tryPrompt')),
            ),
          )),
        ),
      ) : null,

      // Section 3: 5 Systems Guide
      activeSection === 'systems' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        ...CLIENT_TUTORIAL_DATA.systemGuide.map(sys => h('div', { key: sys.id, className: 'zm-card' },
          h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
            h('span', null, sys.name),
            h('div', { style: { display: 'flex', gap: 5 } },
              h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => onSelectTab(sys.id) }, '进入'),
              h('button', { type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy, onClick: () => onDemo(sys.id) }, t('action.demo')),
            ),
          ),
          h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 3 } }, `${sys.scene}（准备：${sys.need}）`),
          h('div', { className: 'zm-muted' }, sys.keyTip),
        )),
      ) : null,

      // Section 4: Interactive Five Elements & 12 Shichen
      activeSection === 'basics' ? h(React.Fragment, null,
        h('div', { className: 'zm-card' },
          h('div', { className: 'zm-card-title' }, h('span', null, '五行生克图解')),
          h('div', { className: 'zm-wuxing-grid' },
            h(WuXingPentagonSvg, {
              percentages: { 木: 24, 火: 24, 土: 24, 金: 24, 水: 24 },
              selectedElement: selectedEl,
              onSelectElement: el => setSelectedEl(el),
            }),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--zm-text-sub)' } },
              h('strong', { style: { color: WUXING_STYLE[selectedEl].color } }, `${WUXING_STYLE[selectedEl].label}（${WUXING_STYLE[selectedEl].dir}）`),
              h('div', null, WUXING_STYLE[selectedEl].trait),
              h('div', { className: 'zm-muted' }, '相生：木→火→土→金→水→木'),
              h('div', { className: 'zm-muted' }, '相克：木→土→水→火→金→木'),
            ),
          ),
        ),
        h('div', { className: 'zm-card' },
          h('div', { className: 'zm-card-title' }, h('span', null, '十二时辰对照表')),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 5 } },
            ...CLIENT_TUTORIAL_DATA.shichenTable.map(([name, range, el, zodiac]) => h('div', {
              key: name,
              style: { padding: '5px 7px', borderRadius: 8, border: '1px solid var(--zm-border)', background: 'var(--zm-bg)', fontSize: 11 },
            },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 700 } },
                h('span', null, `${name}·${zodiac}`),
                h('span', { style: { color: WUXING_STYLE[el].color } }, el),
              ),
              h('div', { className: 'zm-muted', style: { fontSize: 10 } }, range),
            )),
          ),
        ),
      ) : null,

      // Section 5: Searchable Glossary
      activeSection === 'glossary' ? h('div', { className: 'zm-card' },
        h('div', { className: 'zm-card-title' },
          h('span', null, '玄学术语白话词典'),
          h('input', {
            className: 'zm-input',
            style: { width: 145, padding: '4px 8px' },
            placeholder: t('form.searchGlossary'),
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
          }),
        ),
        filteredGlossary.length === 0 ? h('div', { className: 'zm-tip-banner', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          h('span', null, `${t('glossary.empty')}「${trimmedQuery}」`),
          h('button', {
            type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
            onClick: () => onAskDeepSeek(`请用生活中通俗易懂的比喻，给我详细讲讲风水命理中的「${trimmedQuery}」是什么意思？`),
          }, t('dock.ask')),
        ) : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
          ...filteredGlossary.map(([term, desc]) => h('div', {
            key: term,
            style: {
              padding: '7px 9px', borderRadius: 8, border: '1px solid var(--zm-border)',
              background: 'var(--zm-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
            },
          },
            h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
              h('strong', { style: { color: 'var(--zm-gold)' } }, `${term}：`),
              desc,
            ),
            h('button', {
              type: 'button', className: 'zm-btn zm-btn-sm',
              onClick: () => onAskDeepSeek(`请用生活中通俗易懂的比喻，给我详细讲讲风水命理中的「${term}」是什么意思？`),
            }, t('dock.ask')),
          )),
        ),
      ) : null,
    );
  };
}

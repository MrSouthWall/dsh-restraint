function createChoiceMenu(React) {
  const h = React.createElement;
  const menuGap = 6;
  const edgeGap = 8;
  const maxMenuHeight = 260;

  function positionMenu(trigger, menu, compact, optionCount) {
    const anchor = trigger.getBoundingClientRect();
    const viewport = trigger.ownerDocument.documentElement;
    const pane = trigger.closest('dialog, .zm-root').getBoundingClientRect();
    const leftEdge = Math.max(0, pane.left) + edgeGap;
    const rightEdge = Math.min(viewport.clientWidth, pane.right) - edgeGap;
    const width = Math.min(Math.max(anchor.width, compact ? 240 : 172), rightEdge - leftEdge);
    const left = compact ? anchor.right - width : anchor.left;
    const above = anchor.top - Math.max(0, pane.top) - menuGap - edgeGap;
    const below = Math.min(viewport.clientHeight, pane.bottom) - anchor.bottom - menuGap - edgeGap;
    const preferredHeight = Math.min(maxMenuHeight, optionCount * 34 + 10);
    const opensAbove = below < preferredHeight && above > below;

    menu.style.width = `${width}px`;
    menu.style.left = `${Math.max(leftEdge, Math.min(left, rightEdge - width))}px`;
    menu.style.maxHeight = `${Math.min(maxMenuHeight, opensAbove ? above : below)}px`;
    menu.style.top = opensAbove ? 'auto' : `${anchor.bottom + menuGap}px`;
    menu.style.bottom = opensAbove ? `${viewport.clientHeight - anchor.top + menuGap}px` : 'auto';
  }

  return function ChoiceMenu({ label, value, options, onChange, placeholder, compact = false }) {
    const id = React.useId();
    const triggerId = `${id}-trigger`;
    const menuId = `${id}-menu`;
    const triggerRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const searchRef = React.useRef({ text: '', time: 0 });
    const [activeIndex, setActiveIndex] = React.useState(null);
    const open = activeIndex !== null;
    const selectedIndex = options.findIndex(option => option.value === value);
    const selectedLabel = options[selectedIndex]?.label;

    const closeMenu = React.useCallback(() => {
      if (menuRef.current?.matches(':popover-open')) menuRef.current.hidePopover();
      searchRef.current = { text: '', time: 0 };
      setActiveIndex(null);
    }, []);

    React.useEffect(() => {
      if (!open) return;
      if (options.length === 0) {
        closeMenu();
        return;
      }
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      const doc = trigger.ownerDocument;
      const win = doc.defaultView;
      const reposition = () => positionMenu(trigger, menu, compact, options.length);
      const dismissOutside = event => {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) closeMenu();
      };
      const dismissOnScroll = event => {
        if (event.target !== menu) closeMenu();
      };
      doc.addEventListener('pointerdown', dismissOutside, true);
      doc.addEventListener('scroll', dismissOnScroll, true);
      win.addEventListener('resize', reposition);
      return () => {
        doc.removeEventListener('pointerdown', dismissOutside, true);
        doc.removeEventListener('scroll', dismissOnScroll, true);
        win.removeEventListener('resize', reposition);
      };
    }, [open, closeMenu, compact, options.length]);

    function highlight(index) {
      setActiveIndex(index);
      const menu = menuRef.current;
      const row = menu.children[index];
      const bounds = menu.getBoundingClientRect();
      const item = row.getBoundingClientRect();
      const inset = 4;
      if (item.top < bounds.top + inset) menu.scrollTop -= bounds.top + inset - item.top;
      else if (item.bottom > bounds.bottom - inset) menu.scrollTop += item.bottom - bounds.bottom + inset;
    }

    function openMenu(index) {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      trigger.focus({ preventScroll: true });
      positionMenu(trigger, menu, compact, options.length);
      menu.showPopover();
      highlight(index);
    }

    function choose(index) {
      const option = options[index];
      closeMenu();
      if (option && option.value !== value) onChange(option.value);
    }

    function handleKeyDown(event) {
      const key = event.key;
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        const step = key === 'ArrowDown' ? 1 : -1;
        if (open) highlight(Math.min(options.length - 1, Math.max(0, activeIndex + step)));
        else openMenu(selectedIndex < 0 && step < 0 ? options.length - 1 : Math.max(0, selectedIndex));
      } else if (open && (key === 'Home' || key === 'End')) {
        event.preventDefault();
        highlight(key === 'Home' ? 0 : options.length - 1);
      } else if (open && (key === 'Enter' || key === ' ')) {
        event.preventDefault();
        choose(activeIndex);
      } else if (open && key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
      } else if (open && key === 'Tab') {
        closeMenu();
      } else if (key.length === 1 && key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const now = Date.now();
        const previous = searchRef.current;
        const text = (now - previous.time < 650 ? previous.text + key : key).toLocaleLowerCase();
        searchRef.current = { text, time: now };
        const index = options.findIndex(option => option.label.toLocaleLowerCase().startsWith(text));
        if (index >= 0) {
          event.preventDefault();
          if (open) highlight(index);
          else openMenu(index);
        }
      }
    }

    return h('div', { className: compact ? 'zm-history-select' : 'zm-field' },
      compact ? null : h('label', { htmlFor: triggerId }, label),
      h('button', {
        id: triggerId,
        ref: triggerRef,
        type: 'button',
        role: 'combobox',
        className: 'zm-select',
        disabled: options.length === 0,
        title: compact ? selectedLabel : undefined,
        'aria-label': compact ? label : undefined,
        'aria-expanded': open,
        'aria-controls': menuId,
        'aria-activedescendant': open ? `${menuId}-${activeIndex}` : undefined,
        onClick: () => open ? closeMenu() : openMenu(Math.max(0, selectedIndex)),
        onKeyDown: handleKeyDown,
        onBlur: closeMenu,
      },
        h('span', { className: 'zm-select-value' }, selectedLabel ?? placeholder),
        h('svg', { className: 'zm-select-chevron', width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': true },
          h('path', { d: 'M3 5.25 7 9.25l4-4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        ),
      ),
      h('div', { id: menuId, className: 'zm-choice-menu', ref: menuRef, popover: 'manual', role: 'listbox', 'aria-label': label },
        ...options.map((option, index) => h('div', {
          key: option.value,
          id: `${menuId}-${index}`,
          className: 'zm-choice-option',
          role: 'option',
          'aria-selected': index === selectedIndex,
          'data-active': open && index === activeIndex ? '' : undefined,
          onPointerMove: () => setActiveIndex(index),
          onMouseDown: event => event.preventDefault(),
          onClick: () => choose(index),
        },
          h('span', null, option.label),
          index === selectedIndex ? h('svg', { width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': true },
            h('path', { d: 'm3 7 2.5 2.5L11 4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
          ) : null,
        )),
      ),
    );
  };
}

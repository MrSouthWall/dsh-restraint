function currentBeijingISO() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
}

function createDateTimeFields(React) {
  const h = React.createElement;
  const minYear = 1901;
  const maxYear = 2099;
  const dayAt = (year, month, day) => new Date(Date.UTC(year, month, day));
  const firstDay = dayAt(minYear, 0, 1);
  const lastDay = dayAt(maxYear, 11, 31);
  const dateValue = day => day.toISOString().slice(0, 10);
  const twoDigits = value => String(value).padStart(2, '0');
  const clockPattern = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
  const icons = {
    date: 'M3.5 5.5h13v11h-13zM3.5 8.5h13M7 3.5v3.75m6-3.75v3.75',
    time: 'M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM10 6.5V10l2.5 1.5',
    prev: 'm12 5.5-4.5 4.5 4.5 4.5',
    next: 'm8 5.5 4.5 4.5L8 14.5',
    down: 'm5.5 8 4.5 4.5L14.5 8',
  };

  function Icon({ name, size = 16 }) {
    return h('svg', { width: size, height: size, viewBox: '0 0 20 20', 'aria-hidden': true },
      h('path', { d: icons[name], fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    );
  }

  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const day = new Date(`${value}T00:00:00Z`);
    return day >= firstDay && day <= lastDay && dateValue(day) === value ? day : null;
  }

  function dateInMonth(year, month, day) {
    return dayAt(year, month, Math.min(day, dayAt(year, month + 1, 0).getUTCDate()));
  }

  function positionPicker(input, panel, preferredWidth) {
    const viewport = input.ownerDocument.documentElement;
    const pane = (input.closest('dialog, .zm-root') || viewport).getBoundingClientRect();
    const anchor = input.getBoundingClientRect();
    const left = Math.max(0, pane.left) + 8;
    const right = Math.min(viewport.clientWidth, pane.right) - 8;
    const top = Math.max(0, pane.top) + 8;
    const bottom = Math.min(viewport.clientHeight, pane.bottom) - 8;
    const width = Math.max(0, Math.min(preferredWidth, right - left));
    const above = anchor.top - 6 - top;
    const below = bottom - anchor.bottom - 6;

    panel.style.width = `${width}px`;
    panel.style.left = `${Math.max(left, Math.min(anchor.left, right - width))}px`;
    const height = panel.scrollHeight + 2;
    const opensAbove = below < height && above > below;
    const available = opensAbove ? above : below;
    if (available < Math.min(height, 160)) {
      panel.style.top = `${top + Math.max(0, (bottom - top - height) / 2)}px`;
      panel.style.bottom = 'auto';
      panel.style.maxHeight = `${Math.max(0, bottom - top)}px`;
    } else {
      panel.style.top = opensAbove ? 'auto' : `${anchor.bottom + 6}px`;
      panel.style.bottom = opensAbove ? `${viewport.clientHeight - anchor.top + 6}px` : 'auto';
      panel.style.maxHeight = `${available}px`;
    }
  }

  function PickerField({ kind, label, value, onChange, t, children }) {
    const id = React.useId();
    const fieldRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const panelRef = React.useRef(null);
    const openerRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const isDate = kind === 'date';
    const valid = isDate ? parseDate(value) : clockPattern.test(value);
    const message = value && !valid ? t(isDate ? 'picker.invalidDate' : 'picker.invalidTime') : '';
    const width = isDate ? 292 : 240;

    React.useLayoutEffect(() => {
      inputRef.current.setCustomValidity(message);
    }, [message]);

    function focusPicker() {
      panelRef.current.querySelector('[data-picker-focus]')?.focus({ preventScroll: true });
    }

    React.useLayoutEffect(() => {
      if (!open) return;
      const field = fieldRef.current;
      const input = inputRef.current;
      const panel = panelRef.current;
      const doc = field.ownerDocument;
      const win = doc.defaultView;
      const pane = field.closest('dialog, .zm-root');
      const scrollArea = field.closest('.zm-body') || pane || doc.documentElement;
      const reposition = () => positionPicker(input, panel, width);
      const dismissOutside = event => {
        if (!field.contains(event.target)) setOpen(false);
      };
      const followScroll = event => {
        if (!event.target.contains?.(field)) return;
        const viewport = doc.documentElement;
        const area = scrollArea.getBoundingClientRect();
        const anchor = input.getBoundingClientRect();
        if (anchor.bottom <= Math.max(0, area.top) || anchor.top >= Math.min(area.bottom, viewport.clientHeight)) {
          setOpen(false);
        } else {
          reposition();
        }
      };

      panel.showPopover();
      reposition();
      focusPicker();

      const resizeObserver = new win.ResizeObserver(reposition);
      resizeObserver.observe(input);
      if (pane) resizeObserver.observe(pane);
      win.addEventListener('resize', reposition);
      doc.addEventListener('pointerdown', dismissOutside, true);
      doc.addEventListener('focusin', dismissOutside, true);
      doc.addEventListener('scroll', followScroll, true);
      return () => {
        resizeObserver.disconnect();
        win.removeEventListener('resize', reposition);
        doc.removeEventListener('pointerdown', dismissOutside, true);
        doc.removeEventListener('focusin', dismissOutside, true);
        doc.removeEventListener('scroll', followScroll, true);
        if (panel.matches(':popover-open')) panel.hidePopover();
      };
    }, [open, width]);

    function showPicker(element) {
      if (open) {
        focusPicker();
        return;
      }
      openerRef.current = element;
      setOpen(true);
    }

    function dismiss() {
      setOpen(false);
      openerRef.current.focus({ preventScroll: true });
    }

    function commit(nextValue) {
      onChange(nextValue);
      dismiss();
    }

    return h('div', { className: 'zm-field', ref: fieldRef, onKeyDown: event => {
      if (open && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      }
    } },
      h('label', { id: `${id}-label`, htmlFor: id }, label),
      h('div', { className: 'zm-picker-control', 'data-open': open ? '' : undefined },
        h('input', {
          id, ref: inputRef, className: 'zm-input zm-picker-input', type: 'text', value, required: true,
          placeholder: isDate ? 'YYYY-MM-DD' : 'HH:MM', autoComplete: 'off', spellCheck: false,
          onChange: event => {
            setOpen(false);
            onChange(event.target.value);
          },
          onKeyDown: event => {
            if (event.key !== 'ArrowDown') return;
            event.preventDefault();
            event.stopPropagation();
            showPicker(event.currentTarget);
          },
        }),
        h('button', {
          className: 'zm-picker-toggle', type: 'button', 'aria-label': t(isDate ? 'picker.openDate' : 'picker.openTime'),
          'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': `${id}-panel`,
          onClick: event => open ? dismiss() : showPicker(event.currentTarget),
        }, h(Icon, { name: kind })),
      ),
      h('div', {
        id: `${id}-panel`, role: 'dialog', 'aria-labelledby': `${id}-label`,
        popover: 'manual', ref: panelRef, className: 'zm-picker-popover',
      }, open ? children({ commit, dismiss }) : null),
    );
  }

  function Calendar({ value, commit, t }) {
    const today = currentBeijingISO().slice(0, 10);
    const todayDate = parseDate(today);
    const [cursor, setCursor] = React.useState(() => parseDate(value) || todayDate || lastDay);
    const [jumpYear, setJumpYear] = React.useState(null);
    const yearInputRef = React.useRef(null);
    const gridRef = React.useRef(null);
    const focusDay = React.useRef(false);
    const jumping = jumpYear !== null;
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const day = cursor.getUTCDate();
    const jumpNumber = Number(jumpYear);
    const jumpValid = jumpNumber >= minYear && jumpNumber <= maxYear;
    const english = t('lang.code') === 'en';
    const locale = english ? 'en' : 'zh-CN';
    const weekStart = english ? 0 : 1;
    const weekdays = english ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六'];
    const weekOffset = date => (date.getUTCDay() - weekStart + 7) % 7;
    const title = cursor.toLocaleDateString(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' });
    const fullDate = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }), [locale]);
    const shortMonth = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }), [locale]);

    React.useLayoutEffect(() => {
      if (jumping) {
        yearInputRef.current.focus({ preventScroll: true });
        yearInputRef.current.select();
      } else if (focusDay.current) {
        gridRef.current.querySelector('[data-picker-focus]')?.focus({ preventScroll: true });
        focusDay.current = false;
      }
    }, [cursor, jumping]);

    function moveCursor(next) {
      focusDay.current = true;
      setCursor(next < firstDay ? new Date(firstDay) : next > lastDay ? new Date(lastDay) : next);
    }

    function navigateDay(event) {
      const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
      let next;
      if (offset !== undefined) next = dayAt(year, month, day + offset);
      else if (event.key === 'Home') next = dayAt(year, month, day - weekOffset(cursor));
      else if (event.key === 'End') next = dayAt(year, month, day + 6 - weekOffset(cursor));
      else if (event.key === 'PageUp' || event.key === 'PageDown') {
        const step = (event.shiftKey ? 12 : 1) * (event.key === 'PageUp' ? -1 : 1);
        next = dateInMonth(year, month + step, day);
      }
      if (!next) return;
      event.preventDefault();
      event.stopPropagation();
      moveCursor(next);
    }

    function chooseMonth(nextMonth) {
      if (!jumpValid) return;
      moveCursor(dateInMonth(jumpNumber, nextMonth, day));
      setJumpYear(null);
    }

    const leadingDays = weekOffset(dayAt(year, month, 1));
    const renderWeek = row => h('tr', { key: row }, Array.from({ length: 7 }, (_, col) => {
      const cell = dayAt(year, month, 1 - leadingDays + row * 7 + col);
      const iso = dateValue(cell);
      const active = cell.getTime() === cursor.getTime();
      return h('td', { key: iso, 'aria-selected': iso === value },
        h('button', {
          type: 'button', className: 'zm-picker-day', tabIndex: active ? 0 : -1,
          'aria-label': fullDate.format(cell), 'aria-current': iso === today ? 'date' : undefined,
          'data-picker-focus': active ? '' : undefined,
          'data-outside': cell.getUTCMonth() !== month ? '' : undefined,
          disabled: cell < firstDay || cell > lastDay,
          onClick: () => commit(iso),
        }, cell.getUTCDate()),
      );
    }));

    return h(React.Fragment, null,
      h('div', { className: 'zm-picker-header' },
        h('button', {
          type: 'button', className: 'zm-picker-month-heading', 'aria-expanded': jumping,
          onClick: () => setJumpYear(jumping ? null : String(year)),
        },
          h('span', null, jumping ? t('picker.chooseMonthYear') : title),
          h(Icon, { name: 'down', size: 14 }),
        ),
        jumping ? null : h('div', { className: 'zm-picker-nav' },
          h('button', {
            type: 'button', 'aria-label': t('picker.previousMonth'), className: 'zm-picker-arrow',
            disabled: year === minYear && month === 0,
            onClick: () => setCursor(dateInMonth(year, month - 1, day)),
          }, h(Icon, { name: 'prev' })),
          h('button', {
            type: 'button', 'aria-label': t('picker.nextMonth'), className: 'zm-picker-arrow',
            disabled: year === maxYear && month === 11,
            onClick: () => setCursor(dateInMonth(year, month + 1, day)),
          }, h(Icon, { name: 'next' })),
        ),
      ),
      jumping ? h(React.Fragment, null,
        h('label', { className: 'zm-picker-year' },
          h('span', null, t('picker.year')),
          h('input', {
            ref: yearInputRef, className: 'zm-input', type: 'text', inputMode: 'numeric', maxLength: 4,
            value: jumpYear, 'aria-invalid': !jumpValid, placeholder: String(year), 'data-picker-focus': '',
            onChange: event => setJumpYear(event.target.value.replace(/\D/g, '')),
            onKeyDown: event => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              chooseMonth(month);
            },
          }),
        ),
        h('div', { className: 'zm-picker-months', role: 'group', 'aria-label': t('picker.month') },
          Array.from({ length: 12 }, (_, index) => h('button', {
            key: index, type: 'button', className: 'zm-picker-month',
            'aria-pressed': jumpNumber === year && index === month,
            disabled: !jumpValid, onClick: () => chooseMonth(index),
          }, shortMonth.format(dayAt(year, index, 1)))),
        ),
      ) : h('table', { className: 'zm-picker-calendar', ref: gridRef, role: 'grid', 'aria-label': title, onKeyDown: navigateDay },
        h('thead', null, h('tr', null, Array.from({ length: 7 }, (_, index) => {
          const text = weekdays[(index + weekStart) % 7];
          return h('th', { key: text, scope: 'col' }, text);
        }))),
        h('tbody', null, Array.from({ length: 6 }, (_, row) => renderWeek(row))),
      ),
      h('div', { className: 'zm-picker-footer zm-picker-footer-date' },
        h('button', { type: 'button', className: 'zm-picker-action', disabled: !todayDate, onClick: () => commit(today) }, t('picker.today')),
      ),
    );
  }

  function TimeColumn({ label, value, onChange, count, initialFocus }) {
    const id = React.useId();
    const listRef = React.useRef(null);

    React.useEffect(() => {
      const list = listRef.current;
      const selected = list.children[value];
      const top = selected.offsetTop;
      if (top < list.scrollTop || top + selected.offsetHeight > list.scrollTop + list.clientHeight) {
        const rowsAbove = Math.floor((list.clientHeight / selected.offsetHeight - 1) / 2);
        const firstVisible = list.children[Math.max(0, value - rowsAbove)];
        list.scrollTop = firstVisible.offsetTop - list.firstElementChild.offsetTop;
      }
    }, [value]);

    function navigate(event) {
      const next = {
        ArrowUp: value - 1,
        ArrowDown: value + 1,
        Home: 0,
        End: count - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      onChange(Math.max(0, Math.min(count - 1, next)));
    }

    return h('div', { className: 'zm-picker-time-column' },
      h('div', { id, className: 'zm-picker-time-label' }, label),
      h('div', {
        className: 'zm-picker-time-list', role: 'listbox', tabIndex: 0, ref: listRef, onKeyDown: navigate,
        'aria-labelledby': id, 'aria-activedescendant': `${id}-${value}`,
        'data-picker-focus': initialFocus ? '' : undefined,
      }, Array.from({ length: count }, (_, option) => h('div', {
        key: option, id: `${id}-${option}`, className: 'zm-picker-time-option', role: 'option', 'aria-selected': option === value,
        onClick: () => {
          onChange(option);
          listRef.current.focus({ preventScroll: true });
        },
      }, twoDigits(option)))),
    );
  }

  function Clock({ value, commit, dismiss, t }) {
    const initial = clockPattern.test(value) ? value : currentBeijingISO().slice(11, 16);
    const [hour, setHour] = React.useState(Number(initial.slice(0, 2)));
    const [minute, setMinute] = React.useState(Number(initial.slice(3, 5)));
    const confirm = () => commit(`${twoDigits(hour)}:${twoDigits(minute)}`);
    return h('div', { onKeyDown: event => {
      if (event.key === 'Enter' && event.target.getAttribute('role') === 'listbox') {
        event.preventDefault();
        confirm();
      }
    } },
      h('div', { className: 'zm-picker-clock' },
        h(TimeColumn, { label: t('picker.hour'), value: hour, count: 24, onChange: setHour, initialFocus: true }),
        h(TimeColumn, { label: t('picker.minute'), value: minute, count: 60, onChange: setMinute }),
      ),
      h('div', { className: 'zm-picker-footer' },
        h('button', { type: 'button', className: 'zm-picker-action', onClick: dismiss }, t('picker.cancel')),
        h('button', { type: 'button', className: 'zm-picker-confirm', onClick: confirm }, t('picker.confirm')),
      ),
    );
  }

  function DateField(props) {
    return h(PickerField, { ...props, kind: 'date' }, callbacks => h(Calendar, { ...props, ...callbacks }));
  }

  function TimeField(props) {
    return h(PickerField, { ...props, kind: 'time' }, callbacks => h(Clock, { ...props, ...callbacks }));
  }

  return { DateField, TimeField };
}

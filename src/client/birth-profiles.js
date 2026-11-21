const BIRTH_PROFILE_PREFIX = 'dsh-zhiming-birth-profile:v1:';

function birthProfileError(details) {
  if (typeof details?.name !== 'string' || !details.name.trim()) return 'profiles.nameRequired';
  if (details.gender !== 'male' && details.gender !== 'female') return 'profiles.invalidGender';
  if (typeof details.time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(details.time)) return 'picker.invalidTime';
  if (details.longitude !== undefined
      && (!Number.isFinite(details.longitude) || Math.abs(details.longitude) > 180)) return 'profiles.invalidLongitude';

  const date = typeof details.date === 'string' && details.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const [year, month, day] = date ? date.slice(1).map(Number) : [];
  const dateInRange = year >= 1901 && year <= 2099 && month >= 1 && month <= 12 && day >= 1;
  if (details.calendar === 'lunar') {
    const signedMonth = details.isLeapMonth ? -month : month;
    if (dateInRange && typeof details.isLeapMonth === 'boolean' && day <= LUNAR_MONTH_DAYS[year]?.[signedMonth]) return null;
    return 'profiles.invalidLunarDate';
  }
  if (details.calendar === 'solar' && dateInRange && day <= new Date(Date.UTC(year, month, 0)).getUTCDate()) return null;
  return 'picker.invalidDate';
}

function createBirthProfileStore() {
  const listeners = new Set();
  let snapshot = { profiles: [], unavailable: false };

  function refresh() {
    try {
      const storage = window.localStorage;
      const profiles = [];
      for (const key of Object.keys(storage)) {
        if (!key.startsWith(BIRTH_PROFILE_PREFIX)) continue;
        try {
          const details = JSON.parse(storage.getItem(key));
          if (!birthProfileError(details)) profiles.push({ id: key.slice(BIRTH_PROFILE_PREFIX.length), details });
        } catch {
          // A damaged record should not hide the rest of the library.
        }
      }
      profiles.sort((a, b) => a.details.name.localeCompare(b.details.name) || a.details.date.localeCompare(b.details.date));
      snapshot = { profiles, unavailable: false };
    } catch {
      snapshot = { ...snapshot, unavailable: true };
    }
    for (const listener of listeners) listener();
  }

  function onStorage(event) {
    if (event.key === null || event.key.startsWith(BIRTH_PROFILE_PREFIX)) refresh();
  }

  refresh();

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        window.addEventListener('storage', onStorage);
        refresh();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener('storage', onStorage);
      };
    },
    save(id, details) {
      const issue = birthProfileError(details);
      if (issue) return issue;
      try {
        // One key per profile avoids overwriting unrelated changes from other tabs.
        const profileId = id ?? (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        const key = BIRTH_PROFILE_PREFIX + profileId;
        const storage = window.localStorage;
        if (id && storage.getItem(key) === null) return 'profiles.missing';
        storage.setItem(key, JSON.stringify(details));
        refresh();
        return null;
      } catch {
        return 'profiles.writeError';
      }
    },
    remove(id) {
      try {
        window.localStorage.removeItem(BIRTH_PROFILE_PREFIX + id);
        refresh();
        return null;
      } catch {
        return 'profiles.writeError';
      }
    },
  };
}

function describeBirthProfile(details, t) {
  const { calendar, isLeapMonth, date, time, gender, longitude } = details;
  const calendarLabel = calendar === 'solar' ? 'profiles.solar' : isLeapMonth ? 'profiles.leapLunar' : 'profiles.lunar';
  const fields = [`${t(calendarLabel)} ${date}`, time, t(`form.${gender}`)];
  if (longitude !== undefined) fields.push(`${longitude}°`);
  return fields.join(' · ');
}

function createBirthProfilesDialog(React, { BirthFields }) {
  const h = React.createElement;

  return function BirthProfilesDialog({ snapshot, draft, store, onDismiss, onPick, onSaved, t }) {
    const id = React.useId();
    const dialogRef = React.useRef(null);
    const bodyRef = React.useRef(null);
    const [editor, setEditor] = React.useState(draft ? { id: null, birth: draft } : null);
    const [deleting, setDeleting] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [notice, setNotice] = React.useState(null);
    const mode = editor ? 'edit' : deleting ? 'delete' : 'list';
    let titleKey = onPick ? 'profiles.choose' : 'profiles.title';
    if (editor) titleKey = editor.id ? 'profiles.editTitle' : 'profiles.add';
    else if (deleting) titleKey = 'profiles.deleteTitle';
    const { profiles, unavailable } = snapshot;
    const filter = search.trim().toLocaleLowerCase();
    const matches = profiles.filter(({ details }) => details.name.toLocaleLowerCase().includes(filter));

    React.useLayoutEffect(() => {
      const dialog = dialogRef.current;
      dialog.showModal();
      return () => dialog.close();
    }, []);

    React.useLayoutEffect(() => {
      bodyRef.current.scrollTop = 0;
      dialogRef.current.querySelector('[data-profile-focus]')?.focus({ preventScroll: true });
    }, [mode]);

    function openEditor(profile) {
      setNotice(null);
      setEditor({ id: profile?.id ?? null, birth: createBirthDraft(profile?.details) });
    }

    function backToList() {
      if (draft) {
        onDismiss();
        return;
      }
      setEditor(null);
      setDeleting(null);
      setNotice(null);
    }

    function save(event) {
      event.preventDefault();
      const details = { ...birthParams(editor.birth), name: editor.birth.name.trim() };
      const issue = store.save(editor.id, details);
      if (issue) {
        setNotice({ key: issue, error: true });
        return;
      }
      if (draft) {
        onSaved({ ...editor.birth, name: details.name });
        return;
      }
      if (onPick) {
        onPick(details);
        return;
      }
      setSearch('');
      setEditor(null);
      setNotice({ key: 'profiles.saved' });
    }

    function remove() {
      const issue = store.remove(deleting.id);
      if (issue) {
        setNotice({ key: issue, error: true });
        return;
      }
      setDeleting(null);
      setNotice({ key: 'profiles.deleted' });
    }

    return h('dialog', {
      ref: dialogRef,
      className: 'zm-profiles-dialog',
      'aria-labelledby': `${id}-title`,
      onCancel: event => {
        event.preventDefault();
        if (mode === 'list') onDismiss();
        else backToList();
      },
    },
      h('header', { className: 'zm-profiles-header' },
        h('h2', { id: `${id}-title` }, t(titleKey)),
        h('button', { type: 'button', className: 'zm-btn zm-btn-sm zm-profiles-close', 'aria-label': t('profiles.close'), onClick: onDismiss }, '×'),
      ),
      h('div', { className: 'zm-profiles-body', ref: bodyRef },
        unavailable ? h('p', { className: 'zm-profiles-error', role: 'alert' }, t('profiles.readError')) : null,
        notice ? h('p', { className: notice.error ? 'zm-profiles-error' : 'zm-profiles-notice', role: notice.error ? 'alert' : 'status' }, t(notice.key)) : null,
        editor ? h('form', { className: 'zm-form', onSubmit: save },
          h(BirthFields, { birth: editor.birth, onChange: birth => setEditor({ ...editor, birth }), requiredName: true, t }),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', onClick: backToList }, t('picker.cancel')),
            h('button', { type: 'submit', className: 'zm-btn zm-btn-gold' }, t('profiles.save')),
          ),
        ) : deleting ? h(React.Fragment, null,
          h('p', { className: 'zm-profiles-confirm' }, t('profiles.deleteConfirm').replace('{name}', () => deleting.details.name)),
          h('div', { className: 'zm-form-footer' },
            h('button', { type: 'button', className: 'zm-btn', 'data-profile-focus': '', onClick: backToList }, t('picker.cancel')),
            h('button', { type: 'button', className: 'zm-btn zm-profiles-delete', onClick: remove }, t('profiles.delete')),
          ),
        ) : h(React.Fragment, null,
          h('div', { className: 'zm-profiles-toolbar' },
            profiles.length ? h('input', {
              type: 'search', className: 'zm-input', value: search, placeholder: t('profiles.search'),
              'aria-label': t('profiles.search'), 'data-profile-focus': onPick ? undefined : '',
              onChange: event => setSearch(event.target.value),
            }) : null,
            (!onPick || profiles.length === 0) ? h('button', {
              type: 'button', className: 'zm-btn zm-btn-gold',
              'data-profile-focus': profiles.length ? undefined : '',
              onClick: () => openEditor(),
            }, t('profiles.add')) : null,
          ),
          matches.length ? h('ul', { className: 'zm-profiles-list' },
            ...matches.map((profile, index) => h('li', { key: profile.id, className: 'zm-profile-entry' },
              h('div', { className: 'zm-profile-summary' },
                h('strong', null, profile.details.name),
                h('div', { className: 'zm-profile-meta' }, describeBirthProfile(profile.details, t)),
              ),
              onPick ? h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm zm-btn-primary',
                'aria-label': `${t('profiles.apply')} · ${profile.details.name}`,
                'data-profile-focus': index === 0 ? '' : undefined,
                onClick: () => onPick(profile.details),
              }, t('profiles.apply')) : h('div', { className: 'zm-button-group' },
                h('button', {
                  type: 'button', className: 'zm-btn zm-btn-sm',
                  'aria-label': `${t('profiles.edit')} · ${profile.details.name}`,
                  onClick: () => openEditor(profile),
                }, t('profiles.edit')),
                h('button', {
                  type: 'button', className: 'zm-btn zm-btn-sm',
                  'aria-label': `${t('profiles.delete')} · ${profile.details.name}`,
                  onClick: () => { setNotice(null); setDeleting(profile); },
                }, t('profiles.delete')),
              ),
            )),
          ) : h('p', { className: 'zm-profiles-empty' }, t(profiles.length ? 'profiles.noMatches' : 'profiles.empty')),
        ),
      ),
      h('footer', { className: 'zm-profiles-footer' }, t('profiles.local')),
    );
  };
}

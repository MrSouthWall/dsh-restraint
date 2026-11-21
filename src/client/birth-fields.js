function createBirthDraft(profile = {}, lunarDate = '') {
  const {
    name = '', date = '', time = '', gender = 'male',
    calendar = 'solar', isLeapMonth = false, longitude,
  } = profile;
  const [lunarYear = '', lunarMonth = '', lunarDay = ''] = (calendar === 'lunar' ? date : lunarDate).split('-');
  return {
    name, date: calendar === 'solar' ? date : '', time, gender, calendar,
    lunarYear, lunarMonth, lunarDay, isLeapMonth,
    longitude: longitude === undefined ? '' : String(longitude),
  };
}

function birthParams(birth) {
  const { name, calendar, gender, time, longitude } = birth;
  const lunar = calendar === 'lunar';
  const date = lunar
    ? [birth.lunarYear, birth.lunarMonth, birth.lunarDay].map(value => String(Number(value)).padStart(2, '0')).join('-')
    : birth.date;
  return {
    name, date, time, gender, calendar,
    ...(lunar && { isLeapMonth: birth.isLeapMonth }),
    ...(longitude !== '' && { longitude: Number(longitude) }),
  };
}

function createBirthFields(React, { ChoiceMenu, DateField, TimeField }) {
  const h = React.createElement;

  return function BirthFields({ birth, onChange, genderFirst, requiredName = false, profileTools, t }) {
    const id = React.useId();
    const [appliedBirth, setAppliedBirth] = React.useState(null);
    const update = key => value => onChange({ ...birth, [key]: value });
    const nameField = h('div', { className: 'zm-field', key: 'name' },
      h('label', { htmlFor: `${id}-name` }, t(requiredName ? 'profiles.name' : 'form.name')),
      h('input', {
        id: `${id}-name`, className: 'zm-input', value: birth.name,
        required: requiredName, 'data-profile-focus': requiredName ? '' : undefined,
        onChange: event => update('name')(event.target.value),
      }),
    );

    return h(React.Fragment, null,
      profileTools ? h('div', { className: 'zm-profile-controls' },
        h('button', {
          type: 'button', className: 'zm-btn zm-btn-primary', 'aria-haspopup': 'dialog',
          onClick: () => profileTools.pick(details => {
            const draft = createBirthDraft(details);
            onChange(draft);
            setAppliedBirth(draft);
          }),
        }, t('profiles.fill')),
        h('button', {
          type: 'button', className: 'zm-btn', 'aria-haspopup': 'dialog',
          onClick: () => profileTools.saveDraft(birth, onChange),
        }, t('profiles.saveCurrent')),
        h('span', { className: 'zm-profile-applied', role: 'status' },
          birth === appliedBirth ? t('profiles.applied').replace('{name}', () => birth.name) : null,
        ),
      ) : null,
      h('div', { className: 'zm-form-grid' },
        requiredName ? nameField : null,
        h(ChoiceMenu, { label: t('form.calendar'), value: birth.calendar, options: getCalendarChoices(t), onChange: update('calendar') }),
        h(ChoiceMenu, { label: t('form.gender'), value: birth.gender, options: getGenderChoices(t, genderFirst), onChange: update('gender') }),
        birth.calendar === 'solar'
          ? h(DateField, { label: t('form.birthDate'), value: birth.date, onChange: update('date'), t })
          : h(React.Fragment, null,
            ...[['lunarYear', 1901, 2099], ['lunarMonth', 1, 12], ['lunarDay', 1, 30]].map(([key, min, max]) =>
              h('div', { className: 'zm-field', key },
                h('label', { htmlFor: `${id}-${key}` }, t(`form.${key}`)),
                h('input', {
                  id: `${id}-${key}`, className: 'zm-input', type: 'number', min, max,
                  value: birth[key], onChange: event => update(key)(event.target.value), required: true,
                }),
              )),
            h('label', { className: 'zm-check-label' },
              h('input', { type: 'checkbox', checked: birth.isLeapMonth, onChange: event => update('isLeapMonth')(event.target.checked) }),
              t('form.leapMonth'),
            ),
          ),
        h(TimeField, { label: t('form.birthTime'), value: birth.time, onChange: update('time'), t }),
        requiredName ? null : nameField,
        h(ChoiceMenu, { label: t('form.advancedTst'), value: birth.longitude, options: getLongitudeChoices(t), onChange: update('longitude') }),
      ),
    );
  };
}

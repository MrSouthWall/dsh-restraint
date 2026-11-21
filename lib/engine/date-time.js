import { Lunar, Solar } from '../vendor/chart-libraries.js';

const MINUTE_MS = 60_000;
const BEIJING_OFFSET_MINUTES = 8 * 60;
const RAD = Math.PI / 180;

function solarFromWallClock(ms) {
  const d = new Date(ms);
  return Solar.fromYmdHms(
    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
  );
}

export function currentBeijingSolar() {
  return solarFromWallClock(Date.now() + BEIJING_OFFSET_MINUTES * MINUTE_MS);
}

// NOAA Solar Position Calculator, based on Meeus. Input is the UTC instant.
// https://gml.noaa.gov/grad/solcalc/azel.html
function equationOfTime(utcMs) {
  const julianCenturies = (utcMs / 86_400_000 + 2440587.5 - 2451545) / 36525;
  const t = julianCenturies;
  const meanLongitude = (280.46646 + t * (36000.76983 + t * 0.0003032)) * RAD;
  const meanAnomaly = (357.52911 + t * (35999.05029 - t * 0.0001537)) * RAD;
  const eccentricity = 0.016708634 - t * (0.000042037 + t * 0.0000001267);
  const obliquitySeconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  const meanObliquity = 23 + (26 + obliquitySeconds / 60) / 60;
  const obliquity = (meanObliquity + 0.00256 * Math.cos((125.04 - 1934.136 * t) * RAD)) * RAD;
  const y = Math.tan(obliquity / 2) ** 2;
  const eot = y * Math.sin(2 * meanLongitude) - 2 * eccentricity * Math.sin(meanAnomaly)
    + 4 * eccentricity * y * Math.sin(meanAnomaly) * Math.cos(2 * meanLongitude)
    - 0.5 * y ** 2 * Math.sin(4 * meanLongitude)
    - 1.25 * eccentricity ** 2 * Math.sin(2 * meanAnomaly);
  return 4 * eot / RAD;
}

export function parseDateTimeInput(input = {}, { requireBirth = false } = {}) {
  const now = currentBeijingSolar();
  const calendar = input.calendar ?? 'solar';
  if (calendar !== 'solar' && calendar !== 'lunar') throw new Error('请选择公历或农历。');
  if (input.isLeapMonth !== undefined && typeof input.isLeapMonth !== 'boolean') {
    throw new Error('闰月选项须为是或否。');
  }
  if (input.isLeapMonth && calendar !== 'lunar') throw new Error('闰月只适用于农历日期。');

  let year = now.getYear();
  let month = now.getMonth();
  let day = now.getDay();
  if (input.date !== undefined) {
    const parts = typeof input.date === 'string' && input.date.trim().match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?$/);
    if (!parts) throw new Error('日期格式无效，请使用 YYYY-MM-DD。');
    [year, month, day] = parts.slice(1).map(Number);
  } else if (input.year !== undefined || input.month !== undefined || input.day !== undefined) {
    if (![input.year, input.month, input.day].every(Number.isInteger)) {
      throw new Error('请完整输入年、月、日。');
    }
    ({ year, month, day } = input);
  } else if (requireBirth || calendar === 'lunar') {
    throw new Error('请提供完整出生日期。');
  }

  let hour = now.getHour();
  let minute = now.getMinute();
  let second = now.getSecond();
  if (input.time !== undefined) {
    const parts = typeof input.time === 'string' && input.time.trim().match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?$/);
    if (!parts) throw new Error('时间格式无效，请使用 24 小时制 HH:MM。');
    hour = Number(parts[1]);
    minute = Number(parts[2] ?? 0);
    second = Number(parts[3] ?? 0);
  } else if (input.hour !== undefined || input.minute !== undefined || input.second !== undefined) {
    hour = input.hour;
    minute = input.minute ?? 0;
    second = input.second ?? 0;
  } else if (requireBirth) {
    throw new Error('请提供出生时间。');
  }

  if (!Number.isInteger(year) || year < 1901 || year > 2099) throw new Error('年份须在 1901 至 2099 之间。');
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > 31) {
    throw new Error('月份或日期无效。');
  }
  if (![hour, minute, second].every(Number.isInteger) || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    throw new Error('时间超出 24 小时制范围。');
  }

  let civilSolar;
  if (calendar === 'lunar') {
    try {
      civilSolar = Lunar.fromYmdHms(year, input.isLeapMonth ? -month : month, day, hour, minute, second).getSolar();
    } catch {
      throw new Error('该农历日期不存在，请核对月份、闰月与日期。');
    }
  } else {
    if (day > new Date(Date.UTC(year, month, 0)).getUTCDate()) throw new Error('该公历日期不存在。');
    civilSolar = Solar.fromYmdHms(year, month, day, hour, minute, second);
  }

  const { longitude } = input;
  const trueSolarApplied = longitude !== undefined;
  let solar = civilSolar;
  let solarOffsetSeconds = 0;
  if (trueSolarApplied) {
    if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new Error('经度须在 −180° 至 180° 之间，东经为正。');
    }
    // Treat the supplied clock as UTC+08:00 regardless of the host's time zone.
    const civilMs = Date.UTC(civilSolar.getYear(), civilSolar.getMonth() - 1, civilSolar.getDay(), hour, minute, second);
    const utcMs = civilMs - BEIJING_OFFSET_MINUTES * MINUTE_MS;
    solarOffsetSeconds = Math.round((4 * longitude - BEIJING_OFFSET_MINUTES + equationOfTime(utcMs)) * 60);
    solar = solarFromWallClock(civilMs + solarOffsetSeconds * 1000);
  }

  const civilLunar = civilSolar.getLunar();
  return {
    solar, lunar: trueSolarApplied ? solar.getLunar() : civilLunar, civilSolar, civilLunar,
    calendar, trueSolarApplied, solarOffsetSeconds,
  };
}

// Solar-term boundaries use the instant on the Beijing clock; the day and hour
// can be read on the birthplace's apparent solar clock.
export function getPillarGanZhi(civilLunar, lunar, daySect = 2) {
  return [
    civilLunar.getYearInGanZhiExact(),
    civilLunar.getMonthInGanZhiExact(),
    daySect === 1 ? lunar.getDayInGanZhiExact() : lunar.getDayInGanZhiExact2(),
    lunar.getTimeInGanZhi(),
  ];
}

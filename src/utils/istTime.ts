/**
 * Indian Standard Time (IST) Utilities & Real-Time Agronomic Clock
 * TimeZone: Asia/Kolkata (UTC +05:30)
 */
import { useState, useEffect } from 'react';

export interface ISTInfo {
  hour: number;
  minute: number;
  second: number;
  timeString: string;
  timeString12: string;
  dateString: string;
  greeting: 'Good morning' | 'Good afternoon' | 'Good evening';
  greetingTelugu: string;
  greetingHindi: string;
  period: 'morning' | 'afternoon' | 'evening';
  timeOfDayPreset: 'dawn' | 'noon' | 'golden' | 'twilight';
  emoji: string;
}

export function getISTInfo(date: Date = new Date()): ISTInfo {
  // Using Intl with Asia/Kolkata for exact standard time
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

  const hour = parseInt(getPart('hour'), 10) || 0;
  const minute = parseInt(getPart('minute'), 10) || 0;
  const second = parseInt(getPart('second'), 10) || 0;

  const timeString12 = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  const dateString = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  // Exact period and greeting rules:
  // Morning: 04:00 to 11:59 -> Good morning
  // Afternoon: 12:00 to 16:59 -> Good afternoon
  // Evening: 17:00 to 03:59 -> Good evening
  let greeting: 'Good morning' | 'Good afternoon' | 'Good evening' = 'Good morning';
  let greetingTelugu = 'శుభోదయం';
  let greetingHindi = 'शुभ प्रभात';
  let period: 'morning' | 'afternoon' | 'evening' = 'morning';
  let timeOfDayPreset: 'dawn' | 'noon' | 'golden' | 'twilight' = 'noon';
  let emoji = '🌅';

  if (hour >= 4 && hour < 12) {
    greeting = 'Good morning';
    greetingTelugu = 'శుభోదయం';
    greetingHindi = 'शुभ प्रभात';
    period = 'morning';
    timeOfDayPreset = hour < 8 ? 'dawn' : 'noon';
    emoji = '🌅';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    greetingTelugu = 'శుభ మధ్యాహ్నం';
    greetingHindi = 'शुभ दोपहर';
    period = 'afternoon';
    timeOfDayPreset = 'noon';
    emoji = '☀️';
  } else {
    // 17:00 (5:00 PM) to 03:59 (early dawn)
    greeting = 'Good evening';
    greetingTelugu = 'శుభ సాయంత్రం';
    greetingHindi = 'शुभ संध्या';
    period = 'evening';
    timeOfDayPreset = hour >= 17 && hour < 20 ? 'golden' : 'twilight';
    emoji = hour >= 20 || hour < 4 ? '🌙' : '🌇';
  }

  return {
    hour,
    minute,
    second,
    timeString: `${timeString12} IST`,
    timeString12,
    dateString,
    greeting,
    greetingTelugu,
    greetingHindi,
    period,
    timeOfDayPreset,
    emoji,
  };
}

/**
 * React hook to keep IST time synchronized in components
 */
export function useISTLiveTime(updateIntervalMs: number = 10000): ISTInfo {
  const [ist, setIst] = useState<ISTInfo>(() => getISTInfo());

  useEffect(() => {
    // Initial sync
    setIst(getISTInfo());

    const interval = setInterval(() => {
      setIst(getISTInfo());
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return ist;
}

export interface HourlyForecastSlot {
  time: string;
  isNow?: boolean;
  temp: number;
  rainChance: number;
  wind: number;
  humidity: number;
  condition: string;
}

/**
 * Generate 24-hour microclimate progression timeline starting from current IST hour
 */
export function generateISTTimeline(baseTemp: number = 29.5, baseHumidity: number = 64): HourlyForecastSlot[] {
  const { hour: currentIstHour } = getISTInfo();
  const timeline: HourlyForecastSlot[] = [];

  // Generate 8 intervals spaced 2 hours apart starting from current IST hour (spanning 24 hours)
  for (let i = 0; i < 9; i++) {
    const slotHour = (currentIstHour + i * 2) % 24;
    const hourStr = `${slotHour.toString().padStart(2, '0')}:00`;
    const isNow = i === 0;

    // Diurnal temperature curve in Indian subcontinent:
    // Peak temperature around 14:00 - 15:00
    // Minimum temperature around 05:00 - 06:00
    let tempDelta = 0;
    let slotCondition = 'Partly Cloudy';
    let slotHumidity = baseHumidity;
    let rainChance = 10;
    let wind = 8.5;

    if (slotHour >= 4 && slotHour < 7) {
      tempDelta = -6.5; // Cool dawn
      slotCondition = 'Dewy Dawn';
      slotHumidity = Math.min(95, baseHumidity + 22);
      rainChance = 5;
      wind = 5.8;
    } else if (slotHour >= 7 && slotHour < 11) {
      tempDelta = -2.5; // Morning warming
      slotCondition = 'Sunny & Mild';
      slotHumidity = baseHumidity + 8;
      rainChance = 10;
      wind = 9.2;
    } else if (slotHour >= 11 && slotHour < 14) {
      tempDelta = +1.5; // Midday sun
      slotCondition = 'Bright Sunlight';
      slotHumidity = Math.max(35, baseHumidity - 10);
      rainChance = 15;
      wind = 12.8;
    } else if (slotHour >= 14 && slotHour < 17) {
      tempDelta = +3.2; // Peak afternoon heat
      slotCondition = 'Peak Sun & Dry';
      slotHumidity = Math.max(30, baseHumidity - 15);
      rainChance = 15;
      wind = 14.5;
    } else if (slotHour >= 17 && slotHour < 19) {
      tempDelta = +0.5; // Golden hour / dusk
      slotCondition = 'Golden Sunset';
      slotHumidity = baseHumidity - 2;
      rainChance = 12;
      wind = 10.2;
    } else if (slotHour >= 19 && slotHour < 22) {
      tempDelta = -2.8; // Early night
      slotCondition = 'Clear Night';
      slotHumidity = baseHumidity + 10;
      rainChance = 8;
      wind = 7.4;
    } else {
      tempDelta = -5.0; // Late night / pre-dawn
      slotCondition = 'Starry & Calm';
      slotHumidity = baseHumidity + 18;
      rainChance = 5;
      wind = 6.0;
    }

    timeline.push({
      time: hourStr,
      isNow,
      temp: Number((baseTemp + tempDelta).toFixed(1)),
      rainChance,
      wind: Number(wind.toFixed(1)),
      humidity: Math.round(slotHumidity),
      condition: slotCondition,
    });
  }

  return timeline;
}

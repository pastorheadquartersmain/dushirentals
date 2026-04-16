import { useState, useEffect } from 'react';
import './HeroWidgets.css';

const LAT = 12.1696;
const LON = -68.9900;
const TZ  = 'America/Curacao';

function wmoToCondition(code) {
  if (code === 0)    return { type: 'sunny',         label: 'Sunny' };
  if (code <= 2)     return { type: 'partly-cloudy', label: 'Partly Cloudy' };
  if (code === 3)    return { type: 'cloudy',         label: 'Overcast' };
  if (code <= 48)    return { type: 'cloudy',         label: 'Foggy' };
  if (code <= 55)    return { type: 'rainy',          label: 'Drizzle' };
  if (code <= 67)    return { type: 'rainy',          label: 'Rain' };
  if (code <= 82)    return { type: 'rainy',          label: 'Showers' };
  if (code <= 99)    return { type: 'thunder',        label: 'Thunderstorm' };
  return                    { type: 'cloudy',         label: 'Cloudy' };
}

function toF(c) { return Math.round(c * 9 / 5 + 32); }

// ── Shared cloud path ─────────────────────────────────────────────────────────
const CLOUD = 'M22 64 Q8 64 8 50 Q8 38 20 36 Q22 22 36 20 Q44 14 54 20 Q68 18 70 32 Q82 32 82 46 Q82 64 68 64 Z';

// ── SVG icons ─────────────────────────────────────────────────────────────────
function SunnyIcon() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return {
      x1: +(50 + Math.cos(a) * 31).toFixed(1), y1: +(50 + Math.sin(a) * 31).toFixed(1),
      x2: +(50 + Math.cos(a) * 45).toFixed(1), y2: +(50 + Math.sin(a) * 45).toFixed(1),
    };
  });
  return (
    <svg className="wicon wicon--sunny" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g className="wicon__rays">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        ))}
      </g>
      <circle className="wicon__sun-core" cx="50" cy="50" r="20" fill="currentColor" />
    </svg>
  );
}

function PartlyCloudyIcon() {
  const rays = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 30) * Math.PI) / 180;
    return {
      x1: +(74 + Math.cos(a) * 18).toFixed(1), y1: +(20 + Math.sin(a) * 18).toFixed(1),
      x2: +(74 + Math.cos(a) * 28).toFixed(1), y2: +(20 + Math.sin(a) * 28).toFixed(1),
    };
  });
  return (
    <svg className="wicon wicon--partly-cloudy" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g className="wicon__sun-bg">
        <g className="wicon__rays-sm">
          {rays.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        <circle className="wicon__sun-core-sm" cx="74" cy="20" r="13" fill="currentColor" />
      </g>
      <path className="wicon__cloud" d={CLOUD} fill="currentColor" />
    </svg>
  );
}

function CloudyIcon() {
  return (
    <svg className="wicon wicon--cloudy" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path className="wicon__cloud" d={CLOUD} fill="currentColor" />
    </svg>
  );
}

const DROPS = [
  { x1: 28, y1: 70, x2: 23, y2: 84 }, { x1: 40, y1: 72, x2: 35, y2: 86 },
  { x1: 52, y1: 70, x2: 47, y2: 84 }, { x1: 64, y1: 72, x2: 59, y2: 86 },
  { x1: 34, y1: 81, x2: 29, y2: 95 }, { x1: 58, y1: 81, x2: 53, y2: 95 },
];

function RainyIcon() {
  return (
    <svg className="wicon wicon--rainy" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path className="wicon__cloud" d={CLOUD} fill="currentColor" />
      {DROPS.map((d, i) => (
        <line key={i} className="wicon__raindrop" style={{ '--i': i }}
              x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function ThunderIcon() {
  return (
    <svg className="wicon wicon--thunder" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path className="wicon__cloud" d={CLOUD} fill="currentColor" />
      <polyline className="wicon__lightning" points="53,64 41,80 49,80 37,96"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const ICONS = {
  sunny: SunnyIcon, 'partly-cloudy': PartlyCloudyIcon,
  cloudy: CloudyIcon, rainy: RainyIcon, thunder: ThunderIcon,
};

// ── Main widget ───────────────────────────────────────────────────────────────
export default function HeroWidgets() {
  const [now,     setNow]     = useState(() => new Date());
  const [weather, setWeather] = useState(null);
  const [unit,    setUnit]    = useState('C');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&temperature_unit=celsius&timezone=America%2FCuracao`
    )
      .then(r => r.json())
      .then(d => setWeather({
        tempC: d.current.temperature_2m,
        code:  d.current.weather_code,
        hiC:   d.daily.temperature_2m_max[0],
        loC:   d.daily.temperature_2m_min[0],
      }))
      .catch(() => {});
  }, []);

  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now);

  const condition = weather ? wmoToCondition(weather.code) : { type: 'cloudy', label: '' };
  const Icon      = ICONS[condition.type] ?? ICONS.cloudy;

  const temp = weather ? (unit === 'C' ? Math.round(weather.tempC) : toF(weather.tempC)) : null;
  const hi   = weather ? (unit === 'C' ? Math.round(weather.hiC)   : toF(weather.hiC))   : null;
  const lo   = weather ? (unit === 'C' ? Math.round(weather.loC)   : toF(weather.loC))   : null;

  return (
    <div className="hero-widgets" aria-label="Willemstad, Curaçao — time and weather">

      {/* ── Row 1: big clock  |  icon + big temp + toggle ── */}
      <div className="hw-main">

        <time className="hw-time" dateTime={now.toISOString()}>{timeStr}</time>

        <div className={`hw-weather-group hw-weather--${condition.type}`}>
          <div className="hw-icon-wrap"><Icon /></div>

          {temp !== null
            ? <span className="hw-temp">{temp}°</span>
            : <span className="hw-temp hw-temp--loading">—°</span>
          }

          <button
            className="hw-unit-toggle"
            onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          >
            °{unit}
          </button>
        </div>

      </div>

      {/* ── Row 2: location  |  hi/lo · condition ── */}
      <div className="hw-sub">
        <p className="hw-location">Willemstad, Curaçao</p>
        {hi !== null && (
          <div className="hw-meta">
            <span className="hw-hi">↑{hi}°</span>
            <span className="hw-lo">↓{lo}°</span>
            {condition.label && <><span className="hw-dot">·</span><span className="hw-label">{condition.label}</span></>}
          </div>
        )}
      </div>

    </div>
  );
}

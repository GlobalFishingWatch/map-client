const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

export default function (h_, s_, v_) {
  const h = (h_ === HUE_MAX) ? 1 : (h_ % HUE_MAX / parseFloat(HUE_MAX) * 6);
  const s = (s_ === SV_MAX) ? 1 : (s_ % SV_MAX / parseFloat(SV_MAX));
  const v = (v_ === SV_MAX) ? 1 : (v_ % SV_MAX / parseFloat(SV_MAX));

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return { r: Math.round(r * RGB_MAX), g: Math.round(g * RGB_MAX), b: Math.round(b * RGB_MAX) };
}

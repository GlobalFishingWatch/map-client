const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
export const rgbToHsv = (_r, _g, _b) => {
  const r = _r / 255;
  const g = _g / 255;
  const b = _b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = ((g - b) / d) + (g < b ? 6 : 0);
        break;
      case g:
        h = ((b - r) / d) + 2;
        break;
      case b:
        h = ((r - g) / d) + 4;
        break;
      default:
        h = 0;
    }

    h /= 6;
  }

  return [h, s, v];
};

// converts hue, saturation, luminance to an rgb object
export const hsvToRgb = (h_, s_, v_) => {
  const h = (h_ === HUE_MAX) ? 1 : (((h_ % HUE_MAX) / parseFloat(HUE_MAX)) * 6);
  const s = (s_ === SV_MAX) ? 1 : ((s_ % SV_MAX) / parseFloat(SV_MAX));
  const v = (v_ === SV_MAX) ? 1 : ((v_ % SV_MAX) / parseFloat(SV_MAX));

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - (f * s));
  const t = v * (1 - ((1 - f) * s));
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return { r: Math.round(r * RGB_MAX), g: Math.round(g * RGB_MAX), b: Math.round(b * RGB_MAX) };
};

// returns an rgb string with default saturation and luminance values
const hueToRgbDefaults = hue => hsvToRgb(hue, 50, 100);

export const hueToRgbString = (hue) => {
  const rgb = hueToRgbDefaults(hue);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const hueToRgbHexString = (hue) => {
  const rgb = hueToRgbDefaults(hue);
  return `0x${rgb.r.toString(16)}${rgb.g.toString(16)}${rgb.b.toString(16)}`;
};

export const hueToRgbaString = (hue, alpha) => {
  const rgb = hueToRgbDefaults(hue);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const hexToHue = (hex) => {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  return hsv[0] * 360;
};


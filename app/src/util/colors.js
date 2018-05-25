import {
  VESSELS_HUES_INCREMENTS_NUM,
  VESSELS_HUES_INCREMENT,
  COLOR_HUES
} from 'config';

const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

// FIXME mark explicitely as legacy. Check all usages.
export const getKeyByValue = (obj, value) => {
  let result = null;
  Object.entries(obj).forEach((entry) => {
    if (entry[1] === value) result = entry[0];
  });
  return result;
};

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
  const h = (((h_ % HUE_MAX) / parseFloat(HUE_MAX)) * 6);
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

export const rgbToHexString = (rgb, css) => {
  const str = ['r', 'g', 'b'].map((channelName) => {
    const channelValue = rgb[channelName];
    let channelStr = channelValue.toString(16);
    if (channelValue < 16) {
      channelStr = `0${channelStr}`;
    }
    return channelStr;
  }).join('');
  const prefix = (css === true) ? '#' : '0x';
  return `${prefix}${str}`;
};

export const hueToRgbHexString = (hue, css) => {
  const rgb = hueToRgbDefaults(hue);
  return rgbToHexString(rgb, css);
};

const closestNumber = (numberArray, goal) =>
  numberArray.reduce((prev, curr) =>
    (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
  );

export const hueToClosestColor = (hue) => {
  if (hue === undefined || hue === null) return undefined;
  const colorHueValues = Object.keys(COLOR_HUES).map(key => COLOR_HUES[key]);
  const closestHue = closestNumber(colorHueValues, hue);
  return getKeyByValue(COLOR_HUES, closestHue);
};


function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const rgbToRgbaString = (rgb, opacity) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

export const hueToRgbaString = (hue, opacity) => {
  const rgb = hueToRgbDefaults(hue);
  return rgbToRgbaString(rgb, opacity);
};

export const hexToRgba = (hex, opacity) => {
  const rgb = hexToRgb(hex);
  return rgbToRgbaString(rgb, opacity);
};

export const hueIncrementToHue = hueIncrement => hueIncrement * VESSELS_HUES_INCREMENT;

export const hueToHueIncrement = hue => Math.round((hue / 360) * (VESSELS_HUES_INCREMENTS_NUM - 1));

export const wrapHue = hue => hue % 360;

export const hueOrColorToHexColor = (color, hue) => {
  if (hue !== undefined) {
    return hueToRgbHexString(hue, true);
  }
  return color;
};

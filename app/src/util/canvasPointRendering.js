import { CANVAS_POINT_MIN_RADIUS, CANVAS_POINT_MIN_ALPHA } from '../constants';

export default {
  getRadius: (weight, /* sigma */ zoom) => {
    // seems like sigma is already zoom dependant?
    // const normalizedSigma = Math.max(1, 3 * (Math.log(1+sigma)/zoomMult));
    const zoomMult = 1 + Math.abs(zoom - 3) * 1.2;
    const radius = CANVAS_POINT_MIN_RADIUS + zoomMult * weight * 0.05;
    return radius;
  },
  getAlpha: (weight, vesselTransparency) =>
    Math.max(CANVAS_POINT_MIN_ALPHA, Math.min(1, weight / vesselTransparency))
};

export default {
  getRadius: (weight, /* sigma */ zoom) => {
    // seems like sigma is already zoom dependant?
    // const normalizedSigma = Math.max(1, 3 * (Math.log(1+sigma)/zoomMult));
    const zoomMult = 1 + Math.abs(zoom - 3) * 1.2;
    const radius = 2 + zoomMult * weight * 0.03;
    return radius;
  },
  getAlpha: (weight, vesselTransparency) =>
    Math.max(0.5, Math.min(1, weight / vesselTransparency))
};

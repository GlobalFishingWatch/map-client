export default (layer) => {
  if (layer.id !== undefined) {
    return layer.id;
  }
  if (layer.url !== undefined) {
    const apiIndirectionUrlRegex = /v(1|2)\/directory\/(\w*)\/source$/g;
    const apiIndirectionUrlMatches = apiIndirectionUrlRegex.exec(layer.url);
    if (apiIndirectionUrlMatches) {
      return apiIndirectionUrlMatches[1];
    }
    const cartoVizzJsonRegex = /\/(\w|-)*\/viz.json$/g;
    const cartoVizzJsonMatches = cartoVizzJsonRegex.exec(layer.url);
    if (cartoVizzJsonMatches) {
      return cartoVizzJsonMatches[1];
    }
    const fishingEffortUrlRegex = /v(1|2)\/tilesets\/((\w|-)*)$/g;
    const fishingEffortUrlMatches = fishingEffortUrlRegex.exec(layer.url);
    if (fishingEffortUrlMatches) {
      return fishingEffortUrlMatches[1];
    }
    // Simply hash the URL
    return `${layer.url.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)}`;
  }

  console.warn('Could not determine layer id, using random string instead.', layer);
  return Math.random().toString(36).substring(7);
};

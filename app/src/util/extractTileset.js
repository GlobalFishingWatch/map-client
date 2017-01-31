export default (layerURL) => {
  const apiIndirectionUrlRegex = /v1\/tilesets\/((\w|-)*)$/g;
  const apiIndirectionUrlMatches = apiIndirectionUrlRegex.exec(layerURL);
  if (apiIndirectionUrlMatches) {
    return apiIndirectionUrlMatches[1];
  }
  return null;
};

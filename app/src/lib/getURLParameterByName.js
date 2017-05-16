export function getURLParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Picks up on URLs like foo.com/key/value/
 * @param name
 * @param url
 * @returns {*}
 */

export function getURLPieceByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("\/" + name + "\/([a-zA-Z0-9\-]*)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[1]) return '';
  return results[1];
}

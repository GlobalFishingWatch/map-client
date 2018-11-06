// This utility looks at GeoJSON features and returns the predominant geometry type

const TYPES = [
  { gl: 'line', geoJSON: ['LineString', 'MultiLineString'] },
  { gl: 'fill', geoJSON: ['Polygon', 'MultiPolygon'] },
  { gl: 'circle', geoJSON: ['Point', 'MultiPoint'] }
];

export default (geoJSON) => {
  // collect all geoJSON geom types
  const allGeoJSONTypes = geoJSON.features.map((feature) => {
    const geom = feature.geometry;
    if (geom === undefined) {
      return null;
    }
    return geom.type;
  });

  // collect number of geometries by GL geom types
  const numByGLType = TYPES.map((type) => {
    let num = 0;
    allGeoJSONTypes.forEach((geoJSONType) => {
      if (type.geoJSON.indexOf(geoJSONType) > -1) {
        num++;
      }
    });
    return { gl: type.gl, num };
  });

  // get feature types with the higher count
  let glType = 'fill';
  let glTypeMax = 0;
  numByGLType.forEach((t) => {
    if (t.num > glTypeMax) {
      glType = t.gl;
      glTypeMax = t.num;
    }
  });

  return glType;

};

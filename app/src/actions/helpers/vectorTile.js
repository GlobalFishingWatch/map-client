import Pbf from 'pbf';
import { VectorTile } from 'vector-tile';

window.cumulatedDecTime = 0;
function measure(ts) {
  cumulatedDecTime += performance.now() - ts;
  console.log('cumulatedDecTime',cumulatedDecTime)
}

export default (params) => {
//   const tileCoords = `${params.tileCoordinates.zoom}/${params.tileCoordinates.x}/${params.tileCoordinates.y}`;
//   const tileUrl = `http://localhost:7070/${tileCoords}.pbf`;

  const tileCoords = `${params.tileCoordinates.zoom},${params.tileCoordinates.x},${params.tileCoordinates.y}`;
  const tileUrl = `http://localhost:8009/data/tiles/${tileCoords}.pbf`;

  const vectorTilePromise = fetch(tileUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`could not load tile ${tileCoords}`);
    }
    return response.blob().then((blob) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.addEventListener('loadend', () => {
          // reader.result contains the contents of blob as a typed array
          // blob.type === 'application/x-protobuf'
          console.log(`reading tile ${tileCoords}`);
          const ts = performance.now();
          const pbf = new Pbf(reader.result);
          console.log(pbf)
          console.log('vector tile?')
          const vectorTile = new VectorTile(pbf);
          console.log('vector tile')
          measure(ts)
          console.log(vectorTile)
          return resolve(vectorTile);
        });
        reader.readAsArrayBuffer(blob);
      });
    });
  }).catch((err) => {
    console.log(err);
  })
  return vectorTilePromise;
};

import Pbf from 'pbf';
import {VectorTile} from 'vector-tile';

export default (params) => {
  console.log(params);
  const tileUrl = `http://localhost:7070/${params.tileCoordinates.zoom}/${params.tileCoordinates.x}/${params.tileCoordinates.y}.pbf`;
  console.log(tileUrl);
  // return fetch(tileUrl);
  const vectorTilePromise = fetch(tileUrl).then((response) => {
    return response.blob().then((blob) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.addEventListener('loadend', () => {
          // reader.result contains the contents of blob as a typed array
          // blob.type === 'application/x-protobuf'
          const pbf = new Pbf(reader.result);
          const vectorTile = new VectorTile(pbf);
          console.log(vectorTile)
          return resolve(vectorTile);
        });
        reader.readAsArrayBuffer(blob);
      });
    });
  }).catch(() => {
    console.log(arguments);
  })
  return vectorTilePromise;
};

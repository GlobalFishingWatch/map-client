import Pbf from 'pbf';
import { VectorTile } from 'vector-tile';

export default (tileUrl) => {
  const vectorTilePromise = fetch(tileUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`could not load tile ${tileUrl}`);
    }
    return response.blob().then((blob) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.addEventListener('loadend', () => {
          // reader.result contains the contents of blob as a typed array
          // blob.type === 'application/x-protobuf'
          console.log(`reading tile ${tileUrl}`);
          const pbf = new Pbf(reader.result);
          console.log(pbf)
          console.log('vector tile?')
          const vectorTile = new VectorTile(pbf);
          console.log('vector tile')
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

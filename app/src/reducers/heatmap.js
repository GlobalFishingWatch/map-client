import {
  SET_LAYERS,
  UPDATE_HEATMAP_TILES
} from '../actions';

// a dict of heatmap layers (key is layer id)
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS: {
      var p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "one");
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 200, "two");
});
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 300, "three");
});
var p4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 400, "four");
});

var p1p2 = Promise.all([p1, p2]);
var p3p4 = Promise.all([p3, p4]);

p1p2.then(values => {
  console.log(values);
}, reason => {
  console.log(reason)
});

Promise.all([p1p2, p3p4]).then(values => {
  console.log(values);
}, reason => {
  console.log(reason)
});
      const newState = {};
      action.payload.forEach(layer => {
        if (layer.type === 'ClusterAnimation') {
          newState[layer.id] = {
            url: layer.source.args.url,
            tiles: []
          };
        }
      });
      return newState;
    }

    case UPDATE_HEATMAP_TILES: {
      console.log(action.payload)
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
}

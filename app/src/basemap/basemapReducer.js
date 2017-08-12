/* eslint-disable max-len  */
import {
  SET_BASEMAP
} from 'actions';

const initialState = {
  activeBasemap: 'hybrid',
  basemaps: [
    {
      title: 'hybrid',
      label: 'Satellite',
      description: 'The default satellite image view',
      type: 'GoogleBasemap'
    },
    {
      title: 'Deep Blue',
      label: 'Deep Blue',
      description: 'Custom basemap that highlights the data about fishing activity',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/enriquetuya/cj3vr6qy802b72so7jvennfkg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5yaXF1ZXR1eWEiLCJhIjoiY2loNmFwYjJuMDlzZnR4bHh3NnRyNmQxcCJ9.vf_v5i6RWNz5Q7rglf35pQ'
    },
    {
      title: 'High Contrast',
      label: 'High Contrast',
      description: 'High contrast basemap, that highlights borders and shore. Ideal for usage with projectors',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/enriquetuya/cj3vr7wzg02cy2rpcx1kteotc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5yaXF1ZXR1eWEiLCJhIjoiY2loNmFwYjJuMDlzZnR4bHh3NnRyNmQxcCJ9.vf_v5i6RWNz5Q7rglf35pQ'
    }
  ]
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BASEMAP:
      return Object.assign({}, state, { activeBasemap: action.payload || state.activeBasemap });
    default:
      return state;
  }
}

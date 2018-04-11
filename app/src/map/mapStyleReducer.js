import BASEMAP from 'map/gl-styles/basemap.json';
import { fromJS } from 'immutable';
import {
  SET_BASEMAP
} from 'map/mapStyleActions';


const initialState = {
  mapStyle: fromJS(BASEMAP),
  activeBasemap: 'North Star',
  basemaps: [
    {
      title: 'hybrid',
      label: 'Satellite',
      description: 'The default satellite image view',
      satellite: true
    },
    {
      title: 'North Star',
      label: 'North Star',
      description: 'Custom basemap showing bathymetry, parallels and ports',
      satellite: false
    }
  ]
};

const SATELLITE_ID = 'mapbox-satellite';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BASEMAP : {
      const satellite = state.basemaps.find(basemap => basemap.title === action.payload).satellite;
      const satelliteLayerIndex = state.mapStyle.toJS().layers.findIndex(layer => layer.id === SATELLITE_ID);
      const visibility = (satellite === true) ? 'visible' : 'none';
      const mapStyle = state.mapStyle.setIn(['layers', satelliteLayerIndex, 'layout', 'visibility'], visibility);
      return { ...state, mapStyle, activeBasemap: action.payload };
    }
    default:
      return state;
  }
}

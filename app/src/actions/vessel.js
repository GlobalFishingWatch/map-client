import {VESSEL_INIT, VESSEL_ZOOM_UPDATE} from '../constants';

export function init(){
  return {
    type: VESSEL_INIT,
    payload:{
      visible: true,
      load: true
    }
  };
}

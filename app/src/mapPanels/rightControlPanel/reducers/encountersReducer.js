import { INFO_STATUS } from 'constants';
import {
  CLEAR_ENCOUNTERS_INFO,
  SET_ENCOUNTERS_INFO
} from 'mapPanels/rightControlPanel/actions/encounters';


const initialState = {
  encountersInfo: null,
  infoPanelStatus: INFO_STATUS.HIDDEN,
  encounters: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.HIDDEN,
        encountersInfo: null
      });
    }

    case SET_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADED,
        encountersInfo: action.payload.encounterInfo
      });
    }
    default:
      return state;
  }
}

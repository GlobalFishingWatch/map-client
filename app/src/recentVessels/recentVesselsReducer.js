import {
  LOAD_RECENT_VESSEL_LIST,
  SET_RECENT_VESSEL_HISTORY,
  SET_RECENT_VESSELS_VISIBILITY
} from 'recentVessels/recentVesselsActions';

const initialState = {
  history: [],
  recentVesselModal: {
    open: false
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_RECENT_VESSEL_HISTORY: {
      const newVessel = {};
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentVessel = state.vessels[vesselIndex];
      let vesselHistoryIndex = -1;
      let vesselHistory = {};

      if (state.history.length > 0) {
        vesselHistoryIndex = state.history.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
        vesselHistory = state.history[vesselHistoryIndex];
      }

      Object.assign(newVessel, vesselHistory, {
        mmsi: currentVessel.mmsi,
        seriesgroup: currentVessel.seriesgroup,
        vesselname: currentVessel.vesselname,
        pinned: currentVessel.pinned,
        tilesetId: currentVessel.tilesetId
      });

      if (vesselHistoryIndex !== -1) {
        return Object.assign({}, state, {
          history: [...state.history.slice(0, vesselHistoryIndex), newVessel, ...state.history.slice(vesselHistoryIndex + 1)]
        });
      }

      try {
        const serializedState = JSON.stringify([newVessel, ...state.history]);
        localStorage.setItem('vessel_history', serializedState);
      } catch (err) {
        return Object.assign({}, state, {
          history: [newVessel, ...state.history]
        });
      }

      return Object.assign({}, state, {
        history: [newVessel, ...state.history]
      });
    }

    case LOAD_RECENT_VESSEL_LIST: {
      try {
        const serializedState = localStorage.getItem('vessel_history');

        if (serializedState === null) {
          return state;
        }

        return Object.assign({}, state, {
          history: JSON.parse(serializedState)
        });
      } catch (err) {
        return state;
      }
    }

    case SET_RECENT_VESSELS_VISIBILITY: {
      const newState = Object.assign({}, state);
      newState.recentVesselModal = {
        open: action.payload
      };

      return newState;
    }
    default:
      return state;
  }
}

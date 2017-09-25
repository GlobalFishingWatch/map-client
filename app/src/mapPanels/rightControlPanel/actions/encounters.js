export const HIDE_ENCOUNTERS_INFO_PANEL = 'HIDE_ENCOUNTERS_INFO_PANEL';
export const SET_ENCOUNTERS_INFO = 'SET_ENCOUNTERS_INFO';
export const CLEAR_ENCOUNTERS_INFO = 'CLEAR_ENCOUNTERS_INFO';

export function hideEncountersInfoPanel() {
  return {
    type: HIDE_ENCOUNTERS_INFO_PANEL
  };
}

export function clearEncountersInfo() {
  return {
    type: CLEAR_ENCOUNTERS_INFO
  };
}

export function setEncountersInfo() {
  return (dispatch) => {
    const fakeEncounter = {
      duration: '100000',
      vessels: [
        {
          tilesetId: '12222',
          vesselTypeName: 'ENCOUNTER_BOAT',
          seriesgroups: [111222, 222333]
        },
        {
          tilesetId: 'SELF'
        }
      ]
    };

    dispatch({
      type: SET_ENCOUNTERS_INFO,
      payload: {
        encounterInfo: fakeEncounter
      }
    });
  };
}


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

export function setEncountersInfo(data) {
  return (dispatch) => {
    // /info is called on the encounters tileset, which results in the following response structure:
    const fakeEncounter = {
      duration: data.duration || '10h', // this should be a date object
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

    // For each vessel object in the vessels array:
    // - if tilesetId is “SELF”:
    //   - /info is called on the encounters tileset, retrieving data about the vessel
    //   Query parameters: encounterId (from encounter point)
    //   - tracks endpoint is called for all available years, on the encounters tileset.
    //       Query parameters: encounterId(from encounter point)

    // - else
    // - /info is called on the tileset with tilesetId, retrieving data about the vessel.
    //     Query parameters: seriesgroup (from seriesgroup array)
    // - tracks endpoint is called for all available years, on the tileset with tilesetId.
    //     Query parameters: seriesgroup (from seriesgroup array)
      // fake data

    dispatch({
      type: SET_ENCOUNTERS_INFO,
      payload: {
        encounterInfo: fakeEncounter
      }
    });
  };
}


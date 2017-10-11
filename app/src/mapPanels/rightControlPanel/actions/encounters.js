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


function get(url, token) {
  if (typeof XMLHttpRequest === 'undefined') {
    throw new Error('XMLHttpRequest is disabled');
  }
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  if (token) { request.setRequestHeader('Authorization', `Bearer ${token}`); }
  request.setRequestHeader('Accept', 'application/json');
  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status >= 500 || request.status === 404) {
      console.error('Error loading info:', request.responseText);
    }
  };

  if (request.responseText === '') {
    console.error('Error: Empty Response', url);
    return undefined;
  }

  return JSON.parse(request.responseText);
}

function getEncountersInfo(encounterId, token) {
  // /info is called on the encounters tileset, which results in the following response structure:
  if (encounterId === 'fakeEncounter') {
    return {
      duration: '10h', // same duration format as vessels datetimes
      vessels: [
        {
          tilesetId: '429-resample-v1-tms',
          vesselTypeName: 'ENCOUNTER_BOAT',
          seriesgroups: [111222, 222333]
        },
        {
          tilesetId: 'SELF'
        }
      ]
    };
  }

  const url = `???/sub/encounterId=${encounterId}/info`;
  return get(url, token);
}

function getVesselInfo(encounterPoint, vessel, token, workspaceLayers) {
  const tilesetId = vessel ? vessel.tilesetId : 'reefersTilesetId';
  const layer = workspaceLayers.find(l => l.tilesetId === tilesetId);
  if (layer === undefined) {
    console.error(`Error loading vessel info: layer ${vessel.tilesetId} is not found`);
    return undefined;
  }
  const encounterId = vessel.encounterId;

  const url = encounterId !== undefined ?
    `${layer.url}/sub/seriesgroup=${encounterPoint.encounterId}/info` :
    `${layer.url}/sub/seriesgroup=${vessel.seriesgroup}/info`;
  return get(url, token);
}


export function setEncountersInfo(data) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;

    const fakeEncounterPointInfo = {
      encounterId: 'fakeEncounter',
      datetime: '2018-01-01T00:00:00.000Z',
      worldY: '-35.4607',
      worldX: '-36.4603'
    };

    let encounterPointInfo = data;
    encounterPointInfo = fakeEncounterPointInfo;

    const encounterId = encounterPointInfo.encounterId;
    const fakeEncounter = getEncountersInfo(encounterId, token);

    fakeEncounter.vessels.forEach((vessel) => {
      if (vessel.tilesetId === 'SELF') {
        getVesselInfo(encounterPointInfo, null, token, state.layers.workspaceLayers);
        //   - tracks endpoint is called for all available years, on the encounters tileset.
        //   ${tilesetUrl}/v2/tilesets/${tilesetId}/sub/seriesgroup=${seriesGroup}/${startDate},${endDate};0,0,0
        //       Query parameters: encounterId(from encounter point)
      } else {
        getVesselInfo(encounterPointInfo, vessel, token, state.layers.workspaceLayers);
        // - tracks endpoint is called for all available years, on the tileset with tilesetId.
        //   ${tilesetUrl}/v2/tilesets/${tilesetId}/sub/seriesgroup=${seriesGroup}/${startDate},${endDate};0,0,0
        //     Query parameters: seriesgroup (from seriesgroup array)
      }
    });

    dispatch({
      type: SET_ENCOUNTERS_INFO,
      payload: {
        encounterInfo: fakeEncounter
      }
    });
  };
}


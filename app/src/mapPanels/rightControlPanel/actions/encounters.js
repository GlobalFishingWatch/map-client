import fetchEndpoint from 'util/fetchEndpoint';
import { getTrack, deleteTracks } from 'tracks/tracksActions';

export const LOAD_ENCOUNTERS_INFO = 'LOAD_ENCOUNTERS_INFO';
export const SET_ENCOUNTERS_INFO = 'SET_ENCOUNTERS_INFO';
export const SET_ENCOUNTERS_VESSEL_INFO = 'SET_ENCOUNTERS_VESSEL_INFO';
export const CLEAR_ENCOUNTERS_INFO = 'CLEAR_ENCOUNTERS_INFO';
export const HIDE_ENCOUNTERS_INFO_PANEL = 'HIDE_ENCOUNTERS_INFO_PANEL';

export function hideEncountersInfoPanel() {
  return {
    type: HIDE_ENCOUNTERS_INFO_PANEL
  };
}

export function clearEncountersInfo() {
  return (dispatch, getState) => {
    const currentEncountersInfo = getState().encounters.encountersInfo;
    if (currentEncountersInfo === null) {
      return;
    }
    const seriesgroupArray = currentEncountersInfo.vessels.map(v => v.seriesgroup);
    dispatch(deleteTracks(seriesgroupArray));
    dispatch({
      type: CLEAR_ENCOUNTERS_INFO
    });
  };
}

export function setEncountersInfo() {
  return (dispatch, getState) => {

    dispatch({
      type: LOAD_ENCOUNTERS_INFO
    });

    setTimeout(() => {
      // This data simulates the result of a call to /info on the encounters endpoint
      // That call should use the provided tilesetId and selectedSeries
      const encounterInfo = {
        duration: 50400000,
        datetime: 1467331199000,
        vessels: [
          {
            tilesetId: '516-resample-v2',
            vesselTypeName: 'Vessel',
            seriesgroup: 7610113
          },
          {
            tilesetId: '525-indo-public-parametrize-v6',
            vesselTypeName: 'Reefer',
            seriesgroup: 4718598
          }
        ]
      };

      const workspaceLayers = getState().layers.workspaceLayers;
      const token = getState().user.token;

      encounterInfo.vessels.forEach((vessel) => {
        const workspaceLayer = workspaceLayers.find(layer => layer.tilesetId === vessel.tilesetId);
        const url = workspaceLayer.url;
        fetchEndpoint(`${url}/sub/seriesgroup=${vessel.seriesgroup}/info`, token).then((info) => {
          dispatch({
            type: SET_ENCOUNTERS_VESSEL_INFO,
            payload: {
              seriesgroup: vessel.seriesgroup,
              info
            }
          });
        });
      });

      // fetch(`${baseUrl}/sub/seriesgroup=${selectedSeries}/info`).then((res) => {
      //   if (!res.ok) {
      //     throw new Error(`Error  ${res.status} - ${res.statusText}`);
      //   }
      //   return res;
      // }).then(res => res.json())
      //   .then((data) => {
      //     console.log(data);
      //   });

      // TODO call /info on both vessels, to get vessels details
      dispatch({
        type: SET_ENCOUNTERS_INFO,
        payload: {
          encounterInfo
        }
      });

      // get tracks for both vessels
      encounterInfo.vessels.forEach((vessel) => {
        dispatch(getTrack({
          tilesetId: vessel.tilesetId,
          seriesgroup: vessel.seriesgroup,
          series: null,
          zoomToBounds: false,
          updateTimelineBounds: false
        }));
      });
    }, 200);

  };
}

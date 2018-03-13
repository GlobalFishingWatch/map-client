import fetchEndpoint from 'util/fetchEndpoint';
import { getTrack, deleteTracks } from 'tracks/tracksActions';
import { VESSEL_TYPE_REEFER } from 'constants';
import { ENCOUNTERS_VESSEL_COLOR, ENCOUNTERS_REEFER_COLOR } from 'config';
import buildEndpoint from 'util/buildEndpoint';

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
    dispatch({
      type: CLEAR_ENCOUNTERS_INFO
    });
    if (currentEncountersInfo !== null) {
      const seriesgroupArray = currentEncountersInfo.vessels.map(v => v.seriesgroup);
      dispatch(deleteTracks(seriesgroupArray));
    }
  };
}

export function setEncountersInfo(seriesgroup, tilesetId, encounterInfoEndpoint) {
  return (dispatch, getState) => {

    dispatch({
      type: LOAD_ENCOUNTERS_INFO,
      payload: {
        seriesgroup,
        tilesetId
      }
    });

    const infoUrl = encounterInfoEndpoint.replace('$SERIES', seriesgroup);

    fetchEndpoint(infoUrl).then((info) => {
      const encounterInfo = info.rows[0];
      encounterInfo.vessels = [{
        tilesetId: encounterInfo.vessel_1_tileset,
        seriesgroup: encounterInfo.vessel_1_seriesgroup,
        vesselTypeName: encounterInfo.vessel_1_type
      }, {
        tilesetId: encounterInfo.vessel_2_tileset,
        seriesgroup: encounterInfo.vessel_2_seriesgroup,
        vesselTypeName: encounterInfo.vessel_2_type
      }];

      dispatch({
        type: SET_ENCOUNTERS_INFO,
        payload: {
          encounterInfo
        }
      });

      const workspaceLayers = getState().layers.workspaceLayers;
      const token = getState().user.token;

      encounterInfo.vessels.forEach((vessel) => {
        const workspaceLayer = workspaceLayers.find(layer => layer.tilesetId === vessel.tilesetId);
        fetchEndpoint(buildEndpoint(workspaceLayer.header.endpoints.info, { id: seriesgroup }), token).then((vesselInfo) => {
          dispatch({
            type: SET_ENCOUNTERS_VESSEL_INFO,
            payload: {
              seriesgroup: vessel.seriesgroup,
              vesselInfo
            }
          });
        });
      });

      // get tracks for both vessels
      encounterInfo.vessels.forEach((vessel) => {
        dispatch(getTrack({
          tilesetId: vessel.tilesetId,
          seriesgroup: vessel.seriesgroup,
          series: null,
          zoomToBounds: false,
          updateTimelineBounds: false,
          color: (vessel.vesselTypeName === VESSEL_TYPE_REEFER) ? ENCOUNTERS_REEFER_COLOR : ENCOUNTERS_VESSEL_COLOR
        }));
      });
    });

  };
}

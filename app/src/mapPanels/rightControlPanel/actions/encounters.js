// import { getVesselTrack } from 'actions/vesselInfo';

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

export function setEncountersInfo(/* tilesetId, selectedSeries */) {
  return (dispatch) => {
    // This data simulates the result of a call to /info on the encounters endpoint
    // That call should use the provided tilesetId and selectedSeries
    const encounterInfo = {
      duration: 50400000,
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

    // TODO call /info on both vessels, to get vessel details
    dispatch({
      type: SET_ENCOUNTERS_INFO,
      payload: {
        encounterInfo
      }
    });


    // get tracks for both vessels
    // TODO this won't work because the vesselInfo reducer will try to add a track to an existing vessel (which doesn't exist here)
    // either manage tracks triggered by encounters in the encounters reducer, or continue using the vesselInfo reducer,
    // handling tracks that don't belong to any vesselInfo (which are used in vessel info panel and pinned vessels panel)
    //
    // encounterInfo.vessels.forEach((vessel) => {
    //   dispatch(getVesselTrack({
    //     tilesetId: vessel.tilesetId,
    //     seriesgroup: vessel.seriesgroup,
    //     series: null,
    //     zoomToBounds: false,
    //     updateTimelineBounds: false
    //   }));
    // });
  };
}

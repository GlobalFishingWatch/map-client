import _ from 'lodash';
import { TIMELINE_MIN_INNER_EXTENT } from 'constants';
import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SHOW_VESSEL_CLUSTER_INFO,
  SET_TRACK_BOUNDS,
  SHOW_NO_VESSELS_INFO,
  TOGGLE_VESSEL_PIN,
  ADD_VESSEL,
  SHOW_VESSEL_DETAILS,
  SET_PINNED_VESSEL_HUE,
  LOAD_PINNED_VESSEL,
  SET_PINNED_VESSEL_TITLE,
  TOGGLE_PINNED_VESSEL_EDIT_MODE,
  SET_RECENT_VESSEL_HISTORY,
  LOAD_RECENT_VESSEL_HISTORY
} from 'actions';
import {
  setInnerTimelineDates,
  setOuterTimelineDates
} from 'actions/filters';
import { trackSearchResultClicked, trackVesselPointClicked } from 'actions/analytics';
import { getTilePelagosPromises, getCleanVectorArrays, groupData, addTracksWorldCoordinates } from 'actions/helpers/heatmapTileData';

export function setRecentVesselHistory(seriesgroup) {
  return {
    type: SET_RECENT_VESSEL_HISTORY,
    payload: {
      seriesgroup
    }
  };
}

export function loadRecentVesselHistory() {
  return {
    type: LOAD_RECENT_VESSEL_HISTORY,
    payload: null
  };
}

function setCurrentVessel(layerId, seriesgroup, fromSearch) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;
    let request;

    if (typeof XMLHttpRequest !== 'undefined') {
      request = new XMLHttpRequest();
    } else {
      throw new Error('XMLHttpRequest is disabled');
    }
    request.open(
      'GET',
      `${state.map.tilesetUrl}/sub/seriesgroup=${seriesgroup}/info`,
      true
    );
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    request.setRequestHeader('Accept', 'application/json');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      const data = JSON.parse(request.responseText);
      delete data.series;

      if (fromSearch) {
        dispatch(trackSearchResultClicked(state.map.tilesetUrl, seriesgroup));
      } else {
        dispatch(trackVesselPointClicked(state.map.tilesetUrl, seriesgroup));
      }

      data.layerId = layerId;

      dispatch({
        type: SET_VESSEL_DETAILS,
        payload: data
      });
      dispatch({
        type: SHOW_VESSEL_DETAILS,
        payload: {
          seriesgroup: data.seriesgroup
        }
      });

      dispatch(setRecentVesselHistory(data.seriesgroup));
    };
    request.send(null);
  };
}

export function setPinnedVessels(pinnedVessels) {
  return (dispatch, getState) => {
    const state = getState();
    const options = {
      Accept: '*/*'
    };

    options.headers = {
      Authorization: `Bearer ${state.user.token}`
    };

    pinnedVessels.forEach((pinnedVessel) => {
      let request;

      if (typeof XMLHttpRequest !== 'undefined') {
        request = new XMLHttpRequest();
      } else {
        throw new Error('XMLHttpRequest is disabled');
      }

      const baseURL = pinnedVessel.tilesetUrl || state.map.tilesetUrl;
      request.open(
        'GET',
        `${baseURL}/sub/seriesgroup=${pinnedVessel.seriesgroup}/info`,
        true
      );
      if (state.user.token) {
        request.setRequestHeader('Authorization', `Bearer ${state.user.token}`);
      }
      request.setRequestHeader('Accept', 'application/json');
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.responseText === 'Not Found') {
          console.warn('vessel info not found');
          return;
        }
        const data = JSON.parse(request.responseText);
        delete data.series;
        dispatch({
          type: LOAD_PINNED_VESSEL,
          payload: Object.assign({}, pinnedVessel, data)
        });

        dispatch(setRecentVesselHistory(pinnedVessel.seriesgroup));
      };
      request.send(null);
    });
  };
}

export function showVesselClusterInfo() {
  return {
    type: SHOW_VESSEL_CLUSTER_INFO
  };
}

export function showNoVesselsInfo() {
  return {
    type: SHOW_NO_VESSELS_INFO
  };
}

function getTrackTimeExtent(data, series = null) {
  let start = Infinity;
  let end = 0;
  for (let i = 0, length = data.datetime.length; i < length; i++) {
    if (series !== null && series !== data.series[i]) {
      continue;
    }
    const time = data.datetime[i];
    if (time < start) {
      start = time;
    } else if (time > end) {
      end = time;
    }
  }
  return [start, end];
}

function getVesselTrack(layerId, seriesgroup, series = null, zoomToBounds = false) {
  return (dispatch, getState) => {
    const map = getState().map.googleMaps;
    console.warn('seriesgroup', seriesgroup, 'series', series);
    const state = getState();

    let layerId_ = layerId;
    // TODO remove when layerId is passed around when using search
    if (layerId === null || layerId === undefined) {
      console.warn('layerId not sent, using default tileset');
      layerId_ = '849-tileset-tms';
    }

    const currentLayer = state.layers.workspaceLayers.find(layer => layer.id === layerId_);
    const header = currentLayer.header;
    // TODO use URL from header
    const url = currentLayer.url;
    const promises = getTilePelagosPromises(url, state.user.token, header.temporalExtents, { seriesgroup });

    Promise.all(promises.map(p => p.catch(e => e)))
      .then((rawTileData) => {
        const cleanData = getCleanVectorArrays(rawTileData);
        const groupedData = groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight'
        ]);
        const vectorArray = addTracksWorldCoordinates(groupedData, map);

        dispatch({
          type: SET_VESSEL_TRACK,
          payload: {
            seriesgroup,
            seriesGroupData: vectorArray,
            series: _.uniq(groupedData.series),
            selectedSeries: series,
            tilesetUrl: state.map.tilesetUrl
          }
        });

        // change Timebar bounds, so that
        // - outer bounds fits time range of tracks (filtered by series if applicable)
        // - outer bounds is not less than a week
        // - inner bounds start is moved to beginning of outer bounds if it's outside
        // - inner bounds end is moved to fit in outer bounds
        const tracksExtent = getTrackTimeExtent(groupedData, series);
        let tracksDuration = tracksExtent[1] - tracksExtent[0];

        if (tracksDuration < TIMELINE_MIN_INNER_EXTENT) {
          tracksExtent[1] = tracksExtent[0] + TIMELINE_MIN_INNER_EXTENT;
          tracksDuration = TIMELINE_MIN_INNER_EXTENT;
        }

        const currentInnerExtent = state.filters.timelineInnerExtent;
        const currentInnerExtentStart = currentInnerExtent[0].getTime();
        const currentInnerExtentEnd = currentInnerExtent[1].getTime();
        const currentInnerDuration = currentInnerExtentEnd - currentInnerExtentStart;
        let newInnerExtentStart = currentInnerExtentStart;
        let newInnerExtentEnd = currentInnerExtentEnd;

        if (newInnerExtentStart < tracksExtent[0] || newInnerExtentStart > tracksExtent[1]) {
          newInnerExtentStart = tracksExtent[0];
          newInnerExtentEnd = newInnerExtentStart + currentInnerDuration;
        }

        if (newInnerExtentEnd > tracksExtent[1]) {
          newInnerExtentEnd = newInnerExtentStart + (tracksDuration * 0.1);
        }

        dispatch(setInnerTimelineDates([new Date(newInnerExtentStart), new Date(newInnerExtentEnd)]));
        dispatch(setOuterTimelineDates([new Date(tracksExtent[0]), new Date(tracksExtent[1])]));

        if (zoomToBounds) {
          // should this be computed server side ?
          // this is half implemented because it doesn't take into account filtering and time span
          const trackBounds = new google.maps.LatLngBounds();
          for (let i = 0, length = groupedData.latitude.length; i < length; i++) {
            trackBounds.extend(new google.maps.LatLng({ lat: groupedData.latitude[i], lng: groupedData.longitude[i] }));
          }

          dispatch({
            type: SET_TRACK_BOUNDS,
            trackBounds
          });
        }
      });
  };
}

export function addVessel(layerId, seriesgroup, series = null, zoomToBounds = false, fromSearch = false) {
  return (dispatch) => {
    dispatch({
      type: ADD_VESSEL
    });
    dispatch(setCurrentVessel(layerId, seriesgroup, fromSearch));
    dispatch(getVesselTrack(layerId, seriesgroup, series, zoomToBounds));
  };
}

export function clearVesselInfo() {
  return {
    type: CLEAR_VESSEL_INFO
  };
}

export function toggleActiveVesselPin() {
  return {
    type: TOGGLE_VESSEL_PIN,
    payload: {
      useCurrentlyVisibleVessel: true
    }
  };
}

export function toggleVesselPin(seriesgroup) {
  return {
    type: TOGGLE_VESSEL_PIN,
    payload: {
      seriesgroup
    }
  };
}

export function togglePinnedVesselEditMode(forceMode = null) {
  return {
    type: TOGGLE_PINNED_VESSEL_EDIT_MODE,
    payload: {
      forceMode
    }
  };
}

export function showPinnedVesselDetails(seriesgroup) {
  return (dispatch, getState) => {
    dispatch(clearVesselInfo());
    dispatch({
      type: SHOW_VESSEL_DETAILS,
      payload: {
        seriesgroup
      }
    });
    const currentVessel = getState().vesselInfo.details.find(vessel => vessel.seriesgroup === seriesgroup);
    dispatch(getVesselTrack(currentVessel.layerId, seriesgroup, null, true));
  };
}

export function setPinnedVesselHue(seriesgroup, hue) {
  return {
    type: SET_PINNED_VESSEL_HUE,
    payload: {
      seriesgroup,
      hue
    }
  };
}

export function setPinnedVesselTitle(seriesgroup, title) {
  return {
    type: SET_PINNED_VESSEL_TITLE,
    payload: {
      seriesgroup,
      title
    }
  };
}

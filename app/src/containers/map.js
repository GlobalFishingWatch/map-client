import { connect } from 'react-redux';
import Map from '../components/map';
import {
  getWorkspace,
  toggleLayerVisibility,
  getSeriesGroup,
  setZoom,
  setCenter
} from '../actions/map';
import { updateFilters } from '../actions/filters';

const mapStateToProps = (state) => ({
  map: state.map,
  filters: state.filters,
  loggedUser: state.user.loggedUser,
  token: state.user.token
});
const mapDispatchToProps = (dispatch, { location }) => {
  const queryParams = location.query;
  return {
    getWorkspace: () => {
      dispatch(getWorkspace(queryParams.workspace));
    },
    toggleLayerVisibility: (layer) => {
      dispatch(toggleLayerVisibility(layer));
    },
    updateFilters: (filters) => {
      dispatch(updateFilters(filters));
    },
    getSeriesGroup: (seriesgroup, series, filters) => {
      dispatch(getSeriesGroup(seriesgroup, series, filters));
    },
    setZoom: zoom => dispatch(setZoom(zoom)),
    setCenter: center => dispatch(setCenter(center))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);

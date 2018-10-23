import { connect } from 'react-redux';
import MapProxy from './MapProxy';
import { loadTrack, removeTracks } from './tracks/tracks.actions';

const mapStateToProps = (state, ownProps) => ({
  zoom: state.mapViewport.zoom,
  hello: state.map.test.hello
  // mapTracks: state.map.tracks
  // basemap: ownProps.workspace.basemap
});

const mapDispatchToProps = dispatch => ({
  // updateTracks: (tracks) => {
  //   dispatch(updateTracks(tracks));
  // }
  loadTrack: (track) => {
    dispatch(loadTrack(track));
  },
  removeTrack: (track) => {
    dispatch(removeTracks([track]));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapProxy);

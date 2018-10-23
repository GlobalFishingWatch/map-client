import React from 'react';
import PropTypes from 'prop-types';
import Map from './glmap/Map.container';

const containsTrack = (track, tracks) => tracks.find(prevTrack =>
  prevTrack.id === track.id &&
  prevTrack.segmentId === track.segmentId
) !== undefined;

class MapProxy extends React.Component {
  componentDidUpdate(prevProps) {
    console.log(this.props.tracks)

    if (this.props.tracks !== prevProps.tracks) {
      // this.props.updateTracks(this.props.tracks);
      if (this.props.tracks.length !== prevProps.tracks.length) {
        console.log(this.props.tracks.length, prevProps.tracks.length)
        const newTracks = this.props.tracks;
        const prevTracks = prevProps.tracks;
        newTracks.forEach((newTrack) => {
          if (!containsTrack(newTrack, prevTracks)) {
            this.props.loadTrack({
              token: this.props.token,
              ...newTrack
            });
          }
        });
        prevTracks.forEach((prevTrack) => {
          if (!containsTrack(prevTrack, newTracks)) {
            this.props.removeTrack({ ...prevTrack });
          }
        });
      }
    }

    // console.log(prevProps.basemap, this.props.basemap);
    // call action ? Or send whole workspace to a reducer and dispatch from there

    // what does updateBasemap actually? IE how is map style updated?
    // Refacto Map Style Actions to use declarative actions, ie
    // - basemap changed -> updateBasemap collects existing GL basemap related layers (base and options), toggle their visibility
    // - layer color changed -> updateLayerColor collects GL layer, changes color
    // - layer's _added set to false -> toggle GL layer visibility (side effect: check CARTO layer status and instantiate if needed)
    // - layer length changed -> custom layer added or removed
    // this.props.updateBasemap(this.props.basemap);

    // other option is to just send back updated worspace (ugh)
    // then, diffing is made in an action
    // and ie mapStyle actions directly consume workspace copy
  }

  render() {
    // console.log(this.props);
    // console.log(this.props.workspace, this.props.basemap)
    // const { hello } = this.props;
    return (
      <Map {...this.props} />
    );
  }
}

MapProxy.propTypes = {
  token: PropTypes.string.isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    segmentId: PropTypes.string,
    layerUrl: PropTypes.string,
    layerTemporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  }))
};

export default MapProxy;

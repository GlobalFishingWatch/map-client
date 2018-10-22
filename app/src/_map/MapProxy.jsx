import React from 'react';
import PropTypes from 'prop-types';
// import Map from './map/containers/Map';

// Probaby this should just be a wrapper
class MapProxy extends React.Component {
  componentDidUpdate(prevProps) {
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
    console.log(this.props)
    // console.log(this.props.workspace, this.props.basemap)
    // const { hello } = this.props;
    return (
      <span>lala</span>
      // <div>Im a map module{hello}</div>
      // <Map {...this.props} />
    );
  }
}

MapProxy.propTypes = {};

export default MapProxy;

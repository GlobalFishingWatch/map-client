import React from 'react';
import PropTypes from 'prop-types';
import MapGL, { Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ActivityLayers from '../activity/ActivityLayers.container.js';
import styles from './map.css';

const PopupWrapper = (props) => {
  const { latitude, longitude, children, closeButton, onClose } = props;
  return (<Popup
    latitude={latitude}
    longitude={longitude}
    closeButton={closeButton}
    onClose={onClose}
    anchor="bottom"
    offsetTop={-10}
    tipSize={4}
  >
    {children}
  </Popup>);
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseOver: true
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();

    // useful with FOUC
    window.setTimeout(() => this._resize(), 1);

    // there is a problem with the container width computation (only with "fat scrollbar" browser/os configs),
    // seems like the panels with scrollbars are taken into account or smth
    window.setTimeout(() => this._resize(), 10000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    if (this._mapContainerRef === undefined) {
      console.warn('Cant set viewport on a map that hasnt finished intanciating yet');
      return;
    }
    const mapContainerStyle = window.getComputedStyle(this._mapContainerRef);
    const width = parseInt(mapContainerStyle.width, 10);
    const height = parseInt(mapContainerStyle.height, 10) + 1;

    if (width !== this.props.viewport.width || height !== this.props.viewport.height) {
      this.props.setViewport({
        ...this.props.viewport,
        width,
        height
      });
    }
  }

  onViewportChange = (viewport) => {
    this.props.setViewport(viewport);
  }

  onHover = (event) => {
    this.props.mapHover(event.lngLat[1], event.lngLat[0], event.features);
  }

  onClick = (event) => {
    this.props.mapClick(event.lngLat[1], event.lngLat[0], event.features);
  }

  render() {
    const { viewport, maxZoom, minZoom, transitionEnd, mapStyle, onClosePopup, clickPopup, hoverPopup, cursor } = this.props;
    return (
      <div
        id="map"
        className={styles.map}
        ref={(ref) => { this._mapContainerRef = ref; }}
        onMouseLeave={() => { this.setState({ mouseOver: false }); }}
        onMouseEnter={() => { this.setState({ mouseOver: true }); }}
      >
        <MapGL
          onTransitionEnd={transitionEnd}
          onHover={this.onHover}
          onClick={this.onClick}
          getCursor={({ isDragging }) => {
            if (cursor === null) {
              return (isDragging) ? 'grabbing' : 'grab';
            }
            return cursor;
          }}
          mapStyle={mapStyle}
          {...viewport}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onViewportChange={this.onViewportChange}
        >
          <ActivityLayers
            temporalExtentIndexes={this.props.temporalExtentIndexes}
            highlightTemporalExtentIndexes={this.props.highlightTemporalExtentIndexes}
            loadTemporalExtent={this.props.loadTemporalExtent}
          />
          {clickPopup !== undefined && clickPopup !== null &&
            <PopupWrapper
              latitude={clickPopup.latitude}
              longitude={clickPopup.longitude}
              closeButton
              onClose={onClosePopup}
            >
              {clickPopup.content}
            </PopupWrapper>
          }
          {this.state.mouseOver === true && hoverPopup !== undefined && hoverPopup !== null &&
            <PopupWrapper
              latitude={hoverPopup.latitude}
              longitude={hoverPopup.longitude}
              closeButton={false}
            >
              {hoverPopup.content}
            </PopupWrapper>
          }
        </MapGL>
        <div className={styles.googleLogo} />
      </div>
    );
  }
}

Map.propTypes = {
  viewport: PropTypes.object,
  mapStyle: PropTypes.object,
  clickPopup: PropTypes.object,
  hoverPopup: PropTypes.object,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  setViewport: PropTypes.func,
  mapHover: PropTypes.func,
  mapClick: PropTypes.func,
  clearPopup: PropTypes.func,
  onClosePopup: PropTypes.func,
  transitionEnd: PropTypes.func,
  cursor: PropTypes.string
};

export default Map;

/* eslint-disable react/sort-comp  */
import React, { Component } from 'react';
import extentChanged from 'util/extentChanged';
import VesselsLayer from 'components/Layers/VesselsLayer';
import TrackLayer from 'components/Layers/TrackLayer';
import TiledLayer from 'components/Layers/TiledLayer';
import PolygonReport from 'containers/Map/PolygonReport';
import { LAYER_TYPES } from 'constants';

class MapLayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedLayers: {}
    };
    this.onMapIdleBound = this.onMapIdle.bind(this);
    this.onMapClickBound = this.onMapClick.bind(this);
    this.onMapCenterChangedBound = this.onMapCenterChanged.bind(this);
    this.onCartoLayerFeatureClickBound = this.onCartoLayerFeatureClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.map = nextProps.map;
      this.build();
    } else {
      if (nextProps.viewportWidth !== this.props.viewportWidth || nextProps.viewportHeight !== this.props.viewportHeight) {
        this.vesselsLayer.updateViewportSize(nextProps.viewportWidth, nextProps.viewportHeight);
        // TODO update tracks layer viewport as well
      }
    }
    if (nextProps.layers.length) {
      if (!this.props.layers.length) {
        this.initHeatmap();
      }
      this.updateLayers(nextProps);
    }
    this.updateFlag(nextProps);

    if (this.props.zoom !== nextProps.zoom && this.vesselsLayer) {
      this.vesselsLayer.setZoom(nextProps.zoom);
    }

    if (!nextProps.timelineOuterExtent || !nextProps.timelineInnerExtent) {
      return;
    }

    const innerExtentChanged = extentChanged(this.props.timelineInnerExtent, nextProps.timelineInnerExtent);
    const startTimestamp = nextProps.timelineInnerExtent[0].getTime();
    const endTimestamp = nextProps.timelineInnerExtent[1].getTime();

    if (this.trackLayer && !nextProps.vesselTrack) {
      this.trackLayer.clear();
    } else if (this.shouldUpdateTrackLayer(nextProps, innerExtentChanged)) {
      this.updateTrackLayer({
        data: nextProps.vesselTrack.seriesGroupData,
        selectedSeries: nextProps.vesselTrack.selectedSeries,
        startTimestamp,
        endTimestamp,
        timelinePaused: nextProps.timelinePaused,
        timelineOverExtent: nextProps.timelineOverExtent
      });
    }

    if (this.vesselsLayer) {
      // update vessels layer when:
      // - user selected a new flag
      // - selected inner extent changed
      // Vessels layer will update automatically on zoom and center changes, as the overlay will fetch tiles,
      //      then rendered by the vessel layer
      if (this.props.flag !== nextProps.flag ||
        innerExtentChanged) {
        this.vesselsLayer.renderTimeRange(startTimestamp, endTimestamp);
      }
    }

    if (nextProps.reportLayerId !== this.props.reportLayerId) {
      this.setLayersInteraction(nextProps.reportLayerId);
    }
  }

  /**
   * update tracks layer when:
   * - user selected a new vessel (seriesgroup or selectedSeries changed)
   * - zoom level changed (needs fetching of a new tileset)
   * - playing state changed
   * - user hovers on timeline to highlight a portion of the track, only if selectedSeries is set (redrawing is too
   * slow when all series are shown)
   * - selected inner extent changed
   *
   * @param nextProps
   * @param innerExtentChanged
   * @returns {boolean}
   */
  shouldUpdateTrackLayer(nextProps, innerExtentChanged) {
    if (!this.props.vesselTrack) {
      return true;
    }
    if (this.props.vesselTrack.seriesgroup !== nextProps.vesselTrack.seriesgroup) {
      return true;
    }
    if (this.props.vesselTrack.selectedSeries !== nextProps.vesselTrack.selectedSeries) {
      return true;
    }
    if (this.props.zoom !== nextProps.zoom) {
      return true;
    }
    if (this.props.timelinePaused !== nextProps.timelinePaused) {
      return true;
    }
    if (nextProps.vesselTrack.selectedSeries && extentChanged(this.props.timelineOverExtent, nextProps.timelineOverExtent)) {
      return true;
    }
    if (innerExtentChanged) {
      return true;
    }
    return false;
  }

  build() {
    this.map.addListener('idle', this.onMapIdleBound);
    this.map.addListener('click', this.onMapClickBound);
    this.map.addListener('center_changed', this.onMapCenterChangedBound);

    this.setState({ map: this.map });
  }

  componentWillUnmount() {
    this.map.removeListener('idle', this.onMapIdleBound);
    this.map.removeListener('click', this.onMapClickBound);
    this.map.removeListener('center_changed', this.onMapCenterChangedBound);
  }

  initHeatmap() {
    this.tiledLayer = new TiledLayer(this.props.createTile, this.props.releaseTile);
    this.map.overlayMapTypes.insertAt(0, this.tiledLayer);
  }


  /**
   * Handles and propagates layers changes
   * @param nextProps
   */
  updateLayers(nextProps) {
    console.log('update layers!')
    const currentLayers = this.props.layers;
    const newLayers = nextProps.layers;
    const addedLayers = this.state.addedLayers;

    const updatedLayers = newLayers.map(
      (layer, index) => {
        if (currentLayers[index] === undefined) return layer;
        if (layer.title !== currentLayers[index].title) return layer;
        if (layer.visible !== currentLayers[index].visible) return layer;
        if (layer.opacity !== currentLayers[index].opacity) return layer;
        if (layer.hue !== currentLayers[index].hue) return layer;
        return false;
      }
    );

    const promises = [];
    let callAddVesselLayer = null;

    for (let i = 0, j = updatedLayers.length; i < j; i++) {
      if (!updatedLayers[i]) continue;

      const newLayer = updatedLayers[i];
      const oldLayer = currentLayers[i];

      // If the layer is already on the map and its visibility changed, we update it
      if (addedLayers[newLayer.id] && oldLayer.visible !== newLayer.visible) {
        this.toggleLayerVisibility(newLayer);
        continue;
      }

      if (addedLayers[newLayer.id] && newLayer.visible && oldLayer.opacity !== newLayer.opacity) {
        this.setLayerOpacity(newLayer);
        continue;
      }

      if (addedLayers[newLayer.id] && newLayer.visible && oldLayer.hue !== newLayer.hue) {
        this.setLayerHue(newLayer);
        continue;
      }


      // If the layer is not yet on the map and is invisible, we skip it
      if (!newLayer.visible) continue;

      if (addedLayers[newLayer.id] !== undefined) return;

      switch (newLayer.type) {
        case LAYER_TYPES.ClusterAnimation:
          callAddVesselLayer = this.addVesselLayer.bind(this, newLayer);
          break;
        default:
          promises.push(this.addCartoLayer(newLayer, i + 2, nextProps.reportLayerId));
      }
    }

    Promise.all(promises).then((() => {
      if (callAddVesselLayer) callAddVesselLayer();
      this.setState({ addedLayers });
    }));
  }

  /**
   * Creates vessel track layer
   * @param layerSettings
   */
  addVesselLayer(layerSettings) {
    if (!this.vesselsLayer) {
      this.vesselsLayer = new VesselsLayer(
        this.map,
        this.props.tilesetUrl,
        this.props.token,
        this.props.timelineInnerExtent,
        this.props.timelineOverallExtent,
        this.props.flag,
        this.props.viewportWidth,
        this.props.viewportHeight
      );
      this.vesselsLayer.setOpacity(layerSettings.opacity);
      this.vesselsLayer.setHue(layerSettings.hue);
      this.vesselsLayer.setInteraction(true);
    }

    // Create track layer
    this.trackLayer = new TrackLayer(
      this.props.viewportWidth,
      this.props.viewportHeight
    );
    this.trackLayer.setMap(this.map);

    this.state.addedLayers[layerSettings.id] = this.vesselsLayer;
  }

  /**
   * Creates a Carto-based layer
   *
   * @returns {Promise}
   * @param layerSettings
   * @param index
   * @param reportLayerId used to toggle interactivity on or off
   */
  addCartoLayer(layerSettings, index, reportLayerId) {
    const addedLayers = this.state.addedLayers;
    const promise = new Promise(((resolve) => {
      cartodb.createLayer(this.map, layerSettings.source.args.url)
        .addTo(this.map, index)
        .done(((layer, cartoLayer) => {
          cartoLayer.setInteraction(reportLayerId === layerSettings.id);
          cartoLayer.on('featureClick', (event, latLng, pos, data) => {
            this.onCartoLayerFeatureClickBound(data.cartodb_id, latLng, layer.id);
          });
          addedLayers[layer.id] = cartoLayer;
          resolve();
        }).bind(this, layerSettings));
    }));

    return promise;
  }

  onCartoLayerFeatureClick(id, latLng, layerId) {
    // this check should not be necessary but setInteraction(false) or interactive = false
    // on Carto layers don't seem to be reliable -_-
    if (layerId === this.props.reportLayerId) {
      this.props.showPolygon(id, '', latLng);
    }
  }

  setLayersInteraction(reportLayerId) {
    this.props.layers.forEach(layerSettings => {
      const layer = this.state.addedLayers[layerSettings.id];
      if (layer) {
        // no report enabled: enable interaction in all but vessel layer
        if (reportLayerId === null) {
          if (layerSettings.type === 'ClusterAnimation') {
            layer.setInteraction(true);
          } else {
            // apparently both are needed -_-
            layer.setInteraction(false);
            layer.interactive = false;
          }
        } else if (reportLayerId === layerSettings.id) {
          layer.setInteraction(true);
          layer.interactive = true;
        } else {
          layer.setInteraction(false);
          layer.interactive = false;
        }
      }
    });
  }

  /**
   * Toggles a layer's visibility
   *
   * @param layerSettings
   */
  toggleLayerVisibility(layerSettings) {
    const layers = this.state.addedLayers;

    if (layerSettings.visible) {
      layers[layerSettings.id].show();
    } else {
      layers[layerSettings.id].hide();
    }
  }

  /**
   * Updates a layer's opacity
   * @param layerSettings
   */
  setLayerOpacity(layerSettings) {
    const layers = this.state.addedLayers;

    if (!Object.keys(layers).length) return;

    layers[layerSettings.id].setOpacity(layerSettings.opacity);
  }

  /**
   * Updates a layer's hue
   * @param layerSettings
   */
  setLayerHue(layerSettings) {
    const layers = this.state.addedLayers;

    if (!Object.keys(layers).length) return;
    layers[layerSettings.id].setHue(layerSettings.hue);
  }

  /**
   * Handles flag change
   * @param nextProps
   */
  updateFlag(nextProps) {
    if (!this.vesselsLayer) {
      return;
    }
    if (
      this.props.flag !== nextProps.flag
    ) {
      this.vesselsLayer.updateFlag(nextProps.flag);
    }
  }

  updateTrackLayer({ data, selectedSeries, startTimestamp, endTimestamp, timelinePaused, timelineOverExtent }) {
    if (!this.trackLayer || !data) {
      return;
    }
    this.trackLayer.reposition();

    let overStartTimestamp;
    let overEndTimestamp;
    if (timelineOverExtent) {
      overStartTimestamp = timelineOverExtent[0].getTime();
      overEndTimestamp = timelineOverExtent[1].getTime();
    }

    this.trackLayer.drawTile(
      data,
      selectedSeries,
      {
        startTimestamp,
        endTimestamp,
        timelinePaused,
        overStartTimestamp,
        overEndTimestamp
      }
    );
  }

  rerenderTrackLayer() {
    if (!this.props.vesselTrack) {
      return;
    }
    this.updateTrackLayer({
      data: this.props.vesselTrack.seriesGroupData,
      selectedSeries: this.props.vesselTrack.selectedSeries,
      startTimestamp: this.props.timelineInnerExtent[0].getTime(),
      endTimestamp: this.props.timelineInnerExtent[1].getTime(),
      timelinePaused: this.props.timelinePaused,
      timelineOverExtent: this.props.timelineOverExtent
    });
  }


  /**
   * Handles map idle event (once loading is done)
   */
  onMapIdle() {
    if (this.vesselsLayer) {
      this.vesselsLayer.reposition();
      this.vesselsLayer.render();
    }
    if (this.trackLayer) {
      this.rerenderTrackLayer();
    }
  }

  onMapCenterChanged() {
    if (this.vesselsLayer) {
      this.vesselsLayer.reposition();
      this.vesselsLayer.render();
    }
  }

  /**
   * Detects and handles map clicks
   * Detects collisions with current vessel data
   * Draws tracks and loads vessel details
   *
   * @param event
   */
  onMapClick(event) {
    if (!this.vesselsLayer || !event || this.vesselsLayer.interactive === false) {
      return;
    }

    const vessels = this.vesselsLayer.selectVesselsAt(event.pixel.x, event.pixel.y);

    // use the following to debug values coming from the server tiles or computed in VesselsTileData
    // this.vesselsLayer.getHistogram('opacity');

    this.props.setCurrentVessel(vessels, event.latLng);
  }

  render() {
    return (<div>
      <PolygonReport
        map={this.state.map}
      />
    </div>);
  }
}


MapLayers.propTypes = {
  map: React.PropTypes.object,
  token: React.PropTypes.string,
  tilesetUrl: React.PropTypes.string,
  layers: React.PropTypes.array,
  zoom: React.PropTypes.number,
  flag: React.PropTypes.string,
  timelineOverallExtent: React.PropTypes.array,
  timelineInnerExtent: React.PropTypes.array,
  timelineOuterExtent: React.PropTypes.array,
  timelineOverExtent: React.PropTypes.array,
  timelinePaused: React.PropTypes.bool,
  vesselTrack: React.PropTypes.object,
  viewportWidth: React.PropTypes.number,
  viewportHeight: React.PropTypes.number,
  reportLayerId: React.PropTypes.number,
  setCurrentVessel: React.PropTypes.func,
  showPolygon: React.PropTypes.func,
  createTile: React.PropTypes.func,
  releaseTile: React.PropTypes.func
};


export default MapLayers;

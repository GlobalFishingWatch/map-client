/* eslint-disable react/sort-comp  */
import React, { Component } from 'react';
import extentChanged from 'util/extentChanged';
import TrackLayer from 'components/Layers/TrackLayer';
import TiledLayer from 'components/Layers/TiledLayer';
import HeatmapContainer from 'components/Layers/HeatmapContainer';
import CustomLayerWrapper from 'components/Layers/CustomLayerWrapper';
import PolygonReport from 'containers/Map/PolygonReport';
import { LAYER_TYPES } from 'constants';

class MapLayers extends Component {
  constructor(props) {
    super(props);
    this.addedLayers = {};
    this.onMapIdleBound = this.onMapIdle.bind(this);
    this.onMapClickBound = this.onMapClick.bind(this);
    this.onMapCenterChangedBound = this.onMapCenterChanged.bind(this);
    this.onCartoLayerFeatureClickBound = this.onCartoLayerFeatureClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.map = nextProps.map;
      this.build();
    } else if (nextProps.viewportWidth !== this.props.viewportWidth || nextProps.viewportHeight !== this.props.viewportHeight) {
      this.heatmapContainer.updateViewportSize(nextProps.viewportWidth, nextProps.viewportHeight);
        // TODO update tracks layer viewport as well
    }
    if (nextProps.layers.length) {
      if (!this.heatmapContainer) {
        this.initHeatmap();
      }
      this.updateLayers(nextProps);
    }

    if (this.props.zoom !== nextProps.zoom && this.heatmapContainer) {
      this.heatmapContainer.setZoom(nextProps.zoom);
    }

    if (!nextProps.timelineOuterExtent || !nextProps.timelineInnerExtent) {
      return;
    }

    const innerExtentChanged = extentChanged(this.props.timelineInnerExtent, nextProps.timelineInnerExtent);
    const startTimestamp = nextProps.timelineInnerExtent[0].getTime();
    const endTimestamp = nextProps.timelineInnerExtent[1].getTime();

    if (this.trackLayer && (!nextProps.vesselTracks || nextProps.vesselTracks.length === 0)) {
      this.trackLayer.clear();
    } else if (this.shouldUpdateTrackLayer(nextProps, innerExtentChanged)) {
      this.updateTrackLayer({
        data: nextProps.vesselTracks,
        // TODO directly use timelineInnerExtentIndexes
        startTimestamp,
        endTimestamp,
        timelinePaused: nextProps.timelinePaused,
        timelineOverExtent: nextProps.timelineOverExtent
      });
    }

    if (this.heatmapContainer) {
      // update vessels layer when:
      // - tiled data changed
      // - selected inner extent changed
      if (this.props.heatmap !== nextProps.heatmap ||
        innerExtentChanged) {
        this.renderHeatmap(nextProps);
      }
      if (nextProps.flagsLayers !== this.props.flagsLayers) {
        this.setHeatmapFlags(nextProps);
        this.renderHeatmap(nextProps);
      }
    }

    if (nextProps.reportLayerId !== this.props.reportLayerId) {
      this.setLayersInteraction(nextProps.reportLayerId);
    }
  }

  /**
   * TODO remove this monster. This will be possible with an isolated container only interested
   *    in relevant props.
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
    if (!this.props.vesselTracks) {
      return true;
    }
    if (this.props.vesselTracks.length !== nextProps.vesselTracks.length) {
      return true;
    }
    if (nextProps.vesselTracks.some((vesselTrack, index) =>
      vesselTrack.hue !== this.props.vesselTracks[index].hue
    ) === true) {
      return true;
    }
    if (this.props.zoom !== nextProps.zoom) {
      return true;
    }
    if (this.props.timelinePaused !== nextProps.timelinePaused) {
      return true;
    }
    if (extentChanged(this.props.timelineOverExtent, nextProps.timelineOverExtent)) {
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
  }

  componentWillUnmount() {
    google.maps.event.clearInstanceListeners(this.map);
    this.map.overlayMapTypes.removeAt(0);
  }

  initHeatmap() {
    this.tiledLayer = new TiledLayer(this.props.createTile, this.props.releaseTile, this.map);
    this.map.overlayMapTypes.insertAt(0, this.tiledLayer);
    this.heatmapContainer = new HeatmapContainer(this.props.viewportWidth, this.props.viewportHeight);
    this.heatmapContainer.setMap(this.map);
    // Create track layer
    this.trackLayer = new TrackLayer(
      this.props.viewportWidth,
      this.props.viewportHeight
    );
    this.trackLayer.setMap(this.map);
  }


  /**
   * Handles and propagates layers changes
   * @param nextProps
   */
  updateLayers(nextProps) {
    const currentLayers = this.props.layers;
    const newLayers = nextProps.layers;
    const initialLoad = Object.keys(this.addedLayers).length === 0;

    const updatedLayers = newLayers.map(
      (layer, index) => {
        if (initialLoad) return layer;
        if (currentLayers[index] === undefined) return layer;
        if (layer.title !== currentLayers[index].title) return layer;
        if (layer.visible !== currentLayers[index].visible) return layer;
        if (layer.opacity !== currentLayers[index].opacity) return layer;
        return false;
      }
    );

    const promises = [];

    for (let i = 0, j = updatedLayers.length; i < j; i++) {
      if (!updatedLayers[i]) continue;

      const newLayer = updatedLayers[i];
      const oldLayer = currentLayers[i];

      // If the layer is already on the map and its visibility changed, we update it
      if (this.addedLayers[newLayer.id] && oldLayer.visible !== newLayer.visible) {
        this.toggleLayerVisibility(newLayer);
        continue;
      }

      if (this.addedLayers[newLayer.id] && newLayer.visible && oldLayer.opacity !== newLayer.opacity) {
        this.setLayerOpacity(newLayer);
        continue;
      }

      // If the layer is not yet on the map and is invisible, we skip it
      if (!newLayer.visible) continue;

      if (this.addedLayers[newLayer.id] !== undefined) return;

      if (newLayer.type === LAYER_TYPES.ClusterAnimation) {
        this.addHeatmapLayer(newLayer);
      } else if (newLayer.type === LAYER_TYPES.Custom) {
        this.addCustomLayer(newLayer);
      } else {
        promises.push(this.addCartoLayer(newLayer, i + 2, nextProps.reportLayerId));
      }
    }

    Promise.all(promises);
  }

  addHeatmapLayer(newLayer) {
    this.addedLayers[newLayer.id] = this.heatmapContainer.addLayer(newLayer);
    this.setHeatmapFlags(this.props);
    this.renderHeatmap(this.props);
  }

  setHeatmapFlags(props) {
    this.heatmapContainer.setFlags(props.flagsLayers);
  }

  renderHeatmap(props) {
    this.heatmapContainer.render(props.heatmap, props.timelineInnerExtentIndexes);
  }

  addCustomLayer(layer) {
    this.addedLayers[layer.id] = new CustomLayerWrapper(this.map, layer.url);
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
    const promise = new Promise(((resolve) => {
      cartodb.createLayer(this.map, layerSettings.url)
        .addTo(this.map, index)
        .done(((layer, cartoLayer) => {
          cartoLayer.setInteraction(reportLayerId === layerSettings.id);
          cartoLayer.on('featureClick', (event, latLng, pos, data) => {
            this.onCartoLayerFeatureClickBound(data.cartodb_id, latLng, layer.id);
          });
          this.addedLayers[layer.id] = cartoLayer;
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
    this.heatmapLayer.interactive = (reportLayerId === null);
    this.props.layers.filter(layerSettings => layerSettings.type !== 'ClusterAnimation').forEach((layerSettings) => {
      const layer = this.addedLayers[layerSettings.id];
      if (layer) {
        if (reportLayerId === layerSettings.id) {
          layer.setInteraction(true);
        } else {
          layer.setInteraction(false);
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
    if (layerSettings.visible) {
      this.addedLayers[layerSettings.id].show();
    } else {
      this.addedLayers[layerSettings.id].hide();
    }

    if (layerSettings.type === LAYER_TYPES.ClusterAnimation) {
      this.renderHeatmap(this.props);
    }
  }

  /**
   * Updates a layer's opacity
   * @param layerSettings
   */
  setLayerOpacity(layerSettings) {
    if (!Object.keys(this.addedLayers).length) return;

    this.addedLayers[layerSettings.id].setOpacity(layerSettings.opacity);

    if (layerSettings.type === LAYER_TYPES.ClusterAnimation) {
      this.renderHeatmap(this.props);
    }
  }

  updateTrackLayer({ data, startTimestamp, endTimestamp, timelinePaused, timelineOverExtent }) {
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

    this.trackLayer.drawTracks(
      data,
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
    if (!this.props.vesselTracks) {
      return;
    }
    this.updateTrackLayer({
      data: this.props.vesselTracks,
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
    if (this.heatmapContainer) {
      this.heatmapContainer.reposition();
      this.renderHeatmap(this.props);
    }
    if (this.trackLayer) {
      this.rerenderTrackLayer();
    }
  }

  onMapCenterChanged() {
    if (this.heatmapContainer) {
      this.heatmapContainer.reposition();
      this.renderHeatmap(this.props);
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
    if (!event || !this.heatmapContainer || this.heatmapContainer.interactive === false) {
      return;
    }

    const tileQuery = this.tiledLayer.getTileQueryAt(event.pixel.x, event.pixel.y);

    this.props.queryHeatmap(tileQuery, event.latLng);
  }

  render() {
    return (<div>
      <PolygonReport
        map={this.map}
      />
    </div>);
  }
}


MapLayers.propTypes = {
  map: React.PropTypes.object,
  token: React.PropTypes.string,
  tilesetUrl: React.PropTypes.string,
  layers: React.PropTypes.array,
  flagsLayers: React.PropTypes.object,
  heatmap: React.PropTypes.object,
  zoom: React.PropTypes.number,
  timelineOverallExtent: React.PropTypes.array,
  timelineInnerExtent: React.PropTypes.array,
  timelineInnerExtentIndexes: React.PropTypes.array,
  timelineOuterExtent: React.PropTypes.array,
  timelineOverExtent: React.PropTypes.array,
  timelinePaused: React.PropTypes.bool,
  vesselTracks: React.PropTypes.array,
  viewportWidth: React.PropTypes.number,
  viewportHeight: React.PropTypes.number,
  reportLayerId: React.PropTypes.number,
  queryHeatmap: React.PropTypes.func,
  showPolygon: React.PropTypes.func,
  createTile: React.PropTypes.func,
  releaseTile: React.PropTypes.func
};


export default MapLayers;

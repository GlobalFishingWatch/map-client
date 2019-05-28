import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import StaticLayerPopup from 'app/map/components/StaticLayerPopup'
import HoverPopup from 'app/map/components/HoverPopup'
import Loader from 'app/mapPanels/leftControlPanel/components/Loader'

const MapModule = React.lazy(() => import('@globalfishingwatch/map-components/components/map'))

class MapWrapper extends Component {
  state = {
    hoverPopupData: null,
    clickPopupData: null,
  }

  renderClickPopup = () => {
    const { clickPopupData } = this.state
    if (clickPopupData === null) {
      return null
    }

    const { report, layerTitles, toggleCurrentReportPolygon } = this.props
    const layerTitle = layerTitles[clickPopupData.feature.layer.id]
    return (
      <StaticLayerPopup
        event={clickPopupData}
        report={report}
        layerTitle={layerTitle}
        toggleCurrentReportPolygon={toggleCurrentReportPolygon}
      />
    )
  }

  onClick = (event) => {
    this.props.onMapClick(event)

    const clickPopupData =
      event.count === 1 && event.feature.layer.group === 'static' ? event : null

    this.setState({
      clickPopupData,
      hoverPopupData: clickPopupData !== null ? null : this.state.hoverPopupData,
    })
  }

  renderHoverPopup = () => {
    const { hoverPopupData } = this.state
    if (hoverPopupData === null) {
      return null
    }
    const { layerTitles } = this.props
    return <HoverPopup event={hoverPopupData} layerTitles={layerTitles} />
  }

  onHover = (event) => {
    const hoverPopupData = event.count !== 0 ? event : null
    this.props.onMapHover(event)
    this.setState({
      hoverPopupData,
    })
  }

  onClosePopup = () => {
    this.setState({
      clickPopupData: null,
    })
  }

  render() {
    const {
      onViewportChange,
      onLoadStart,
      onLoadComplete,
      onAttributionsChange,
      token,
      viewport,
      tracks,
      heatmapLayers,
      staticLayers,
      basemapLayers,
      temporalExtent,
      loadTemporalExtent,
      highlightTemporalExtent,
      isCluster,
    } = this.props

    const { hoverPopupData, clickPopupData } = this.state

    

    const hoverPopup =
      hoverPopupData === null ? null : { ...hoverPopupData, content: this.renderHoverPopup() }
    const clickPopup =
      clickPopupData === null ? null : { ...clickPopupData, content: this.renderClickPopup() }
    
      // console.log(hoverPopup)
      return (
      <Suspense fallback={<Loader visible absolute />}>
        <MapModule
          onHover={this.onHover}
          onClick={this.onClick}
          isCluster={isCluster}
          onViewportChange={onViewportChange}
          onLoadStart={onLoadStart}
          onLoadComplete={onLoadComplete}
          onAttributionsChange={onAttributionsChange}
          onClosePopup={this.onClosePopup}
          hoverPopup={hoverPopup}
          clickPopup={clickPopup}
          token={token}
          // TODO REMOVE
          glyphsPath={`${process.env.PUBLIC_URL}/gl-fonts/{fontstack}/{range}.pbf`}
          viewport={viewport}
          tracks={tracks}
          heatmapLayers={heatmapLayers}
          staticLayers={staticLayers}
          basemapLayers={basemapLayers}
          temporalExtent={temporalExtent}
          loadTemporalExtent={loadTemporalExtent}
          highlightTemporalExtent={highlightTemporalExtent}
        />
      </Suspense>
    )
  }
}

/* eslint-disable react/require-default-props  */
MapWrapper.propTypes = {
  // sent to MapModule
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onAttributionsChange: PropTypes.func,
  token: PropTypes.string,
  viewport: PropTypes.object,
  tracks: PropTypes.array,
  heatmapLayers: PropTypes.array,
  staticLayers: PropTypes.array,
  basemapLayers: PropTypes.array,
  temporalExtent: PropTypes.array,
  loadTemporalExtent: PropTypes.array,
  highlightTemporalExtent: PropTypes.array,
  // internal
  onMapHover: PropTypes.func,
  onMapClick: PropTypes.func,
  isCluster: PropTypes.func,
  report: PropTypes.object,
  layerTitles: PropTypes.object,
  toggleCurrentReportPolygon: PropTypes.func,
}

export default MapWrapper

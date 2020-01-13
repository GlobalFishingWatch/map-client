import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import StaticLayerPopup from 'app/map/components/StaticLayerPopup'
import HoverPopup from 'app/map/components/HoverPopup'
import Loader from 'app/mapPanels/leftControlPanel/components/Loader'
import PopupStyles from 'styles/components/map/popup.module.scss'

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
    const { rulersEditing } = this.props
    this.props.onMapClick(event, rulersEditing)

    if (rulersEditing === true) {
      return
    }

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
    const { rulersEditing } = this.props
    if (rulersEditing === true) {
      return (
        <div className={classnames(PopupStyles.popup, PopupStyles._compact)}>
          Click to add a ruler
        </div>
      )
    }
    const { layerTitles } = this.props
    return <HoverPopup event={hoverPopupData} layerTitles={layerTitles} />
  }

  onHover = (event) => {
    this.props.onMapHover(event)
    // const hoverPopupData = event.count !== 0 ? event : null
    this.setState({
      hoverPopupData: event,
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
      rulersEditing,
      cursor,
    } = this.props

    const { hoverPopupData, clickPopupData } = this.state

    const hoverPopup =
      hoverPopupData === null || (hoverPopupData.count === 0 && rulersEditing === false)
        ? null
        : { ...hoverPopupData, content: this.renderHoverPopup() }

    const clickPopup =
      clickPopupData === null ? null : { ...clickPopupData, content: this.renderClickPopup() }

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
          cursor={cursor}
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
  rulersEditing: PropTypes.bool,
  cursor: PropTypes.string,
}

export default MapWrapper

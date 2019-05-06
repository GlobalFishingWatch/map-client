import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { updateWorkspace, updateMouseLatLon } from 'app/workspace/workspaceActions'
import { startLoading, completeLoading } from 'app/app/appActions'
import { clearVesselInfo, addVessel } from 'app/vesselInfo/vesselInfoActions'
import { setEncountersInfo, clearEncountersInfo } from 'app/encounters/encountersActions'
import { trackMapClicked } from 'app/analytics/analyticsActions'
import { toggleCurrentReportPolygon, setCurrentSelectedPolygon } from 'app/report/reportActions'
import { LAYER_TYPES, LAYER_TYPES_MAPBOX_GL } from 'app/constants'
import MapWrapper from 'app/map/components/MapWrapper'

const getVessels = (state) => state.vesselInfo.vessels
const getHighlightedTrack = (state) => state.vesselInfo.highlightedTrack
const getEncounter = (state) => state.encounters.encountersInfo
const getLayers = (state) => state.layers.workspaceLayers
const getLayerFilters = (state) => state.filterGroups.layerFilters
const getBasemap = (state) => state.basemap
const getWorkspaceZoom = (state) => state.workspace.viewport.zoom
const getWorkspaceCenter = (state) => state.workspace.viewport.center
const getReport = (state) => state.report

const getViewport = createSelector(
  [getWorkspaceZoom, getWorkspaceCenter],
  (zoom, center) => {
    if (zoom !== undefined && center !== undefined) {
      return { zoom, center }
    }
    return undefined
  }
)

const getTrackFromLayers = (layers, tilesetId) => {
  const trackLayer = layers.find((layer) => layer.tilesetId === tilesetId)

  const header = trackLayer.header

  return {
    layerTemporalExtents: header.temporalExtents,
    url: header.endpoints.tracks,
  }
}

const getAllVesselsForTracks = createSelector(
  [getVessels, getEncounter, getLayers, getHighlightedTrack],
  (vessels, encounter, layers, highlightedTrack) => {
    let tracks = []

    vessels.forEach((vessel) => {
      if (vessel.visible === true || vessel.shownInInfoPanel === true) {
        const seriesgroup = vessel.seriesgroup
        const color =
          highlightedTrack !== null && highlightedTrack === seriesgroup ? '#ffffff' : vessel.color
        tracks.push({
          id: seriesgroup.toString(),
          color,
          ...getTrackFromLayers(layers, vessel.tilesetId),
        })
      }
    })

    if (encounter !== null && encounter !== undefined) {
      const encountersTracks = encounter.vessels.map((encounterVessel) => ({
        id: encounterVessel.seriesgroup.toString(),
        color: encounterVessel.color,
        ...getTrackFromLayers(layers, encounterVessel.tilesetId),
      }))
      tracks = [...tracks, ...encountersTracks]
    }

    return tracks
  }
)

const getHeatmapLayers = createSelector(
  [getLayers, getLayerFilters, getReport],
  (layers, layerFilters, report) => {
    // for now interactive is set for all heatmap layers
    // (ie disable all layers if report is triggered)
    const interactive = report.layerId === null
    return layers
      .filter((layer) => layer.type === LAYER_TYPES.Heatmap && layer.added === true)
      .map((layer) => {
        const filters = layerFilters[layer.id] || []
        const layerParams = {
          id: layer.id,
          subtype: layer.subtype,
          tilesetId: layer.tilesetId,
          header: layer.header,
          hue: layer.hue,
          opacity: layer.opacity,
          visible: layer.visible,
          filters,
          // toggle interaction off whenever a report is active
          interactive,
        }
        return layerParams
      })
  }
)

const getStaticLayers = createSelector(
  [getLayers, getReport],
  (layers, report) =>
    layers
      .filter((layer) => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1)
      .map((layer) => {
        // TODO replace with selectedFeatures
        const selectedPolygons =
          report.layerId === layer.id
            ? {
                field: 'reporting_id',
                values: report.polygonsIds,
              }
            : null
        const layerParams = {
          id: layer.id,
          visible: layer.visible,
          selectedPolygons,
          opacity: layer.opacity,
          color: layer.color,
          showLabels: layer.showLabels,
          interactive: report.layerId === null ? true : report.layerId === layer.id,
          // -- needed for custom layers
          isCustom: layer.isCustom,
          subtype: layer.subtype,
          url: layer.url,
          data: layer.data,
          // -- needed for workspace GL layers
          gl: layer.gl,
        }
        return layerParams
      })
)

const getBasemapLayers = createSelector(
  [getBasemap],
  (basemap) =>
    basemap.basemapLayers.map((basemapLayer) => {
      const basemapLayerParams = {
        id: basemapLayer.id,
        visible: basemapLayer.visible,
      }
      return basemapLayerParams
    })
)

const mapStateToProps = (state) => ({
  // attributions: state.mapStyle.attributions, TODO MAP MODULE
  // Forwarded to Map Module
  token: state.user.token,
  viewport: getViewport(state),
  tracks: getAllVesselsForTracks(state),
  heatmapLayers: getHeatmapLayers(state),
  staticLayers: getStaticLayers(state),
  basemapLayers: getBasemapLayers(state),
  temporalExtent: state.filters.timelineInnerExtent,
  loadTemporalExtent: state.filters.timelineOuterExtent,
  highlightTemporalExtent: state.filters.timelineOverExtent,
  // Internal
  workspaceLayers: state.layers.workspaceLayers,
  report: state.report,
})

const mapDispatchToProps = (dispatch) => ({
  onViewportChange: (viewport) => {
    dispatch(
      updateWorkspace({
        viewport,
      })
    )
  },
  onLoadStart: () => {
    dispatch(startLoading())
  },
  onLoadComplete: () => {
    dispatch(completeLoading())
  },
  onMapHover: (event) => {
    dispatch(
      updateMouseLatLon({
        latitude: event.latitude,
        longitude: event.longitude,
      })
    )
  },
  onMapClick: (event) => {
    dispatch(clearVesselInfo())
    dispatch(clearEncountersInfo())
    dispatch(setCurrentSelectedPolygon(null))
    if (event.type === 'activity') {
      const target = event.target
      if (target.isCluster === true) {
        dispatch(trackMapClicked(event.latitude, event.longitude, 'cluster'))
        // dispatch(hideVesselsInfoPanel());
      } else if (event.layer.subtype === LAYER_TYPES.Encounters) {
        dispatch(
          setEncountersInfo(
            event.target.series,
            event.layer.tilesetId,
            event.layer.header.endpoints.info
          )
        )
      } else {
        const header = event.layer.header
        const idFieldKey = header.info.id === undefined ? 'seriesgroup' : header.info.id
        const targetID = event.target[idFieldKey]
        dispatch(
          addVessel({
            tilesetId: event.layer.tilesetId,
            seriesgroup: targetID,
          })
        )
      }
    } else if (event.type === 'static') {
      dispatch(setCurrentSelectedPolygon(event.target.properties))
    }
  },
  toggleCurrentReportPolygon: () => {
    dispatch(toggleCurrentReportPolygon())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapWrapper)

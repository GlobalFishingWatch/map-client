import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { updateWorkspace, updateMouseLatLon } from 'app/workspace/workspaceActions'
import { startLoading, completeLoading } from 'app/app/appActions'
import { clearVesselInfo, addVesselFromHeatmap } from 'app/vesselInfo/vesselInfoActions'
import { setEncountersInfo, clearEncountersInfo } from 'app/encounters/encountersActions'
import { toggleCurrentReportPolygon, setCurrentSelectedPolygon } from 'app/report/reportActions'
import { LAYER_TYPES, LAYER_TYPES_MAPBOX_GL, ENCOUNTERS_AIS } from 'app/constants'
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
    const heatmapLayers = layers
      .filter((layer) => layer.type === LAYER_TYPES.Heatmap && layer.added === true)
      .map((layer) => {
        const filters = layerFilters[layer.id] || []
        const layerParams = {
          id: layer.id,
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
    return heatmapLayers
  }
)

const getStaticLayers = createSelector(
  [getLayers, getReport],
  (layers, report) => {
    const staticLayers = layers
      .filter((layer) => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1)
      .map((layer) => {
        const selectedFeatures =
          report.layerId === layer.id
            ? {
                field: 'reporting_id',
                values: report.polygonsIds,
              }
            : null
        let url
        if (layer.header && layer.header.endpoints) {
          url = layer.header.endpoints.tiles.replace(/\{\{/g, '{').replace(/\}\}/g, '}')
        }
        const layerParams = {
          id: layer.id,
          visible: layer.visible,
          selectedFeatures,
          opacity: layer.opacity,
          color: layer.color,
          showLabels: layer.showLabels,
          interactive: report.layerId === null ? true : report.layerId === layer.id,
          // -- needed for custom layers
          isCustom: layer.isCustom,
          subtype: layer.subtype,
          url,
          data: layer.data,
          // -- needed for workspace GL layers
          gl: layer.gl,
        }
        return layerParams
      })
    return staticLayers
  }
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

const getLayersTitles = createSelector(
  [getLayers],
  (layers) => {
    const titles = {}
    layers.forEach((layer) => {
      titles[layer.id] = layer.title
    })
    return titles
  }
)

const getPriorityFeatures = (event) =>
  event.features.filter((f) => ['legacyHeatmap', 'temporal'].includes(f.layer.group))

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
  layerTitles: getLayersTitles(state),
  report: state.report,
  isCluster: (event) => {
    // always give priority to "interesting" layers
    const priorityFeatures = getPriorityFeatures(event)
    if (priorityFeatures.length === 1 && priorityFeatures[0].isCluster === false) {
      return false
    }
    return event.isCluster === true
  },
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

    if (event.count === 0) return // all cleared, now GTFO
    if (event.isCluster === true) return // let map module zoom in and bail

    const priorityFeatures = getPriorityFeatures(event)
    const feature = priorityFeatures.length === 1 ? priorityFeatures[0] : event.feature
    switch (feature.layer.group) {
      case 'static': {
        dispatch(setCurrentSelectedPolygon(feature.properties))
        break
      }
      case 'legacyHeatmap': {
        dispatch(addVesselFromHeatmap(feature))
        break
      }
      case 'temporal': {
        if (feature.layer.id === ENCOUNTERS_AIS) {
          dispatch(setEncountersInfo(feature.properties.id, ENCOUNTERS_AIS))
        } else {
          dispatch(addVesselFromHeatmap(feature))
        }
        break
      }
      default:
        break
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

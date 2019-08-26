/* eslint-disable import/prefer-default-export */
import { getLayerLibrary } from 'app/layers/layerLibraryActions'
import { setOuterTimelineDates } from 'app/filters/filtersActions'

export const SET_TIMEBAR_CHART_DATA = 'SET_TIMEBAR_CHART_DATA'

export function loadTimebarChartData(startDate, endDate) {
  const start = parseInt(startDate.getUTCFullYear(), 10)
  const end = parseInt(endDate.getUTCFullYear(), 10)
  return (dispatch) => {
    const chartData = []
    for (let i = 0; i <= end - start; i += 1) {
      const req = fetch(
        `${process.env.REACT_APP_TIMEBAR_DATA_URL}/${start + i}-${start + 1 + i}.json`
      )
        .then((res) => {
          if (!res.ok) {
            throw Error(res.statusText)
          }
          return res
        })
        .then((res) => res.json())
      chartData.push(req)
    }
    Promise.all(chartData.map((p) => p.catch((e) => e)))
      .then((jsonList) => {
        let payload = []
        jsonList.forEach((list) => {
          if (list.length) payload = [...payload, ...list]
        })
        return payload
      })
      .then((data) => {
        dispatch({
          type: SET_TIMEBAR_CHART_DATA,
          payload: data,
        })
        // TODO we shouldn't chain load timebar data -> workspace
        // they should be able to load in parallel but this will need a review
        // of the Timebar component
        dispatch(getLayerLibrary())
      })
      .catch(() => {
        console.warn('Error loading Timebar data')
        dispatch({
          type: SET_TIMEBAR_CHART_DATA,
          payload: [{ date: 1325376000000, value: 1 }, { date: 1520640000000, value: 1 }],
        })
        dispatch(getLayerLibrary())
      })
  }
}

// This action allows wrapping timebar legacy outer range behaviour with only inner range (new timebar).
// Will set outerRange to fixed years, in a hardcoded way (doesn`t use header info for simplicity).
// This is to be removed (as well as outerRange in state.filter across the app) when
// new heatmap aka "fast tiles" kicks in
export const loadOuterRangeFromInnerRange = () => (dispatch, getState) => {
  const outerRange = getState().filters.timelineOuterExtent
  const innerRange = getState().filters.timelineInnerExtent
  const startYear = innerRange[0].getFullYear()
  const endYear = innerRange[1].getFullYear()
  if (outerRange[0].getFullYear() !== startYear || outerRange[1].getFullYear() !== endYear) {
    dispatch(
      setOuterTimelineDates([
        new Date(Date.UTC(startYear, 0, 2)),
        new Date(Date.UTC(endYear, 11, 31)),
      ])
    )
  }
}

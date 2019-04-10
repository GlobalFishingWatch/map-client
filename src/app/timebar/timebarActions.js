/* eslint-disable import/prefer-default-export */
import { getLayerLibrary } from 'app/layers/layerLibraryActions'

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

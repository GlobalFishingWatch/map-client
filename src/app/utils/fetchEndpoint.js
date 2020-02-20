import GFWAPI from '@globalfishingwatch/api-client'

export default (url, options) => {
  return GFWAPI.fetch(url, options)
}

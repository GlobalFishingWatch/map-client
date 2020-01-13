import GFWAPI from 'app/gfw-api-client'

export default (url, options) => {
  return GFWAPI.fetch(url, options)
}

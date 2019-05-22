import isDate from 'lodash/isDate'

export default (oldExtent, newExtent) => {
  if (!oldExtent && !newExtent) {
    return false
  }
  if ((!oldExtent && newExtent) || (oldExtent && !newExtent)) {
    return true
  }
  if (isDate(newExtent[0])) {
    return (
      oldExtent[0].getTime() !== newExtent[0].getTime() ||
      oldExtent[1].getTime() !== newExtent[1].getTime()
    )
  }
  return oldExtent[0] !== newExtent[0] || oldExtent[1] !== newExtent[1]
}

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import convert from '@globalfishingwatch/map-convert'
import { ENCOUNTERS_AIS } from 'app/constants'
import { FORMAT_DATE } from 'app/config'
import PopupStyles from 'styles/components/map/popup.module.scss'
import moment from 'moment'

const convertTimeIndexToDate = (timeIndex) => {
  const date = convert.getTimestampFromOffsetedtTimeAtPrecision(timeIndex)
  return moment(date)
    .utc()
    .format(FORMAT_DATE)
}

const getPopupItems = (event, layerTitles) => {
  const items = event.features.map((feature) => {
    const title = layerTitles[feature.layer.id]
    let description = feature.title

    if (feature.layer.id === ENCOUNTERS_AIS) {
      description = convertTimeIndexToDate(feature.properties.timeIndex)
    } else if (feature.layer.group === 'legacyHeatmap') {
      if (feature.isCluster === true) {
        const numVessels = feature.count === -1 ? 'multiple' : feature.count
        const vesselPlural = feature.count > 1 ? 'objects' : 'object'
        description = `${numVessels} ${vesselPlural} at this location`
      } else {
        description = convertTimeIndexToDate(feature.properties.timeIndex)
      }
    }

    return {
      title,
      description,
    }
  })
  return items
}

const HoverPopup = (props) => {
  const { event, layerTitles } = props
  const items = getPopupItems(event, layerTitles)
  return (
    <div className={classnames(PopupStyles.popup, PopupStyles._compact)}>

      {items.map((item, i) => (
        <div key={i}>
          {item.title && <span>{item.title}:</span>}
          {item.description}
        </div>
      ))}
    </div>
  )
}

HoverPopup.propTypes = {
  event: PropTypes.object.isRequired,
  layerTitles: PropTypes.object.isRequired,
}

export default HoverPopup

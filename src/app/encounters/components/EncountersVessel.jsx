import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import infoPanelStyles from 'styles/components/info-panel.module.scss'
import iconStyles from 'styles/icons.module.scss'
import { ReactComponent as ArrowLinkIcon } from 'assets/icons/arrow-link.svg'
import VesselInfoDetails from 'app/vesselInfo/components/VesselInfoDetails'

function EncountersVessel({ vessel, canSeeVesselInfo, canSeeVesselBasicInfo, login, openVessel }) {
  if (vessel.info === undefined) {
    return <div className={infoPanelStyles.encountersData}>loading...</div>
  } else if (vessel.info === null) {
    return <div className={infoPanelStyles.encountersData}>Vessel info could not be loaded.</div>
  }
  if (!canSeeVesselBasicInfo) {
    return (
      <div className={infoPanelStyles.encountersData}>
        <button className={infoPanelStyles.externalLink} onClick={login}>
          Click here to login and see more details
        </button>
      </div>
    )
  }

  // remove vesselname from vessel fields, as we force a custom display for it (the div inside <VesselInfoDetails />)
  const fields = [].concat(vessel.fields)
  fields.splice(fields.findIndex((el) => el.id === 'vesselname'), 1)

  return (
    <div className={infoPanelStyles.encountersData}>
      <VesselInfoDetails
        vesselInfo={vessel.info}
        layerFieldsHeaders={fields}
        canSeeVesselDetails={canSeeVesselInfo}
      >
        <div className={infoPanelStyles.rowInfo}>
          <span className={infoPanelStyles.key}>Vessel</span>
          <button
            onClick={() => openVessel(vessel)}
            className={classnames(infoPanelStyles.value, infoPanelStyles.arrowLink)}
          >
            {vessel.info.vesselname || vessel.id}
            <span className={infoPanelStyles.arrowSvg}>
              {<ArrowLinkIcon className={iconStyles.iconArrowLink} />}
            </span>
          </button>
        </div>
      </VesselInfoDetails>
    </div>
  )
}

EncountersVessel.propTypes = {
  vessel: PropTypes.object.isRequired,
  canSeeVesselInfo: PropTypes.bool.isRequired,
  canSeeVesselBasicInfo: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  openVessel: PropTypes.func.isRequired,
}

export default EncountersVessel

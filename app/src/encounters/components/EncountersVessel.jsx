import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import infoPanelStyles from 'styles/components/info-panel.scss';
import iconStyles from 'styles/icons.scss';
import ArrowLinkIcon from '-!babel-loader!svg-react-loader!assets/icons/arrow-link.svg?name=ArrowLinkIcon';
import VesselInfoDetails from 'vesselInfo/components/VesselInfoDetails';


function EncountersVessel({ vessel, userPermissions, login, openVessel }) {
  if (vessel.info === undefined) {
    return <div className={infoPanelStyles.encountersData}>loading...</div>;
  } else if (vessel.info === null) {
    return <div className={infoPanelStyles.encountersData}>Vessel info could not be loaded.</div>;
  }
  if (userPermissions !== null && userPermissions.indexOf('seeVesselBasicInfo') === -1) {
    return (<div className={infoPanelStyles.encountersData}>
      <a
        className={infoPanelStyles.externalLink}
        onClick={login}
      >Click here to login and see more details</a>
    </div>);
  }

  // remove vesselname from vessel fields, as we force a custom display for it (the div inside <VesselInfoDetails />)
  const fields = [].concat(vessel.fields);
  fields.splice(fields.findIndex(el => el.id === 'vesselname'), 1);

  return (
    <div className={infoPanelStyles.encountersData} >
      <VesselInfoDetails vesselInfo={vessel.info} layerFieldsHeaders={fields} userPermissions={userPermissions}>
        <div className={infoPanelStyles.rowInfo} >
          <span className={infoPanelStyles.key} >Vessel</span>
          <a onClick={() => openVessel(vessel)} className={classnames(infoPanelStyles.value, infoPanelStyles.arrowLink)} >
            { vessel.info.vesselname || vessel.seriesgroup }
            <span className={infoPanelStyles.arrowSvg}>{<ArrowLinkIcon className={iconStyles.iconArrowLink} />}</span>
          </a>
        </div>
      </VesselInfoDetails>
    </div>
  );
}

EncountersVessel.propTypes = {
  vessel: PropTypes.object,
  userPermissions: PropTypes.array,
  login: PropTypes.func.isRequired,
  openVessel: PropTypes.func.isRequired
};

export default EncountersVessel;

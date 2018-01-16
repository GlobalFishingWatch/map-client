import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import infoPanelStyles from 'styles/components/info-panel.scss';
import iconStyles from 'styles/icons.scss';
import ArrowLinkIcon from '-!babel-loader!svg-react-loader!assets/icons/arrow-link.svg?name=ArrowLinkIcon';


function EncountersVessel({ vessel, userPermissions, login, openVessel }) {
  if (vessel.info === undefined) {
    return <div className={infoPanelStyles.encountersData}>loading...</div>;
  }
  if (userPermissions !== null && userPermissions.indexOf('seeVesselBasicInfo') === -1) {
    return (<div className={infoPanelStyles.encountersData}>
      <a
        className={infoPanelStyles.externalLink}
        onClick={login}
      >Click here to login and see more details</a>
    </div>);
  }
  return (
    <div className={infoPanelStyles.encountersData} >
      <div className={infoPanelStyles.rowInfo} >
        <span className={infoPanelStyles.key} >MMSI</span>
        <span className={infoPanelStyles.value} >{vessel.info.mmsi || 'unknown'}</span>
      </div>
      <div className={infoPanelStyles.rowInfo} >
        <span className={infoPanelStyles.key} >Vessel</span>
        <a onClick={() => openVessel(vessel)} className={classnames(infoPanelStyles.value, infoPanelStyles.arrowLink)} >
          { vessel.info.vesselname || vessel.seriesgroup }
          <span className={infoPanelStyles.arrowSvg}>{<ArrowLinkIcon className={iconStyles.iconArrowLink} />}</span>
        </a>
      </div>
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

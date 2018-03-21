import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getCountry } from 'iso-3166-1-alpha-2';

import infoPanelStyles from 'styles/components/info-panel.scss';

class VesselInfoDetails extends Component {

  render() {
    const { currentlyShownVessel, layerFieldsHeaders, userPermissions } = this.props;
    const canSeeVesselDetails = (userPermissions !== null && userPermissions.indexOf('info') !== -1);

    const renderedFieldList = this.generateVesselDetails(layerFieldsHeaders, canSeeVesselDetails, currentlyShownVessel);

    return (
      <div className={infoPanelStyles.details}>
        {renderedFieldList}
      </div>);
  }

  generateVesselDetails(layerFields, canSeeVesselDetails, vesselInfo) {
    const renderedFieldList = [];

    layerFields.filter(field => field.display !== false && (canSeeVesselDetails || field.anonymous)).forEach((field) => {
      let linkList;
      if (vesselInfo[field.id] === undefined) {
        return;
      }
      switch (field.kind) {
        case 'prefixedCSVMultiLink':
          if (!vesselInfo[field.id]) {
            break;
          }
          renderedFieldList.push(<div key={field.id} className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >{field.display}</span>
            <ul className={infoPanelStyles.linkList} >
              <li className={infoPanelStyles.linkListItem} >
                <a
                  className={infoPanelStyles.externalLink}
                  href={`${field.prefix}${vesselInfo[field.id]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {vesselInfo[field.id]}
                </a>
              </li>
            </ul>
          </div>);
          break;
        case 'objectArrayMultiLink':
          linkList = [];
          vesselInfo[field.id].forEach((registry) => {
            linkList.push(<li key={registry.rfmo} className={infoPanelStyles.linkListItem} >
              <a
                className={infoPanelStyles.externalLink}
                href={`${registry.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {registry.rfmo}
              </a>
            </li>);
          });
          renderedFieldList.push(<div key={field.id} className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >{field.display}</span>
            <ul className={infoPanelStyles.linkList} >
              {linkList}
            </ul>
          </div>);
          break;
        case 'flag':
          renderedFieldList.push(<div key={field.id} className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >{field.display}</span>
            <span className={infoPanelStyles.value} >{getCountry(vesselInfo[field.id]) || '---'}</span>
          </div>);
          break;
        default:
          renderedFieldList.push(<div key={field.id} className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >{field.display}</span>
            <span className={infoPanelStyles.value} >{vesselInfo[field.id] || '---'}</span>
          </div>);
      }
    });

    return renderedFieldList;
  }
}

VesselInfoDetails.propTypes = {
  layerFieldsHeaders: PropTypes.array,
  currentlyShownVessel: PropTypes.object,
  userPermissions: PropTypes.array
};

export default VesselInfoDetails;

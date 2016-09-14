import React, { Component } from 'react';
import InfoMapContentStyle from '../../../styles/components/c-info-map-content.scss';
import baseStyle from '../../../styles/_base.scss';
import ButtonStyle from '../../../styles/components/c-button-arrow.scss';
import Rhombus from '../Shared/Rhombus';

class InfoMap extends Component {

  render() {
    return (<div className={baseStyle.wrap}>
      <div className={InfoMapContentStyle['c-info-map-content']}>
        <h2>THE MAP</h2>
        <h3>Explore Now</h3>
        <p>Track commercial fishing activity worldwide on the free, user-friendly, interactive Global Fishing Watch Map.
        </p>
        <p>
          <a href="map" className={ButtonStyle['c-btn-primary-arrow']}>
            <Rhombus color="white" />START HERE</a>
        </p>
      </div>
    </div>);
  }
}

export default InfoMap;

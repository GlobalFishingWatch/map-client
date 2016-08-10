import React, { Component } from 'react';
import InfoMapContentStyle from '../../../styles/components/c-info-map-content.scss';
import ButtonStyle from '../../../styles/components/c-button-arrow.scss';
import BoxTriangleWhiteStyle from '../../../assets/icons/box_triangle_white.svg';

class InfoMap extends Component {

  render() {
    return (<div className={InfoMapContentStyle['c-info-map-content']}>
      <h2>THE MAP</h2>
      <h3>Explore the Map Now</h3>
      <p>Track commercial fishing activity worldwide on the free, user-friendly, interactive Global Fishing Watch Map.
      </p>
      <p>
        <a href="map" className={ButtonStyle['c-btn-primary-arrow']}>
          <img src={BoxTriangleWhiteStyle} alt="Explore map" />START HERE</a>
      </p>
    </div>);
  }
}

export default InfoMap;

import React, { Component } from 'react';
import InfoMapContentStyle from '../../../styles/components/c-info-map-content.scss';
import ButtonStyle from '../../../styles/components/c-button.scss';
import BoxTriangleWhiteStyle from '../../../assets/icons/box_triangle_white.svg';

class InfoMap extends Component {

  render() {
    return (<div className={InfoMapContentStyle.c_info_map_content}>
      <h2>THE MAP</h2>
      <h3>Lorem ipsum dolor sit amet</h3>
      <p>Morbi porttitor massa id bibendum varius. Etiam vitae pulvinar nisi, vel fringilla libero. Nulla consequat
        sodales lectus.
      </p>
      <p>
        <a href="map" className={ButtonStyle.c_btn_primary}>
          <img src={BoxTriangleWhiteStyle} alt="Explore map" />EXPLORE MAP</a>
      </p>
    </div>);
  }
}

export default InfoMap;

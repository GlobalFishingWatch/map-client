import React, { Component } from 'react';
import BaseStyle from '../../../styles/_base.scss';
import OtherSectionStyle from '../../../styles/components/c-other-section.scss';
import orbcommLogo from '../../../assets/logos/orbcomm_logo.jpg';
import atlasLogo from '../../../assets/logos/atlas_logo.png';

class OtherSection extends Component {

  render() {
    return (<section className={OtherSectionStyle['c-other-section']}>
      <div className={BaseStyle.wrap}>
        <h2>Data Providers</h2>
        <div className={OtherSectionStyle['other-logos']}>
          <div>
            <img src={orbcommLogo} alt="orbcomm logo"></img>
          </div>
          <div>
            <img className={OtherSectionStyle['img-small']} src={atlasLogo} alt="atlas logo"></img>
          </div>
        </div>
      </div>
    </section>);
  }
}

export default OtherSection;

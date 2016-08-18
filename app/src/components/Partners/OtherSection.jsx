import React, { Component } from 'react';
import BaseStyle from '../../../styles/_base.scss';
import OtherSectionStyle from '../../../styles/components/c-other-section.scss';
import orbcommLogo from '../../../assets/logos/orbcomm_logo.jpg';

class OtherSection extends Component {

  render() {
    return (<section className={[BaseStyle.wrap, OtherSectionStyle['c-other-section']].join(' ')}>
      <h2>Other Partners</h2>
      <div className={OtherSectionStyle['other-logos']}>
        <img src={orbcommLogo} alt="orbcomm logo"></img>
      </div>
    </section>);
  }
}

export default OtherSection;

import React, { Component } from 'react';
import BaseStyle from '../../../styles/_base.scss';
import ResearchSectionStyle from '../../../styles/components/c-research-section.scss';
import ucsbLogo from '../../../assets/logos/ucsb_logo.png';
import stanfordLogo from '../../../assets/logos/stanford_logo.png';
import wollongongLogo from '../../../assets/logos/wollongong_logo.png';
import dalhouseLogo from '../../../assets/logos/dalhouse_logo.png';

class ResearchSection extends Component {

  render() {
    return (<section className={[BaseStyle.wrap, ResearchSectionStyle['c-research-section']].join(' ')}>
      <h2>Research Partners</h2>
    </section>);
  }
}

export default ResearchSection;

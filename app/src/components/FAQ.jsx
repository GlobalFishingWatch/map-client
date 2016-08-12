import React, { Component } from 'react';
import Footer from './Shared/Footer';
import CoverPrimary from './Shared/CoverPrimary';
import Accordion from './FAQ/Accordion';

import AppStyles from '../../styles/application.scss';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  render() {
    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
      />
      {this.props.faqEntries &&
        <div className={AppStyles.wrap}>
          <Accordion
            entries={this.props.faqEntries}
          />
        </div>}
      <Footer />
    </div>);
  }

}

FAQ.propTypes = {
  faqEntries: React.PropTypes.array,
  getFAQEntries: React.PropTypes.func
};

export default FAQ;

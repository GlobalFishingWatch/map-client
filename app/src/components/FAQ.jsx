import React, { Component } from 'react';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import CoverPrimary from './Shared/CoverPrimary';
import ContentAccordion from './Shared/ContentAccordion';
import AppStyles from '../../styles/application.scss';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  render() {
    let accordionContent = (<Loader />);

    if (this.props.faqEntries && this.props.faqEntries.length > 0) {
      accordionContent = (<ContentAccordion
        entries={this.props.faqEntries}
      />);
    }

    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
        backgroundImageIndex={4}
      />
      <div className={AppStyles.wrap}>
        {accordionContent}
      </div>
      <Footer />
    </div>);
  }
}

FAQ.propTypes = {
  faqEntries: React.PropTypes.array,
  getFAQEntries: React.PropTypes.func
};

export default FAQ;

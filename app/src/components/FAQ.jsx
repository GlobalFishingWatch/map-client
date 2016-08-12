import React, { Component } from 'react';
import Footer from './Shared/Footer';
import CoverPrimary from './Shared/CoverPrimary';
import ContentAccordion from './Shared/ContentAccordion';
import AppStyles from '../../styles/application.scss';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  render() {
    let accordionContent = (<div>Loading....</div>);

    if (this.props.faqEntries && this.props.faqEntries.length > 0) {
      accordionContent = (<ContentAccordion
        entries={this.props.faqEntries}
      />);
    }

    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
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

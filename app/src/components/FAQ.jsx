import React, { Component } from 'react';
import Footer from './Shared/Footer';
import CoverPrimary from './Shared/CoverPrimary';
import Accordion from './Shared/Accordion/Accordion';

import AppStyles from '../../styles/application.scss';
import FAQStyles from '../../styles/components/c-faq.scss';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  getClassName() {
    return `${AppStyles.wrap} ${FAQStyles['c-faq']}`;
  }

  render() {
    let accordionContent = (<div>Loading....</div>);

    if (this.props.faqEntries && this.props.faqEntries.length > 0) {
      accordionContent = (<Accordion
        entries={this.props.faqEntries}
      />);
    }

    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
      />
      <div className={this.getClassName()}>
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

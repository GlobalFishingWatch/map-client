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
    let faqSections = (<Loader />);

    if (this.props.faqEntries && this.props.faqEntries.length > 0) {
      const sections = [];
      this.props.faqEntries.forEach(faqSection => {
        sections.push(<div>
          <h2 className={AppStyles['section-title']}>{faqSection.title}</h2>
          <ContentAccordion
            entries={faqSection.questions}
          />
        </div>);
        faqSections = <div>{sections}</div>;
      });
    }

    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
        backgroundImageIndex={4}
      />
      <div className={AppStyles.wrap}>
        {faqSections}
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

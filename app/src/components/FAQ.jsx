import React, { Component } from 'react';
import classnames from 'classnames';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import Accordion from './Shared/Accordion';
import CoverPrimary from './Shared/CoverPrimary';
import AppStyles from '../../styles/application.scss';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import faqBackgroundImage from '../../assets/images/faq.jpg';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  onAccordionItemClick(currentAccordionIndex, accordionId) {
    this.setState({
      currentAccordionIndex,
      accordionId
    });
  }

  render() {
    let accordions = (<Loader />);
    if (this.props.faqEntries && this.props.faqEntries.length > 0) {
      accordions = this.props.faqEntries.map((faqSection, accordionId) => {
        const currentAccordionIndex = (this.state && this.state.accordionId === accordionId)
          ? this.state.currentAccordionIndex
          : null;
        return (
          <div key={faqSection.title} className={StaticPageStyles['question-group']}>
            <h2 className="section-title">{faqSection.title}</h2>
            <Accordion
              accordionId={accordionId}
              entries={faqSection.questions}
              onAccordionItemClick={(index, slug, id) => { this.onAccordionItemClick(index, id); }}
              currentAccordionIndex={currentAccordionIndex}
            />
          </div>
        );
      });
    }

    return (<div>
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
        backgroundImage={faqBackgroundImage}
        attribution="© Bento Viana"
      />
      <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-faq'])}>
        <div className={AppStyles.wrap}>
          <p className={StaticPageStyles.intro}>Click on the FAQ below to see the answer.</p>
          {accordions}
        </div>
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

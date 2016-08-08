import React, { Component } from 'react';
import Header from '../containers/header';
import Footer from './shared/footer';
import CoverPrimary from './shared/CoverPrimary';
import { Accordion, AccordionItem } from 'react-sanfona';

class FAQ extends Component {

  componentDidMount() {
    this.props.getFAQEntries();
  }

  render() {
    let accordionEntries = [];
    const faqEntries = this.props.faqEntries;
    let faqPageContent;

    if (faqEntries) {
      for (let index = 0; index < faqEntries.length; index++) {
        accordionEntries.push(
          <AccordionItem
            key={index}
            title={faqEntries[index].questions}
          >
            <article >
              <span
                dangerouslySetInnerHTML={{
                  __html: faqEntries[index].answer
                }}
              />
            </article>
          </AccordionItem>
        );
      }

      faqPageContent = (
        <Accordion allowMultiple>
          {accordionEntries}
        </Accordion>
      );
    }

    return (<div>
      <Header />
      <CoverPrimary
        title="Frequently Asked Questions"
        subtitle="Get answers to commonly asked questions about Global Fishing Watch and commercial fishing."
      />
      <section>
        {faqPageContent}
      </section>
      <Footer />
    </div>);
  }

}

FAQ.propTypes = {
  faqEntries: React.PropTypes.array,
  getFAQEntries: React.PropTypes.func
};

export default FAQ;

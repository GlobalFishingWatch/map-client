import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-sanfona';

import AccordionStyles from '../../../styles/components/shared/c-content-accordion.scss';

class ContentAccordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.toggleItemBinded = this.toggleItem.bind(this);
  }

  getAccordionItems() {
    const entries = this.props.entries;
    const accordionItems = [];

    for (let index = 0; index < entries.length; index++) {
      accordionItems.push(
        <AccordionItem
          key={index}
          title={entries[index].question}
          className={AccordionStyles['accordion-item']}
          titleClassName={AccordionStyles['item-title']}
        >
          <article className={AccordionStyles['item-answer']}>
            <p
              dangerouslySetInnerHTML={{
                __html: entries[index].answer
              }}
            />
          </article>
        </AccordionItem>
      );
    }

    return accordionItems;
  }

  // changes arrow's direction when open and close
  // we are not using it right now because we are not
  // implementing the arrows. We'll do in a nerby future.
  toggleItem() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Accordion
        allowMultiple={false}
        activeItems={[-1]}
        className={AccordionStyles['c-content-accordion']}
        onChange={this.toggleItemBinded}
      >
        {this.getAccordionItems()}
      </Accordion>
    );
  }
}

ContentAccordion.propTypes = {
  entries: React.PropTypes.array
};

export default ContentAccordion;

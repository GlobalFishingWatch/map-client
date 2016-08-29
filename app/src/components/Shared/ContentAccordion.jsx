import React, { Component } from 'react';
import { AccordionItem } from 'react-sanfona';
import AccordionGF from '../../lib/AccordionGF';
import AccordionStyles from '../../../styles/components/shared/c-content-accordion.scss';
import ToolTipJSON from './ToolTipJSON';

class ContentAccordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  getAccordionItems() {
    const entries = this.props.entries;
    const accordionItems = [];

    for (let index = 0; index < entries.length; index++) {
      accordionItems.push(
        <AccordionItem
          key={index}
          title={entries[index].title}
          className={AccordionStyles['accordion-item']}
          titleClassName={AccordionStyles['item-title']}
        >
          <article className={AccordionStyles['item-answer']}>
            <ToolTipJSON html={entries[index].content} />
          </article>
        </AccordionItem>
      );
    }

    return accordionItems;
  }

  // returns position in entries array if found
  getIndexActiveItem() {
    const term = this.props.activeItem;
    const entries = this.props.entries;
    let index = -1;

    if (!term) return [index];

    index = entries.findIndex((entry) =>
      entry.slug === term.toLowerCase()
    );

    return [index];
  }

  // changes arrow's direction when open and close
  // we are not using it right now because we are not
  // implementing the arrows. We'll do in a nerby future.
  toggleItem(e) {
    const entries = this.props.entries;
    const indexEntry = e.activeItems[0];

    const titleEntry = entries[indexEntry] ?
      entries[indexEntry].slug : null;

    if (!titleEntry) return;

    // updates url with new entry title selected
    this.props.push(titleEntry);

    // not working right now
    // this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div>
        <AccordionGF
          allowMultiple={false}
          activeItems={this.getIndexActiveItem()}
          className={AccordionStyles['c-content-accordion']}
          onChange={(e) => this.toggleItem(e)}
        >
        {this.getAccordionItems()}
        </AccordionGF>
      </div>
    );
  }
}

ContentAccordion.propTypes = {
  activeItem: React.PropTypes.string,
  entries: React.PropTypes.array,
  push: React.PropTypes.func
};

export default ContentAccordion;

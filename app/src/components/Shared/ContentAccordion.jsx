import React, { Component } from 'react';
import { AccordionItem } from 'react-sanfona';
import AccordionGF from '../../lib/AccordionGF';
import AccordionStyles from '../../../styles/components/shared/c-content-accordion.scss';
import ToolTipJSON from './ToolTipJSON';
import Rhombus from '../Shared/Rhombus';

class ContentAccordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentOpened: null
    };
  }

  getAccordionItems() {
    return this.props.entries.map((entry, index) => {
      let rhombus;
      if (this.props.showRhombus) {
        const currentOpened = this.state.currentOpened || this.getIndexActiveItem()[0];
        const rhombusDirection = (index === currentOpened) ? '-down' : '-right';
        rhombus = (<div className={AccordionStyles['item-rhombus']}>
          <Rhombus direction={rhombusDirection} />
        </div>);
      }
      const title = (<div className={AccordionStyles['item-title']}>
        {entry.title}
        {rhombus}
      </div>);
      return (<AccordionItem
        key={index}
        title={title}
        className={AccordionStyles['accordion-item']}
      >
        <article className={AccordionStyles['item-answer']}>
          <ToolTipJSON html={entry.content} />
        </article>
      </AccordionItem>);
    });
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

    this.setState({ currentOpened: indexEntry });

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
  push: React.PropTypes.func,
  showRhombus: React.PropTypes.bool
};

export default ContentAccordion;

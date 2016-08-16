import React, { Component } from 'react';
import AccordionItem from './AccordionItem';
import Rhombus from '../Rhombus';

import AccordionStyles from '../../../../styles/components/shared/c-accordion.scss';

class Accordion extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: []
    };
  }

  componentWillMount() {
    this.initializeStatus();
  }


  onToggleItem(index) {
    const status = this.state.status;

    if (!this.props.allowMultiple) {
      for (let i = 0; i < status.length; i++) {
        if (i !== index) {
          status[i] = false;
        }
      }
    }

    status[index] = !status[index];

    this.setState({ status });
  }

  getAccordionItems() {
    const items = this.props.entries;
    const accordionItems = [];
    let key = 0;

    if (!items || items.length === 0) return false;

    for (const item of items) {
      accordionItems.push(
        <AccordionItem
          key={key}
          index={key}
          onToggleItem={(index) => (this.onToggleItem(index))}
          isOpen={this.state.status[key]}
        >
          <article
            data-header
            className="accordion-item-head"
          >
            <h4>{item.title}</h4>
            <Rhombus
              direction="-down"
            />
          </article>

          <article
            data-body
            className="accordion-item-body"
            dangerouslySetInnerHTML={{
              __html: item.content
            }}
          />

        </AccordionItem>
      );

      key++;
    }

    return accordionItems;
  }

  initializeStatus() {
    const items = this.props.entries.length;

    for (let i = 0; i < items; i++) {
      const itemStatus = i === 0;
      this.state.status.push(itemStatus);
    }
  }

  render() {
    const accordionContent = this.getAccordionItems();

    return (
      <ul className="c-accordion">
        {accordionContent}
      </ul>
    );
  }
}

Accordion.propTypes = {
  // array of data to be displayed
  entries: React.PropTypes.array,
  // allows multiple items open at the same time
  allowMultiple: React.PropTypes.bool
};

export default Accordion;

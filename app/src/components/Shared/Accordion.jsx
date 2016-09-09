import React, { Component } from 'react';
import ToolTipJSON from './ToolTipJSON';
import Rhombus from './Rhombus';
import Loader from './Loader';
import AccordionStyles from '../../../styles/components/shared/c-content-accordion.scss';
import { scrollTo } from '../../lib/Utils';
import $ from 'jquery';

class Accordion extends Component {
  componentDidUpdate() {
    if (!this.props.autoscroll || this.scrolled) return;

    const $el = $(`.${AccordionStyles['-opened']}`).parent();
    if ($el.length) {
      scrollTo($el);
    }
    this.scrolled = true;
  }

  onItemClick(index, slug) {
    this.props.onAccordionItemClick(index, slug, this.props.accordionId);
  }

  render() {
    let entries = (<Loader />);
    if (this.props.entries && this.props.entries.length > 0) {
      entries = this.props.entries.map((entry, index) => {
        let classNames = AccordionStyles['item-content'];
        let classRhombus = AccordionStyles['item-rhombus'];

        if (index === this.props.currentAccordionIndex) {
          classNames += ` ${AccordionStyles['-opened']}`;
          classRhombus += ` ${AccordionStyles['rhombus-opened']}`;
        }
        return (
          <div
            className={AccordionStyles['accordion-item']}
            key={index}
          >
            <div
              className={AccordionStyles['item-title']}
              onClick={() => { this.onItemClick(index, entry.slug); }}
            >
              {entry.title}
              <div className={classRhombus}>
                <Rhombus color="blue" />
              </div>
            </div>
            <article className={classNames}>
              <ToolTipJSON html={entry.content} />
            </article>
          </div>
        );
      });
    }
    return <div className={AccordionStyles['c-content-accordion']}>{entries}</div>;
  }
}

Accordion.propTypes = {
  // give a unique id to this accordion (useful in callback to sort out active accordion)
  accordionId: React.PropTypes.number,
  // content used in accordion, each entry contains a title, a content and optionally a slug
  entries: React.PropTypes.array,
  // callback called on accordion item click, will send index and slug of the clicked item, an the accordionId
  onAccordionItemClick: React.PropTypes.func,
  // update this prop to open on a particular item
  currentAccordionIndex: React.PropTypes.number,
  // autoscroll to currentAccordionIndex when component mounts
  autoscroll: React.PropTypes.bool
};

export default Accordion;

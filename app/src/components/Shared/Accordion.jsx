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
    this.index = (index === this.index) ? null : index;
    this.props.onAccordionItemClick(this.index, slug, this.props.accordionId);
  }

  render() {
    let entries = (<Loader />);
    if (this.props.entries && this.props.entries.length > 0) {
      entries = this.props.entries.map((entry, index) => {
        let classNames = AccordionStyles['item-content'];
        const rhombusDirection = (index === this.props.currentAccordionIndex) ? '-down' : '-right';

        if (index === this.props.currentAccordionIndex) {
          classNames += ` ${AccordionStyles['-opened']}`;
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
              <div className={AccordionStyles['item-rhombus']}>
                <Rhombus direction={rhombusDirection} />
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
  accordionId: React.PropTypes.number,
  entries: React.PropTypes.array,
  onAccordionItemClick: React.PropTypes.func,
  currentAccordionIndex: React.PropTypes.number,
  autoscroll: React.PropTypes.bool
};

export default Accordion;

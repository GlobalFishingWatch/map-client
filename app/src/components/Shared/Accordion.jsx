import React, { Component } from 'react';
import ToolTipJSON from './ToolTipJSON';
import Rhombus from './Rhombus';
import Loader from './Loader';
import $ from 'jquery';
import classnames from 'classnames';
import AccordionStyles from '../../../styles/components/shared/c-content-accordion.scss';

class Accordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // This attribute will contain array of strings being the height of each item in px
      maxHeights: null
    };
  }

  componentDidMount() {
    const itemsContent = [...this.refs.items.querySelectorAll(`.${AccordionStyles['item-content']}`)];

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      maxHeights: itemsContent.map(content => `${content.getBoundingClientRect().height}px`)
    });
  }

  onItemClick(index, slug) {
    // We execute the callback to collapse the previous item
    this.props.onAccordionItemClick(index, slug, this.props.accordionId);

    // We want to scroll to the clicked item on smaller device and only it the user is not closing it
    const isClosingItem = this.props.currentAccordionIndex === index;
    if (window.innerWidth <= 768 && !isClosingItem) {
      // We retrieve the clicked item to get its position from the top of the page
      const items = [...this.refs.items.querySelectorAll(`.${AccordionStyles['accordion-item']}`)];
      const clickedItem = items[index];

      // Before scrolling, we need to make sure that if a previous item was expanded, we wait for it to
      // collapse otherwise there will be an offset of the height of the collapsing item
      // Also, if the previous expanded item is below the clicked one, we don't need to wait because it
      // won't affect the scrolling behavior
      // Finally, the first time an item is expanded, we shouldn't need a delay but because several accordions can
      // be present on the same page, we don't want an offset when a previous accordion collapses
      const needsDelay = !this.props.currentAccordionIndex || this.props.currentAccordionIndex < index;
      const delay = 750; // The delay depends on the CSS transitions, please make sure to update both of them at once
      const scrollAndExpand = () => requestAnimationFrame(() => {
        const topPosition = clickedItem.offsetTop;
        $('html, body').animate({ scrollTop: topPosition }, 500);
      });
      // We need a double rAF here so we make sure the layout has been updated by the browser
      requestAnimationFrame(() => {
        if (needsDelay) setTimeout(scrollAndExpand, delay);
        else scrollAndExpand();
      });
    }
  }

  render() {
    let entries = (<Loader />);
    if (this.props.entries && this.props.entries.length > 0) {
      entries = this.props.entries.map((entry, index) => {
        const isItemExpanded = this.props.currentAccordionIndex === index;

        // By default, the max-height of all the elements is set to default so they
        // are all expanded and we can measure their height: this.state.maxHeights will contains
        // an array of strings (the heights in px).
        // After that, or the height of each item is 0 (collapsed) or the value store in the state
        // (expanded).
        let maxHeight = 'auto';
        if (this.state.maxHeights) {
          if (isItemExpanded) maxHeight = this.state.maxHeights[index];
          else maxHeight = 0;
        }

        return (
          <div
            className={AccordionStyles['accordion-item']}
            key={index}
          >
            <div
              className={AccordionStyles['item-title']}
              onClick={() => this.onItemClick(index, entry.slug)}
            >
              {entry.title}
              <div
                className={classnames({
                  [AccordionStyles['item-rhombus']]: true,
                  [AccordionStyles['rhombus-opened']]: isItemExpanded
                })}
              >
                <Rhombus color="blue" />
              </div>
            </div>
            <article
              className={classnames({
                [AccordionStyles['item-content']]: true,
                [AccordionStyles['-opened']]: isItemExpanded
              })}
              style={{ maxHeight }}
            >
              <ToolTipJSON html={entry.content} />
            </article>
          </div>
        );
      });
    }
    return <div className={AccordionStyles['c-content-accordion']} ref="items">{entries}</div>;
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

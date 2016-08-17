import React, { Component } from 'react';

import AccordionStyles from '../../../../styles/components/shared/c-accordion.scss';

class AccordionItem extends Component {

  getHeader() {
    return this.props.children.find((children) =>
      children.props['data-header']
    );
  }

  getContent() {
    return this.props.children.find((children) =>
      children.props['data-body']
    );
  }

  getClassName() {
    const statusClass = this.props.isOpen ? '-expanded' : '';

    return `accordion-item ${statusClass}`;
  }

  onClick() {
    const index = this.props.index;
    this.props.onToggleItem(index);
  }

  render() {
    const header = this.getHeader();
    const content = this.getContent();

    return (
      <li className={this.getClassName()}>
        <div
          onClick={() => (this.onClick())}
        >
          {header}
        </div>
        <div>
          {content}
        </div>
      </li>
    );
  }
}

AccordionItem.propTypes = {
  children: React.PropTypes.array,
  index: React.PropTypes.number,
  isOpen: React.PropTypes.bool,
  onToggleItem: React.PropTypes.func
};

export default AccordionItem;

import React, { Component } from 'react';

import ImageAttributionStyles from '../../../styles/components/shared/c-image-attribution.scss';

class ImageAttribution extends Component {

  render() {
    const isString = typeof this.props.children === 'string';

    return (
      <div className={ImageAttributionStyles['c-image-attribution']}>

        {isString && <span className={ImageAttributionStyles.author}>
          {this.props.children}
        </span>}

        {!isString && this.props.children}
      </div>
    );
  }
}

ImageAttribution.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ])
};

export default ImageAttribution;

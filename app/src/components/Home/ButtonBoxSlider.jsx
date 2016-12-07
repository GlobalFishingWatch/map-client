import React, { Component } from 'react';
import CoverPage from 'styles/components/c-cover-page.scss';

class ButtonBoxSlider extends Component {
  render() {
    return (<div>
      <svg width="12" height="12" className={CoverPage['selected-box']} onClick={this.goSlick}>
        <rect
          width="12"
          height="12"
        />
      </svg>
      <svg width="12" height="12">
        <rect
          width="12"
          height="12"
        />
      </svg>
      <svg width="12" height="12">
        <rect
          width="12"
          height="12"
        />
      </svg>
      <svg width="12" height="12">
        <rect
          width="12"
          height="12"
        />
      </svg>
      <svg width="12" height="12">
        <rect
          width="12"
          height="12"
        />
      </svg>
    </div>);
  }

}

export default ButtonBoxSlider;

import React, { Component } from 'react';
import loaderStyle from 'styles/components/c-loader.scss';

class Loader extends Component {

  render() {
    return (<div className={loaderStyle['c-loader']}>
      <div className={[loaderStyle['sk-circle1'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle2'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle3'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle4'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle5'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle6'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle7'], loaderStyle['sk-child']].join(' ')}></div>
      <div className={[loaderStyle['sk-circle8'], loaderStyle['sk-child']].join(' ')}></div>
    </div>);
  }
}

export default Loader;

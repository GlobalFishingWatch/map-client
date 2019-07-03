import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import RulersStyles from './rulers.module.scss'

class Rulers extends Component {
  state = {
    languages: null,
    currentLng: null,
  }

  render() {
    const { numRulers, editing, toggle, reset } = this.props
    return (
      <ul className={RulersStyles.container}>
        <li className={cx(RulersStyles.main, { [RulersStyles._active]: editing })}>
          <button onClick={() => toggle()}>:{numRulers}</button>
        </li>
        <li style={{ transform: `translateX(-100%)` }}>
          <button onClick={() => reset()}>d</button>
        </li>
      </ul>
    )
  }
}

Rulers.propTypes = {
  numRulers: PropTypes.number.isRequired,
  editing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

export default Rulers

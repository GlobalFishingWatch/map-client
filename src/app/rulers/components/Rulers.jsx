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
    const {
      numRulers,
      visible,
      editing,
      toggle,
      toggleVisibility,
      toggleEditing,
      reset,
    } = this.props
    return (
      <ul className={RulersStyles.container}>
        <li className={cx(RulersStyles.main, { [RulersStyles._active]: visible || editing })}>
          <button onClick={() => toggle()}>:{numRulers}</button>
        </li>
        <li
          className={cx({ [RulersStyles._active]: visible })}
          style={{ transform: `translateX(-100%)` }}
        >
          <button onClick={() => toggleVisibility()}>v</button>
        </li>
        <li
          className={cx({ [RulersStyles._active]: editing })}
          style={{ transform: `translateX(-200%)` }}
        >
          <button onClick={() => toggleEditing()}>e</button>
        </li>
        <li style={{ transform: `translateX(-300%)` }}>
          <button onClick={() => reset()}>d</button>
        </li>
      </ul>
    )
  }
}

Rulers.propTypes = {
  numRulers: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  toggleVisibility: PropTypes.bool.isRequired,
  toggleEditing: PropTypes.bool.isRequired,
  reset: PropTypes.bool.isRequired,
}

export default Rulers

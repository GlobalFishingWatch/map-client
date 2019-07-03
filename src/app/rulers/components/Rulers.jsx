import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Icon from 'app/components/Shared/Icon'

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
          <button onClick={() => toggle()}>
            <Icon icon="ruler" activated />
            {numRulers > 0 && <div className={RulersStyles.num}>{numRulers}</div>}
          </button>
        </li>
        {numRulers > 0 && (
          <li style={{ transform: `translateX(-100%)` }}>
            <button onClick={() => reset()}>
              <Icon icon="remove" activated />
            </button>
          </li>
        )}
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

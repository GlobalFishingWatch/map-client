import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ExpandItemStyles from 'styles/components/shared/expand-item.module.scss'

function ExpandItem({ active, children, accordion, isVesselInfoPanelOpen }) {
  return (
    <div>
      <div
        className={classnames(ExpandItemStyles.expandItem, {
          [ExpandItemStyles.isVesselInfoPanelOpen]: isVesselInfoPanelOpen,
        })}
      >
        {active && (
          <div
            className={classnames({
              [ExpandItemStyles.notAccordion]: !accordion,
            })}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

ExpandItem.propTypes = {
  active: PropTypes.bool.isRequired,
  accordion: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isVesselInfoPanelOpen: PropTypes.bool,
}

export default ExpandItem

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AccordionStyles from 'styles/components/shared/accordion.module.scss'

function AccordionHeader({ menuName, openMenu, expandState }) {
  const expandName = menuName.toUpperCase().replace(/ /g, '_')
  return (
    <div className={AccordionStyles.accordionHeader} onClick={() => openMenu(expandName)}>
      <div className={AccordionStyles.title}>{menuName}</div>
      <div
        className={classnames(AccordionStyles.expandArrowButton, {
          [AccordionStyles.expanded]: expandName === expandState,
        })}
      />
    </div>
  )
}

AccordionHeader.propTypes = {
  menuName: PropTypes.string.isRequired,
  expandState: PropTypes.string,
  openMenu: PropTypes.func.isRequired,
}

export default AccordionHeader

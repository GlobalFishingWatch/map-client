import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import LoaderStyles from 'styles/components/loader.module.scss'

export default function Loader({ visible, absolute, tiny }) {
  if (!visible) return null
  return (
    <div
      className={classnames([
        LoaderStyles.loader,
        {
          [LoaderStyles._absolute]: absolute,
          [LoaderStyles._tiny]: tiny,
        },
      ])}
    >
      <div className={LoaderStyles.loaderContainer}>
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
        <div className={LoaderStyles.loaderBubble} />
      </div>
    </div>
  )
}

Loader.propTypes = {
  visible: PropTypes.bool,
  absolute: PropTypes.bool,
  tiny: PropTypes.bool,
}

Loader.defaultProps = {
  visible: false,
  absolute: false,
  tiny: false,
}

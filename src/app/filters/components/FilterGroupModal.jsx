import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FilterGroupForm from 'app/filters/containers/FilterGroupForm'
import Modal from 'app/components/Shared/Modal'
import ButtonStyles from 'styles/components/button.module.scss'
import ModalStyles from 'styles/components/shared/modal.module.scss'
import classnames from 'classnames'

class FilterGroupModal extends Component {
  constructor() {
    super()
    this.state = {
      validated: false,
    }
  }

  onClickSave() {
    this.setState({ validated: !this.state.validated })
    if (this.props.warning === undefined || this.state.validated === true) {
      this.props.onSaveClicked()
    }
  }

  onClickChangeSelection() {
    this.setState({ validated: false })
  }

  onClose() {
    this.setState({ validated: false })
    this.props.close()
  }

  renderFooter(displayedWarning) {
    const { disableSave } = this.props
    return (
      <div className={ModalStyles.footerContainer}>
        {displayedWarning && (
          <button
            className={classnames(ButtonStyles.button, ButtonStyles._big, ModalStyles.mainButton)}
            onClick={() => this.onClickChangeSelection()}
          >
            Change selection
          </button>
        )}
        <button
          className={classnames(
            ButtonStyles.button,
            ButtonStyles._filled,
            ButtonStyles._big,
            ModalStyles.mainButton,
            {
              [ButtonStyles._disabled]: disableSave,
            }
          )}
          onClick={() => this.onClickSave()}
        >
          Save
        </button>
      </div>
    )
  }

  renderForm() {
    return <FilterGroupForm {...this.props} />
  }

  renderWarning() {
    return <div className={ModalStyles.warning}>{this.props.warning}</div>
  }

  render() {
    const { opened, warning } = this.props

    const displayedWarning = warning !== undefined && this.state.validated === true
    return (
      <Modal
        opened={opened}
        close={() => this.onClose()}
        visible
        closeable
        isSmall
        isScrollable
        footer={this.renderFooter(displayedWarning)}
      >
        {displayedWarning ? this.renderWarning() : this.renderForm()}
      </Modal>
    )
  }
}

FilterGroupModal.propTypes = {
  opened: PropTypes.bool,
  close: PropTypes.func,
  onSaveClicked: PropTypes.func,
  displayWarning: PropTypes.bool,
  disableSave: PropTypes.bool,
  warning: PropTypes.string,
}

export default FilterGroupModal

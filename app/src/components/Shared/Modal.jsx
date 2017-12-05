import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import ModalStyles from 'styles/components/shared/modal.scss';
import Icon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyDown = (e) => {
      if (e.keyCode !== 27) {
        return;
      }
      e.preventDefault();
      this.props.close();
    };

    /* If the modal is opened at instantiation, we want the keydown handler to be active */
    if (props.opened) {
      document.addEventListener('keydown', this.onKeyDown);
      document.body.classList.add(ModalStyles._noBgOverlay);
    }
  }

  shouldComponentUpdate(nextProps) {
    /* We attach the keydown handler only if the modal gets to be visible */
    if (!this.props.opened && nextProps.opened) {
      document.addEventListener('keydown', this.onKeyDown);
      document.body.classList.add(ModalStyles._noBgOverlay);
    } else if (this.props.opened && !nextProps.opened) {
      document.body.classList.remove(ModalStyles._noBgOverlay);
    }

    return true;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.remove(ModalStyles._noBgOverlay);
  }

  onClickOverlay(e) {
    if (this.props.closeable && e.target === e.currentTarget) {
      this.props.close();
    }
  }

  render() {
    const { opened, visible, footer, zIndex, isScrollable,
      children, isSmall, closeable, close } = this.props;

    if (!opened || !visible) return null;
    let closeButton;
    const customStyles = {
      zIndex: zIndex || null
    };

    if (closeable) {
      closeButton = (<button className={ModalStyles.closeButton} onClick={() => close()}>
        <Icon className={ModalStyles.icon} title="Close this modal" />
      </button>);
    }

    return (
      <div
        style={customStyles}
        className={
          classnames(ModalStyles.modal, { [ModalStyles._small]: isSmall, [ModalStyles._scrollable]: isScrollable })}
        onClick={e => this.onClickOverlay(e)}
      >
        <div
          className={ModalStyles.content}
          onClick={e => this.onClickOverlay(e)}
        >
          <div className={ModalStyles.containContent}>
            <div className={ModalStyles.containButton}>
              {closeButton}
            </div>
            <div
              className={
                classnames(ModalStyles.containPadding, ModalStyles.scrollbar, { [ModalStyles._withFooter]: footer })
              }
            >
              <div className={ModalStyles.mainContent}>
                {children}
              </div>
            </div>
            {footer && <div className={ModalStyles.footer}>{footer}</div>}
          </div>
        </div>
      </div>
    );
  }

}

Modal.propTypes = {
  /**
   * The callback method when closing the modal
   */
  close: PropTypes.func.isRequired,
  /**
   * Define whether the modal is opened or not
   */
  opened: PropTypes.bool.isRequired,
  /**
   * Define whether the modal is visible
   */
  visible: PropTypes.bool.isRequired,
  /**
   * Define the content of the modal
   * Required
   */
  children: PropTypes.node,
  /**
   * Define the content of the fixed - no scrolling footer
   * Required
   */
  footer: PropTypes.node,
  /**
   * Define the modal box can be closed by the user
   * Required
   */
  closeable: PropTypes.bool,
  /**
   * Sets z-index of the modal
   */
  isSmall: PropTypes.bool,
  isScrollable: PropTypes.bool,
  zIndex: PropTypes.number
};


export default Modal;

import React from 'react';
import styles from '../../../styles/components/shared/c-modal.scss';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyPress = e => {
      if (e.keyCode !== 27) return;
      e.preventDefault();
      this.props.close();
    };

    /* If the modal is opened at instantiation, we want the keypress handler to be active */
    if (props.opened) {
      document.addEventListener('keypress', this.onKeyPress);
    }
  }

  shouldComponentUpdate(nextProps) {
    /* We attach the keypress handler only if the modal gets to be visible */
    if (!this.props.opened && nextProps.opened) {
      document.addEventListener('keypress', this.onKeyPress);
    }

    return true;
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.onKeyPress);
  }

  onClickOverlay(e) {
    if (e.target === e.currentTarget) this.props.close();
  }

  render() {
    if (!this.props.opened) return null;

    return (
      <div className={styles['c-modal']} onClick={(e) => this.onClickOverlay(e)}>
        <div className={styles.content}>
          <button className={styles['close-button']} onClick={() => this.props.close()}>
            <svg className={styles.icon} title="Close this modal">
              <g strokeWidth="3" stroke="#43649C" fill="none" fillRule="evenodd" strokeLinecap="square">
                <path d="M2.627 2.627L13.43 13.43M13.373 2.627L2.57 13.43" />
              </g>
            </svg>
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }

}

Modal.propTypes = {
  /**
   * The callback method when closing the modal
   */
  close: React.PropTypes.func.isRequired,
  /**
   * Define whether the modal is opened or not
   */
  opened: React.PropTypes.bool.isRequired,
  /**
   * Define the content of the modal
   * Required
   */
  children: React.PropTypes.any
};


export default Modal;

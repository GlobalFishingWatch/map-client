import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import SupportFormStyles from 'styles/components/support-form.module.scss'
import ButtonStyles from 'styles/components/button.module.scss'

class SupportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormResponse: false,
      classSelect: '',
      disabledOption: false,
      validated: false,
      form: {
        url: window.location.href,
        type: '',
        subject: '',
        description: '',
        name: props.defaultUserName ? props.defaultUserName : '',
        email: props.defaultUserEmail ? props.defaultUserEmail : '',
      },
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const showThankYou = this.props.supportRequestStatus !== nextProps.supportRequestStatus
    this.setState({
      showFormResponse: showThankYou,
    })
  }

  handleChange(event) {
    if (event.target.name === 'selectCompany') {
      this.setState({
        classSelect: 'select-selected',
        disabledOption: true,
      })
    }
    const form = {
      ...this.state.form,
      [event.target.id.substr(8)]: event.target.value,
    }
    this.setState({ form })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    if (!this.form.checkValidity()) {
      this.setState({
        validated: true,
      })
      return false
    }

    this.props.onFormSubmit(this.state.form, '/contact/support')
    return true
  }

  render() {
    if (this.state.showFormResponse) {
      let message
      if (this.props.supportRequestStatus === 200) {
        message = 'Thank you for your inquiry'
      } else {
        message = 'There was a problem submitting your contact request. Please try again later'
      }
      return (
        <section className={SupportFormStyles.supportForm}>
          <h1 className={SupportFormStyles.messageAfter}>{message}</h1>
          <button className={ButtonStyles.buttonSubmitSmall} onClick={() => this.props.close()}>
            Close
          </button>
        </section>
      )
    }

    return (
      <section
        className={classnames({
          [SupportFormStyles.supportForm]: true,
          [SupportFormStyles.validated]: this.state.validated,
        })}
      >
        <h1>Support</h1>
        <form
          action=""
          method="POST"
          onSubmit={(event) => {
            this.handleFormSubmit(event)
          }}
          ref={(ref) => {
            this.form = ref
          }}
        >
          <div
            className={classnames({
              [SupportFormStyles.containForm]: true,
              [SupportFormStyles.validated]: this.state.validated,
            })}
          >
            <div className={SupportFormStyles.containerInputs}>
              <label htmlFor="support_name">Name</label>
              <input
                className={SupportFormStyles.inputText}
                type="name"
                id="support_name"
                placeholder="Name"
                required
                onChange={(event) => {
                  this.handleChange(event)
                }}
                value={this.state.form.name}
              />
              <label htmlFor="support_email">Email</label>
              <input
                className={SupportFormStyles.inputText}
                type="email"
                id="support_email"
                placeholder="Email"
                onChange={(event) => {
                  this.handleChange(event)
                }}
                value={this.state.form.email}
                required
              />
              <label htmlFor="support_type">Type</label>
              <div className={SupportFormStyles.selectContainer}>
                <select
                  id="support_type"
                  onChange={(event) => {
                    this.handleChange(event)
                  }}
                  name="selectCompany"
                  className={SupportFormStyles[this.state.classSelect]}
                  required
                >
                  <option value="" disabled={this.state.disabledOption}>
                    Select an option
                  </option>
                  <option value="Error">Error</option>
                  <option value="Question">Question</option>
                  <option value="Feature">Feature</option>
                </select>
              </div>

              <label htmlFor="support_subject">Subject</label>
              <input
                className={SupportFormStyles.inputText}
                type="text"
                id="support_subject"
                placeholder="Subject"
                required
                onChange={(event) => {
                  this.handleChange(event)
                }}
              />
            </div>
            <div className={SupportFormStyles.containerTextarea}>
              <label htmlFor="support_description">description</label>
              <textarea
                id="support_description"
                placeholder="Please let us know how we can help!"
                className={SupportFormStyles.textareaForm}
                required
                onChange={(event) => {
                  this.handleChange(event)
                }}
              />
            </div>
          </div>
          <input
            type="hidden"
            name="url"
            id="support_url"
            value={window.location}
            onChange={(event) => {
              this.handleChange(event)
            }}
          />
          <div className={SupportFormStyles.containerSubmit}>
            <button type="submit" className={ButtonStyles.buttonSubmitSmall}>
              Send
            </button>
          </div>
        </form>
      </section>
    )
  }
}

SupportForm.propTypes = {
  supportRequestStatus: PropTypes.any.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  defaultUserName: PropTypes.string.isRequired,
  defaultUserEmail: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
}

export default SupportForm

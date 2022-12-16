import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Title from './../common/Title/Title'
import DashboardButton from '../DashboardButton'
import { sendNotification } from '../../stores/ReduxStores/dashboard/dashboard'
import { Button, Icon } from '../common'
import SVGIcons from '../SVGIcons'
import { getIcon } from '../../stores/IconStore'

class DialogSendNotification extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      submitting: false,
    }
  }

  submit = () => {
    if (!this.state.submitting) {
      this.props.dispatch(sendNotification(this.state.message))
      this.setState({ submitting: true })
    }
  }

  render() {
    const { onClose } = this.props
    const { message } = this.state
    return (
      <div className="dialog-evacuate-site dialog--with-form">
        <div className="dialog__controls">
          <div className="dialog__title">
            <SVGIcons name="message" />
            <h3>Send notification</h3>
          </div>
          <Button onClick={onClose} type="close">
            <Icon src={getIcon('closeIcon')} size={20} />
          </Button>
        </div>
        <Title type="h2">Send Notification</Title>
        <div className="textareaMessage dialog-notification-message">
          Message
          <textarea
            autoFocus /* eslint-disable-line */
            name="message"
            value={this.state.notificationMessage}
            onChange={e => this.setState({ message: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            onKeyUp={({ key }) =>
              key === 'Enter' && this.state.message && this.submit()
            }
          />
        </div>
        <div className="dialog__button-bar">
          <DashboardButton variant="secondary" onClick={onClose}>
            Cancel
          </DashboardButton>
          <DashboardButton disabled={!message} onClick={() => this.submit()}>
            Send
          </DashboardButton>
        </div>
      </div>
    )
  }
}

export default DialogSendNotification

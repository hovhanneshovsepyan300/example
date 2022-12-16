import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'

import Title from './../common/Title/Title'
import { lockdownZone } from '../../stores/ReduxStores/dashboard/dashboard'
import DashboardButton from '../DashboardButton'
import { Button, Icon } from '../common'
import SVGIcons from '../SVGIcons'
import { getIcon } from '../../stores/IconStore'
import IncidentFormField from '../IncidentFormField/IncidentFormField'
import { INCIDENT_FIELD_TYPES } from '../../utils/constants'

class DialogLockdownZone extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    event: PropTypes.instanceOf(Parse.Object).isRequired,
  }
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      lockdownArea: '',
      lockdownMessage: '',
      submitting: false,
    }
  }

  submit = () => {
    if (!this.state.submitting) {
      this.props.dispatch(
        lockdownZone(
          `Lockdown Alert. ${this.state.lockdownArea ||
            'The event'} is being locked down. Reason: ${
            this.state.lockdownMessage
          }`,
        ),
      )
      this.setState({ submitting: true })
    }
  }

  render() {
    const { event, onClose } = this.props

    return (
      <div className="dialog-evacuate-site dialog--with-form">
        <div className="dialog__controls">
          <div className="dialog__title">
            <SVGIcons name="lockdown" />
            <h3>Lock down zone</h3>
          </div>
          <Button onClick={onClose} type="close">
            <Icon src={getIcon('closeIcon')} size={20} />
          </Button>
        </div>
        <Title type="h2">Send Lockdown Alert</Title>
        <div>
          <IncidentFormField
            placeholder="Area to lockdown"
            dataSource={event?.zones}
            handleChange={(id, value) => this.setState({ [id]: value })}
            field_type={INCIDENT_FIELD_TYPES.picker}
            value={this.state.lockdownArea}
            id={'lockdownArea'}
          />
        </div>
        <div className="textareaMessage">
          Lockdown notes
          <textarea
            autoFocus /* eslint-disable-line */
            name="message"
            value={this.state.lockdownMessage}
            onChange={e => this.setState({ lockdownMessage: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            onKeyUp={e =>
              e.key === 'Enter' &&
              this.state.lockdownMessage &&
              this.state.lockdownArea &&
              this.submit()
            }
          />
        </div>

        <div className="dialog__button-bar">
          <DashboardButton onClick={onClose} variant="secondary">
            Cancel
          </DashboardButton>
          <DashboardButton
            disabled={!this.state.lockdownMessage || !this.state.lockdownArea}
            onClick={() => this.submit()}
          >
            Send
          </DashboardButton>
        </div>
      </div>
    )
  }
}

export default connect(state => ({ event: state.currentEvent.event }))(
  DialogLockdownZone,
)

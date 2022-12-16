import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DashboardButton from './../DashboardButton'
import { addActivityLog } from '../../stores/ReduxStores/dashboard/logs'
import btnSend from '../../images/send-message.png'
import { Icon } from '../common'
import { getIcon } from '../../stores/IconStore'
import { connect } from 'react-redux'
import Parse from 'parse'
import {
  pollLogs,
} from '../../stores/ReduxStores/dashboard/logs'
class DialogAddActivityLog extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.instanceOf(Parse.User),
  }
  static defaultProps = { currentUser: null }

  constructor (props) {
    super(props)
    this.state = { message: '' }
  }

  submit = () => {
    this.props.dispatch(addActivityLog(`${this.props.currentUser.name} added acvitiy details "${this.state.message}"`, 'dashboard'))
    this.props.dispatch(pollLogs())
  }

  render() {
    return (
      <div className="dialog-add-activity-log">
        <textarea
          autoFocus /* eslint-disable-line */
          placeholder="Activity Details. Press 'Enter' to save. Press 'Shift+Enter' for new line"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.shiftKey) {
              // Do nothing in this case treat it as default enter
            } else if (e.key === 'Enter') {
              e.preventDefault()
              this.submit()
              this.setState({ message: '' })
            }
          }}
        />
        <button
          onClick={e => {
            if (this.state.message.length > 0) {
              this.submit()
              this.setState({ message: '' })
            }
          }}
        >
          <Icon src={getIcon('sendWhite')} size={24} />
        </button>
      </div>
    )
  }
}

export default connect(state => ({
  currentUser: state.auth.currentUser,
}))(DialogAddActivityLog)



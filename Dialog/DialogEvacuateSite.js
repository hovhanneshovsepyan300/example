import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Title from './../common/Title/Title'
import { evacuateSite } from '../../stores/ReduxStores/dashboard/dashboard'
import DashboardButton from '../DashboardButton'
import SVGIcons from '../SVGIcons'
import { Button, Icon } from '../common'
import { getIcon } from '../../stores/IconStore'

class DialogEvacuateSite extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      evacuationStep: 'Prepare to Evacuate',
      evacuationMessage: '',
      submitting: false,
    }
  }

  submit = () => {
    if (!this.state.submitting) {
      this.props.dispatch(
        evacuateSite(
          `Evacuation alert: ${this.state.evacuationStep}. Notes:${this.state.evacuationMessage}`,
        ),
      )
      this.setState({ submitting: true })
    }
  }

  render() {
    const { onClose } = this.props
    return (
      <div className="dialog-evacuate-site dialog--with-form">
        <div className="dialog__controls">
          <div className="dialog__title">
            <SVGIcons name="evacuate" />
            <h3>Evacuate site</h3>
          </div>
          <Button onClick={onClose} type="close">
            <Icon src={getIcon('closeIcon')} size={20} />
          </Button>
        </div>
        <Title type="h2">Send an evacuation alert</Title>
        <div className="form-group">
          <label htmlFor="prepare">
            <input
              name="evacuate"
              type="radio"
              onChange={e => this.setState({ evacuationStep: e.target.value })}
              value="Prepare to Evacuate"
              checked={this.state.evacuationStep === 'Prepare to Evacuate'}
              id={'evacuate'}
            />
            Prepare to Evacuate
          </label>
          <label htmlFor="evacuate">
            <input
              name="evacuate"
              type="radio"
              onChange={e => this.setState({ evacuationStep: e.target.value })}
              value="Evacuate"
              checked={this.state.evacuationStep === 'Evacuate'}
              id={'evacuate'}
            />
            Evacuate
          </label>
          <label htmlFor="stand-down">
            <input
              name="stand-down"
              type="radio"
              onChange={e => this.setState({ evacuationStep: e.target.value })}
              value="Stand down"
              checked={this.state.evacuationStep === 'Stand down'}
              id={'evacuate'}
            />
            Stand down
          </label>
          <label htmlFor="prepare-invacuate">
            <input
              name="prepare-invacuate"
              type="radio"
              onChange={e => this.setState({ evacuationStep: e.target.value })}
              value="Prepare to invacuate"
              checked={this.state.evacuationStep === 'Prepare to invacuate'}
              id={'evacuate'}
            />
            Prepare to invacuate
          </label>
          <label htmlFor="invacuate">
            <input
              name="invacuate"
              type="radio"
              onChange={e => this.setState({ evacuationStep: e.target.value })}
              value="Invacuate"
              checked={this.state.evacuationStep === 'Invacuate'}
              id={'evacuate'}
            />
            Invacuate
          </label>
        </div>
        <div className="form-group textareaMessage">
          Evacuation notes
          <textarea
            autoFocus /* eslint-disable-line */
            name="message"
            value={this.state.evacuationMessage}
            onChange={e => this.setState({ evacuationMessage: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            onKeyUp={({ key }) =>
              key === 'Enter' && this.state.evacuationMessage && this.submit()
            }
          />
        </div>
        <div className="dialog__button-bar">
          <DashboardButton onClick={onClose} variant="secondary">
            Cancel
          </DashboardButton>
          <DashboardButton
            disabled={!this.state.evacuationMessage}
            onClick={() => this.submit()}
          >
            Send
          </DashboardButton>
        </div>
      </div>
    )
  }
}

export default DialogEvacuateSite

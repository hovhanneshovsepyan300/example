import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Parse from 'parse'

import { closeSlidingView } from '../stores/ReduxStores/dashboard/dashboard'
import { Button, Loading } from './common'
import { IncidentFormField } from '.'
import { INCIDENT_FIELD_TYPES } from '../utils/constants'
import DashboardButton from './DashboardButton'
import utils, { getDaysInMonth, getDaysInYear } from '../utils/helpers'
import { withUserContext } from '../Contexts'
import {
  updateBanIncidentDetails,
  addMessageToIncident,
} from '../stores/ReduxStores/dashboard/incidents'
import Image from './common/Image/Image'
import { USER_PERMISSIONS, BUTTON_ICONS } from '../utils/constants'
import ButtonWithIcon from './common/ButtonWithIcon'
import moment from 'moment'

class BanEditForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    ban: PropTypes.object,
    dataSources: PropTypes.array.isRequired,
    currentUser: PropTypes.instanceOf(Parse.User).isRequired,
  }

  static defaultProps = {
    ban: null,
  }

  constructor(props) {
    super(props)
    const { ban } = props
    this.state = {
      name: this.getValue('name', 'firstName', ban),
      gender: this.getValue('gender', 'gender', ban) || '',
      ethnicOrigin: this.getValue('ethnicity', 'ethnicOrigin', ban) || '',
      age: this.getValue('age', 'age', ban),
      height: this.getValue('height', 'height', ban),
      distinguishFeatures: this.getValue('distinguish_features', 'marks', ban),
      reason: this.getValue('reason', 'otherNotes', ban),
      ticketInformation: this.getValue(
        'ticket_information',
        'ticketInformation',
        ban,
      ),
      street: this.getValue('street', 'street', ban),
      county: this.getValue('county', 'county', ban),
      postcode: this.getValue('postcode', 'postcode', ban),
      town: this.getValue('town', 'town', ban),
      saving: false,
      editing: false,
      ...this.getBanInformation(ban),
    }
  }

  parseBanDuration = text => {
    if (text === '0') {
      return 0
    }

    return parseInt(text, 10) || ''
  }

  getBanInformation = ban => {
    if (!ban) {
      return {}
    }
    const banText = ban.capture_data.banType

    if (!banText) {
      return {}
    }
    const formValue = ban.capture_data
    const banType = ban.capture_data.banType
    const banTerm = ban.capture_data.banTerm
    const banDuration = ban.capture_data.banDuration
    const bannedOn = moment(ban.created_at).format('DD/MM/YY HH:mm')
    const banned_untill = moment()
    const duration = parseInt(banDuration, 10)
    switch (banTerm) {
      case 'hours':
        banned_untill.add(duration, 'hours')
        break
      case 'days':
        banned_untill.add(duration, 'days')
        break
      case 'months':
        banned_untill.add(duration, 'months')
        break
      case 'years':
        banned_untill.add(duration, 'years')
        break
      case 'life':
        banned_untill.add(100, 'years')
        break
      default:
        break
    }
    const bannedUntil = moment(banned_untill).format('DD/MM/YY HH:mm')
    return { banType, banTerm, banDuration, bannedOn, bannedUntil, formValue }
  }

  getDataSourceValues = fieldId => {
    const { dataSources } = this.props

    const dataSource = dataSources.find(({ name }) => name === fieldId)

    return dataSource ? dataSource.values : []
  }

  getFieldValueFromText = (fieldText, formField) => {
    const values = this.getDataSourceValues(formField)

    const value = values.find(({ text }) => text === fieldText)

    if (!value) {
      return fieldText
    }

    return value.value
  }

  getValue = (formField, banField, ban) => {
    if (!ban) {
      return null
    }
    const fieldText = ban.capture_data[banField]

    return this.getFieldValueFromText(fieldText, formField)
  }

  handleBanTypeChange = changeState => {
    const { banType, banDuration, banTerm, bannedOn } = {
      ...this.state,
      ...changeState,
    }
    const bandOnTime = this.props.ban.created_at
    const bannedUntil = utils.calculateBannedUntil(
      bandOnTime,
      banDuration,
      banTerm,
    )
    this.setState({
      banType,
      banDuration: this.parseBanDuration(banDuration),
      banTerm,
      bannedUntil,
      formValue: {
        ...this.state.formValue,
        banType,
        banTerm,
        banDuration,
        bannedUntil,
      },
    })
  }

  submitForm = () => {
    const { ban, dispatch, currentUser } = this.props
    const formValue = this.state.formValue
    this.setState({ saving: true })
    let messageText = `${currentUser.username} has changed the contents of this incident`
    dispatch(addMessageToIncident(ban, messageText, null, () => {}))
    dispatch(
      updateBanIncidentDetails(ban.id, ban.type_value, formValue, currentUser),
    )
  }

  render() {
    const { dispatch, ban, currentUser } = this.props
    const isAdmin = utils.hasPermission(currentUser, [
      USER_PERMISSIONS.CrestAdmin,
      USER_PERMISSIONS.ClientManager,
    ])
    const {
      gender,
      ethnicOrigin,
      banType,
      banTerm,
      age,
      height,
      distinguishFeatures,
      banDuration,
      bannedOn,
      bannedUntil,
      reason,
      ticketInformation,
      town,
      postcode,
      county,
      street,
      name,
      saving,
      formValue,
      editing,
    } = this.state
    let isEdit = isAdmin && editing
    if (!ban) {
      return <Loading />
    }
    return (
      <div className="ban-edit-form">
        <div className="IncidentForm__controls">
          <Button onClick={() => dispatch(closeSlidingView())} type="close">
            <span>&times;</span>
          </Button>
        </div>
        <div className="IncidentForm__header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p
              style={{
                marginRight: '10px',
                fontSize: '30px',
                fontWeight: 'bold',
              }}
            >
              {isEdit ? 'Edit Person of Interest' : 'Person of Interest'}
            </p>
            {isAdmin && !editing && (
              <ButtonWithIcon
                icon={BUTTON_ICONS.EditBan}
                onClick={() => {
                  this.setState({ editing: true })
                }}
              />
            )}
          </div>
          <IncidentFormField
            id="name"
            field_type={INCIDENT_FIELD_TYPES.field}
            handleChange={(fieldId, value) =>
              this.setState({
                name: value,
                formValue: { ...formValue, firstName: value },
              })
            }
            value={name}
            disabled={!isEdit}
            placeholder="name"
          />
        </div>
        {ban.img_file && (
          <div className="ban-list__item__image" style={{ marginLeft: '60px' }}>
            <Image src={window.getFileDefaultUrl() + ban.img_file} alt="" />
          </div>
        )}
        <div className="IncidentForm__content">
          <div>
            <b>Gender</b>
            <IncidentFormField
              dataSource={this.getDataSourceValues('gender')}
              id="gender"
              field_type={INCIDENT_FIELD_TYPES.picker}
              handleChange={(fieldId, value) =>
                this.setState({
                  gender: value,
                  formValue: { ...formValue, gender: value },
                })
              }
              value={gender}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Age</b>
            <IncidentFormField
              id="age"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  age: value,
                  formValue: { ...formValue, age: value },
                })
              }
              value={age}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Height</b>
            <IncidentFormField
              id="height"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  height: value,
                  formValue: { ...formValue, height: value },
                })
              }
              disabled={!isEdit}
              value={height}
            />
          </div>
          <div>
            <b>Ethnicity</b>
            <IncidentFormField
              dataSource={this.getDataSourceValues('ethnicOrigin')}
              id="ethnicOrigin"
              field_type={INCIDENT_FIELD_TYPES.picker}
              handleChange={(fieldId, value) =>
                this.setState({
                  ethnicOrigin: value,
                  formValue: { ...formValue, ethnicOrigin: value },
                })
              }
              value={ethnicOrigin}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Distinguishing features</b>
            <IncidentFormField
              id="distinguishFeatures"
              field_type={INCIDENT_FIELD_TYPES.textview}
              handleChange={(fieldId, text) =>
                this.setState({
                  distinguishFeatures: text,
                  formValue: { ...formValue, marks: text },
                })
              }
              value={distinguishFeatures}
              placeholder="Distinguishing features"
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Ban Type</b>
            <IncidentFormField
              dataSource={this.getDataSourceValues('banType')}
              id="banType"
              field_type={INCIDENT_FIELD_TYPES.picker}
              handleChange={(fieldId, value) =>
                this.handleBanTypeChange({ banType: value })
              }
              value={banType}
              disabled={!isEdit}
            />
            <IncidentFormField
              id="banDuration"
              field_type={INCIDENT_FIELD_TYPES.numberfield}
              handleChange={(fieldId, value) =>
                this.handleBanTypeChange({ banDuration: value })
              }
              value={banDuration ? String(banDuration) : ''}
              disabled={!isEdit}
              placeholder="Banned Duration"
            />
            <IncidentFormField
              dataSource={this.getDataSourceValues('banTerm')}
              id="banTerm"
              field_type={INCIDENT_FIELD_TYPES.picker}
              handleChange={(fieldId, value) =>
                this.handleBanTypeChange({
                  banTerm: value,
                  formValue: { ...formValue, banTerm: value },
                })
              }
              value={banTerm}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Banned On</b>
            <IncidentFormField
              id="bannedOn"
              field_type={INCIDENT_FIELD_TYPES.field}
              value={!bannedOn ? '' : bannedOn}
              placeholder="Banned date"
              disabled
            />
          </div>
          <div>
            <b>Banned Until</b>
            <IncidentFormField
              id="bannedUntil"
              field_type={INCIDENT_FIELD_TYPES.field}
              value={!bannedUntil ? '' : bannedUntil}
              placeholder="Banned Until"
              disabled
            />
          </div>
          <div>
            <b>Reason</b>
            <IncidentFormField
              id="reason"
              field_type={INCIDENT_FIELD_TYPES.textview}
              handleChange={(fieldId, value) =>
                this.setState({
                  reason: value,
                  formValue: { ...formValue, otherNotes: value },
                })
              }
              value={reason}
              placeholder="Reason"
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Ticket Information</b>
            <IncidentFormField
              id="ticketInformation"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  ticketInformation: value,
                  formValue: { ...formValue, ticketInformation: value },
                })
              }
              value={ticketInformation}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Street</b>
            <IncidentFormField
              id="street"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  street: value,
                  formValue: { ...formValue, street: value },
                })
              }
              value={street}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>County</b>
            <IncidentFormField
              id="county"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  county: value,
                  formValue: { ...formValue, county: value },
                })
              }
              value={county}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Postcode</b>
            <IncidentFormField
              id="postcode"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  postcode: value,
                  formValue: { ...formValue, postcode: value },
                })
              }
              value={postcode}
              disabled={!isEdit}
            />
          </div>
          <div>
            <b>Town</b>
            <IncidentFormField
              id="town"
              field_type={INCIDENT_FIELD_TYPES.field}
              handleChange={(fieldId, value) =>
                this.setState({
                  town: value,
                  formValue: { ...formValue, town: value },
                })
              }
              value={town}
              disabled={!isEdit}
            />
          </div>
          {isEdit ? (
            <DashboardButton onClick={() => this.submitForm()} loading={saving}>
              Save
            </DashboardButton>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
}

export default withUserContext(
  connect(state => {
    const banId = state.dashboard.editBanId

    let ban = Object.values(state.incidents?.data).find(
      ({ object_id }) => object_id === banId,
    )

    return {
      ban,
      forms: state.incidentForm.forms,
      incidents: state.incidentForm.incidents,
      fields: state.incidentForm.fields,
      dataSources: state.incidentForm.dataSources,
    }
  })(BanEditForm),
)

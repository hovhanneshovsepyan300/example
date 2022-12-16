import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Icon, Heading, ChatIcon, Loading } from '../common'
import { getIcon } from '../../stores/IconStore'
import DashboardButton from '../DashboardButton'
import { withUserContext } from '../../Contexts'
import utils from '../../utils/helpers'

import {
  loadMessages,
  reloadMessages,
  getIncidentMessagesList,
  getLoading,
} from '../../stores/ReduxStores/dashboard/incidentMessages'
import IncidentMessageListItem from '../IncidentMessageListItem'
import { markIncidentMessageAsRead } from '../../stores/ReduxStores/dashboard/incidents'
import { useIsBottomScrolled, useInterval } from '../../utils/customHooks'

const propTypes = {
  incidentMessagesByDay: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
  ).isRequired,
  messageText: PropTypes.string.isRequired,
  messageFile: PropTypes.instanceOf(Parse.User).isRequired,
  onMessageChange: PropTypes.func.isRequired,
  onMessageFileChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(Parse.User).isRequired,
  incident: PropTypes.instanceOf(Parse.Object).isRequired,
  event: PropTypes.instanceOf(Parse.Object),
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedTableIncident: PropTypes.instanceOf(Parse.Object),
}

const IncidentViewMessages = ({
  messageText,
  messageFile,
  onMessageChange,
  onMessageFileChange,
  onMessageSubmit,
  currentUser,
  incident,
  dispatch,
  loading,
  event,
  incidentMessagesByDay,
  selectedTableIncident,
}) => {
  const [isReminderVisible, containerRef] = useIsBottomScrolled(loading)

  useEffect(() => {
    if (Object.keys(incidentMessagesByDay).length > 0) {
      dispatch(markIncidentMessageAsRead(incident, currentUser))
    }
  }, [dispatch, incident, Object.keys(incidentMessagesByDay).length])

  // const messageCount = incident.incident_messages.length

  // load messages
  useEffect(() => {
    if (Object.keys(incidentMessagesByDay).length === 0)
      dispatch(loadMessages(incident.id))
    return () => {}
  }, [])

  const generateFileName = name => {
    if (name.length < 24) return name

    name = name.split('.')
    let extention = name.pop()
    name = name.join()

    return name.slice(0, 20) + '....' + extention
  }

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => setSubmitting(false), [messageText])

  const sendMessage = () => {
    if (messageText === '' && !messageFile) {
      return
    }
    setSubmitting(true)
    onMessageSubmit()
  }

  const handleFileChange = async file => {
    const maxFileSize = 3000000 //3MB
    if (file.size > maxFileSize) {
      alert(`file must be less then ${maxFileSize / 1000000} MB`)
      return onMessageFileChange(null)
    }

    let supportedExtentions = [
      'pdf',
      'csv',
      'doc',
      'docx',
      'txt',
      'xml',
      'xlsx',
    ]
    let extention = file?.name?.split('.')?.pop()
    if (
      !file.type.startsWith('image') &&
      !supportedExtentions.includes(extention)
    ) {
      alert(`Sorry! You can't upload this .${extention} file`)
      return onMessageFileChange(null)
    }

    return onMessageFileChange(file)
  }

  return (
    <div className="IncidentViewMessages">
      <div className="IncidentViewMessages__messages">
        <div
          className="IncidentViewMessages__messages__container"
          ref={containerRef}
        >
          {loading ? (
            <Loading centered />
          ) : (
            Object.keys(incidentMessagesByDay).map(day => (
              <div
                key={day}
                className="IncidentViewMessages__messages__day-group"
              >
                <span className="IncidentViewMessages__messages__date-container">
                  <hr />
                  <span className="IncidentViewMessages__messages__date">
                    {day}
                  </span>
                </span>
                {incidentMessagesByDay[day].map(incidentMessage => (
                  <IncidentMessageListItem
                    key={incidentMessage.object_id}
                    incidentMessage={incidentMessage}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            ))
          )}
        </div>
        <div
          className={utils.makeClass(
            'IncidentViewMessages__messages__reminder',
            isReminderVisible && 'visible',
          )}
        >
          More updates below
        </div>
      </div>
      <div className="IncidentViewMessages__inputMessage">
        <form
          onSubmit={e => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <div className="IncidentViewMessages__inputMessage__header">
            <Heading text="Add an update to this incident" size="h4" />
          </div>
          <div className="IncidentViewMessages__inputMessage__input">
            <ChatIcon name={currentUser.name} />
            <textarea
              value={messageText}
              onChange={e => {
                onMessageChange(e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              className="IncidentViewMessages__inputMessage__input-textarea"
              disabled={incident.archived}
            />
            <div className="IncidentViewMessages__inputMessage__input-imageInput">
              <label for="imageInput">
                <i>
                  <Icon
                    src={getIcon('plus')}
                    size={30}
                    style={{ cursor: 'pointer' }}
                    backgroundColor="rgba(57, 79, 191, .8)"
                    borderRadius={50}
                  />
                </i>
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*, .pdf, .csv, .doc, .docx, .txt, .xlsx"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e.target.files[0])}
                onClick={e => {
                  e.target.value = null
                }}
              />
            </div>
          </div>

          {(messageFile?.type?.startsWith('application') ||
            messageFile?.type?.startsWith('text')) && (
            <div className="IncidentViewMessages__inputMessage__filePreview">
              <div className="IncidentViewMessages__inputMessage__filePreview__file">
                <div>
                  <i>
                    <Icon src={getIcon('file')} size={30} />
                  </i>
                </div>
                <span>{generateFileName(messageFile.name)}</span>
                <i onClick={() => onMessageFileChange(null)}>
                  <Icon src={getIcon('cross_white')} size={15} />
                </i>
              </div>
            </div>
          )}

          {messageFile?.type?.startsWith('image') && (
            <div className="IncidentViewMessages__inputMessage__filePreview">
              <img src={URL.createObjectURL(messageFile)} alt="image" />
              <i onClick={() => onMessageFileChange(null)}>
                <Icon src={getIcon('cross_white')} size={15} />
              </i>
            </div>
          )}

          <div className="IncidentViewMessages__inputMessage__submit">
            <DashboardButton
              disabled={(!messageText && !messageFile) || submitting}
            >
              Add Update
            </DashboardButton>
          </div>
        </form>
      </div>
    </div>
  )
}

IncidentViewMessages.propTypes = propTypes

IncidentViewMessages.defaultProps = {}

export default compose(
  withUserContext,
  connect((state, props) => ({
    incidentMessagesByDay: getIncidentMessagesList(state, props.incident.id),
    loading: getLoading(state),
    selectedTableIncident: state.incidents.selectedTableIncident,
    event: state.currentEvent.event,
  })),
)(IncidentViewMessages)

import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { compose } from 'redux'
import Parse from 'parse'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  getAllIncidentMessages,
  loadAllMessages,
} from '../stores/ReduxStores/dashboard/incidentMessages'
import PrintPdfIcon from './../images/print_pdf_icon.svg'

import {
  markIncidentAsReadAction,
  unresolveIncidentAction,
  reopenIncidentAction,
  addMessageToIncident,
  updateIncidentTable,
} from '../stores/ReduxStores/dashboard/incidents'
import { setResolveVariation } from '../stores//ReduxStores/dialog'
import { loadMessages } from '../stores/ReduxStores/dashboard/incidentMessages'
import {
  closeSlidingView,
  openDialog,
  updateIncidentForm,
} from '../stores/ReduxStores/dashboard/dashboard'
import iconWarningYellow from '../images/icon-warning-yellow.svg'
import iconEditYellow from '../images/icons/icon-edit-yellow.svg'
import undo from '../images/icons/undo.svg'

import utils from '../utils/helpers'
import {
  DIALOG_TYPE,
  USER_PERMISSIONS,
  INCIDENT_STATUS_FOR_USER as STATUS_FOR_USER,
  BG_COLORS_INCIDENT_STATUS_FOR_USER as BG_COLORS,
  BUTTON_ICONS,
} from '../utils/constants'
import { withUserContext } from '../Contexts'

import { Loading, Button } from './common'
import Title from './common/Title/Title'
import IncidentTypeName from './IncidentTypeName'
import ClickableDiv from './ClickableDiv'
import DashboardButton from './DashboardButton'
import { IncidentViewReport, IncidentViewMessages } from '.'
import IncidentViewed from './IncidentViewed/IncidentViewed'
import ButtonWithIcon from './common/ButtonWithIcon'

const propTypes = {
  incident: PropTypes.instanceOf(Parse.Object),
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(Parse.User).isRequired,
  loading: PropTypes.bool.isRequired,
  staff: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
  event: PropTypes.instanceOf(Parse.Object),
  allowClosedIncident: PropTypes.bool, //eslint-disable-line
  isAnalyticsPage: PropTypes.bool,
  selectedTableIncident: PropTypes.instanceOf(Parse.Object),
  resolveVariation: PropTypes.string,
}

const TABS = {
  Report: 'Incident Report',
  Updates: 'Updates',
  Viewed: 'Viewed',
}

const IncidentView = ({
  event,
  incident,
  dispatch,
  currentUser,
  loading,
  staff,
  isAnalyticsPage,
  selectedTableIncident,
  resolveVariation,
}) => {
  const [openTab, setOpenTab] = useState('Report')
  const [messageText, setMessageText] = useState('')
  const [messageFile, setMessageFile] = useState(null)
  const [unresolveSubmitting, setUnresolveSubmitting] = useState(false)
  const [incidentId, setIncidentId] = useState(null)
  const [printPDFMode, setPrintPDFMode] = useState(false)

  const incidents = useSelector(state => state.incidents)
  const incidentMessages = useSelector(state => state.incidentMessages)

  const hasChanged = incident && incident.id

  const messageAddCallback = () => {
    setMessageText('')
    setMessageFile(null)
    // dispatch(loadMessages(incident.object_id))
  }

  const handleOpenResolveIncidentDialog = useCallback(
    (resolveVariation = 'resolve') => () => {
      dispatch(setResolveVariation(resolveVariation))

      dispatch(
        openDialog(DIALOG_TYPE.ResolveIncident, {
          incident,
        }),
      )
    },
    [dispatch, openDialog, incident],
  )

  const handleIncidentPrintPDF = () => {
    setPrintPDFMode(true)

    dispatch(loadAllMessages())
  }

  useEffect(() => {
    if (
      incidents.selectedTableIncident &&
      incidentMessages.status === 'loaded' &&
      printPDFMode
    ) {
      document.title = `Halo - Incident ${incidents.selectedTableIncident.urn ||
        incidents.selectedTableIncident.incident_code}.pdf`

      window.print()
    }
  }, [incidents.selectedTableIncident, incidentMessages.status, printPDFMode])

  // when the incident changes, mark it as read
  useEffect(() => {
    if (incident) {
      setIncidentId(incident.id)
      dispatch(markIncidentAsReadAction(incident, currentUser))
    }
  }, [dispatch, currentUser, incident, incidentId])

  useEffect(() => {
    if (selectedTableIncident?.userStatus === STATUS_FOR_USER.NotViewed) {
      dispatch(
        updateIncidentTable({
          id: selectedTableIncident.id,
          updatedFields: {
            userStatus: STATUS_FOR_USER.Default,
            rowBgColor: BG_COLORS.Color_Default,
          },
        }),
      )
    }
  }, [dispatch, selectedTableIncident])

  useEffect(() => {
    setOpenTab('Report')
  }, [hasChanged])

  useEffect(() => {
    setMessageText('')
  }, [incidentId])

  const incidentIsResolved = incident && incident.resolved

  // when the reolved status change, reset the flag
  useEffect(() => setUnresolveSubmitting(false), [incidentIsResolved])

  useEffect(() => {
    window.onafterprint = function() {
      document.title = 'HALO - Event - Management'
      setPrintPDFMode(false)
    }
  }, [printPDFMode])

  useEffect(() => {
    window.onbeforeunload = () => {
      document.title = 'HALO - Event - Management'
    }
    return () => {
      document.title = 'HALO - Event - Management'
    }
  }, [])

  const isShared = utils.isSharedToUser(currentUser, incident)

  const isAuthorized =
    incident?.reported_by?.object_id === currentUser.object_id ||
    currentUser.permission_role === 'ClientManager' ||
    currentUser.permission_role === 'CrestAdmin' ||
    currentUser.isSuperUser

  return (
    <section className="incident-view">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="incident-view__header">
            <Title type="h3">
              <IncidentTypeName>{incident}</IncidentTypeName> -{' '}
              {incident.incident_code}
            </Title>
            {isAuthorized && (
              <div className="incident-view__header__edit-icon">
                <ButtonWithIcon
                  icon={BUTTON_ICONS.EditBan}
                  onClick={() => {
                    dispatch(
                      updateIncidentForm(incident.id, incident.type_value),
                    )
                  }}
                />
              </div>
            )}
            <button
              className="incident-view__print_pdf_btn"
              onClick={handleIncidentPrintPDF}
            >
              <img src={PrintPdfIcon} alt="Print pdf" />
            </button>
            <div className="incident-view__header__opened-at">
              Incident opened: {moment(incident.created_at).format('HH:mm')}
            </div>

            <Button onClick={() => dispatch(closeSlidingView())} type="close">
              <span>&times;</span>
            </Button>
          </div>
          <div className="incident-view__actions">
            <div className="incident-view__tabs">
              {Object.keys(TABS).map(tab => (
                <ClickableDiv key={tab} onClick={() => setOpenTab(tab)}>
                  <div
                    className={utils.makeClass(
                      'incident-view__tab',
                      openTab === tab && 'active',
                    )}
                  >
                    {TABS[tab]}
                  </div>
                </ClickableDiv>
              ))}
            </div>

            <div className="incident-view__buttons">
              {!incident.resolved && !incident.archived && (
                <div className="incident-view__resolve_btn_container">
                  <DashboardButton onClick={handleOpenResolveIncidentDialog()}>
                    Resolve
                  </DashboardButton>
                  <DashboardButton
                    onClick={handleOpenResolveIncidentDialog(
                      'resolve_and_close',
                    )}
                  >
                    Resolve And Close
                  </DashboardButton>
                </div>
              )}
              {incident.resolved &&
                !incident.archived &&
                resolveVariation === 'resolve' && (
                  <>
                    <DashboardButton
                      disabled={unresolveSubmitting}
                      onClick={() => {
                        setUnresolveSubmitting(true)
                        dispatch(unresolveIncidentAction(incident))
                      }}
                    >
                      Unresolve
                    </DashboardButton>
                    <DashboardButton
                      onClick={() =>
                        dispatch(
                          openDialog(DIALOG_TYPE.ArchiveIncident, {
                            incident,
                            isAnalyticsPage,
                          }),
                        )
                      }
                    >
                      Close
                    </DashboardButton>
                  </>
                )}
              {incident.archived && (
                <>
                  <DashboardButton
                    disabled={unresolveSubmitting}
                    onClick={() => {
                      setUnresolveSubmitting(true)
                      dispatch(reopenIncidentAction(incident))
                    }}
                  >
                    Reopen
                  </DashboardButton>
                </>
              )}
            </div>
          </div>
          <div className="incident-view__content">
            {openTab === 'Report' && <IncidentViewReport incident={incident} />}
            {openTab === 'Updates' && (
              <IncidentViewMessages
                incident={incident}
                messages={incident.incident_messages}
                messageText={messageText}
                messageFile={messageFile}
                onMessageChange={text => setMessageText(text)}
                onMessageFileChange={file => setMessageFile(file)}
                onMessageSubmit={() =>
                  dispatch(
                    addMessageToIncident(
                      incident,
                      messageText,
                      messageFile,
                      () => messageAddCallback(),
                    ),
                  )
                }
              />
            )}
            {openTab === 'Viewed' && (
              <IncidentViewed incident={incident} event={event} staff={staff} />
            )}
          </div>
        </>
      )}
      {utils.hasPermission(currentUser, [
        USER_PERMISSIONS.CrestAdmin,
        USER_PERMISSIONS.ClientManager,
        USER_PERMISSIONS.EventManager,
        USER_PERMISSIONS.TargetedDashboardUser,
      ]) &&
        openTab !== 'Updates' && (
          <button
            className={utils.makeClass(
              'incident-view__share-button',
              incident && 'visible',
              isShared && 'edit-access',
            )}
            onClick={() =>
              dispatch(
                openDialog(DIALOG_TYPE.ShareIncident, {
                  incidentId: incident.id,
                }),
              )
            }
          >
            <div>
              <img src={isShared ? iconEditYellow : iconWarningYellow} alt="" />
              <span>{isShared ? 'Edit Access' : 'Share Incident'}</span>
            </div>
          </button>
        )}
    </section>
  )
}

IncidentView.propTypes = propTypes

IncidentView.defaultProps = {
  incident: null,
  event: null,
  allowClosedIncident: true,
  isAnalyticsPage: false,
  resolveVariation: 'resolve',
}

export default compose(
  withUserContext,
  withRouter,
  connect((state, ownProps) => {
    const incidentId = state.dashboard.openedIncidentId

    let incident = state.incidents.data[incidentId]

    let selectedTableIncident = state.incidents.selectedTableIncident

    if (!incident && ownProps.allowClosedIncident) {
      incident = state.incidents.closedIncidentList.filter(
        incident => incident.id === incidentId,
      )[0]
    }

    let staff = state.staff.data
    staff = Object.values(staff)

    const { event } = state.currentEvent

    const resolveVariation = state.dialog.resolveVariation

    return {
      event,
      incident,
      loading: !incident,
      staff,
      selectedTableIncident,
      isAnalyticsPage: ownProps.location.pathname
        .split('/')
        .includes('analytics'),
      resolveVariation,
    }
  }),
)(IncidentView)

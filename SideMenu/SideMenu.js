import React, { useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link } from 'react-router-dom'

import DialogCustomerSupport from '../Dialog/DialogCustomerSupport'

import { logout } from '../../stores/ReduxStores/auth'
import utils from '../../utils/helpers'
import { USER_PERMISSIONS } from '../../utils/constants'
import { withUserContext } from '../../Contexts'
import SiteVersion from '../SiteVersion'
import { closeSlidingView } from '../../stores/ReduxStores/dashboard/dashboard'
import {
  COGNITO_AUTH_SERVER,
  COGNITO_AUTH_REDIRECT_URL,
  COGNITO_CLIENT_ID,
} from '../../settings'
import { Icon } from '../common'
import { getIcon } from '../../stores/IconStore'
import HaloLogo from '../HaloLogo'

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string }).isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(Parse.User).isRequired,
  event: PropTypes.instanceOf(Parse.Object),
  history: PropTypes.object.isRequired,
}

const defaultProps = {
  event: {},
}

const SideMenu2 = ({ history, dispatch, match, currentUser, event }) => {
  const eventId = match.params.id

  const hasAccessToReportAndDebrief = utils.hasPermission(currentUser, [
    USER_PERMISSIONS.CrestAdmin,
    USER_PERMISSIONS.ClientManager,
    USER_PERMISSIONS.TargetedDashboardUser,
  ])

  const [open, setOpen] = useState(false)
  const [dialogCustomerSupportOpen, setDialogCustomerSupprtOpen] = useState(
    false,
  )

  const handleClickCustomerSupport = () => {
    setDialogCustomerSupprtOpen(true)
  }

  const handleCloseDialogCustomerSupport = e => {
    const targetElement = e.target
    if (targetElement.id === 'backdrop') {
      setDialogCustomerSupprtOpen(false)
    }
  }

  const handleKeyDownForDialog = e => {
    const targetKey = e.key

    if (targetKey === 'Escape') {
      setDialogCustomerSupprtOpen(false)
    }
  }

  return (
    <div>
      <div className={`SideMenu ${open ? 'SideMenu--open' : ''}`}>
        <div
          onClick={() => setOpen(!open)}
          aria-hidden="true"
          className="SideMenu__logo-container"
        >
          {open && (
            <Icon
              src={getIcon('hamburger')}
              size={40}
              style={{
                alignSelf: 'flex-end',
                cursor: ' pointer',
              }}
            />
          )}
          <HaloLogo className="SideMenu__logo" />
        </div>
        <div className="SideMenu__list">
          <ul>
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}`}
                className={
                  history.location.pathname === `/dashboard/${eventId}`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('dashboard')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Dashboard</p>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/map`}
                className={
                  history.location.pathname === `/dashboard/${eventId}/map`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('mapIcon')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Map</p>
              </Link>
            </li>
            {event && utils.hasHaloChecks(event.client) && (
              <li>
                <Link
                  onClick={() => {
                    dispatch(closeSlidingView())
                    setOpen(false)
                  }}
                  to={`/dashboard/${eventId}/venue-checks`}
                  className={
                    history.location.pathname ===
                    `/dashboard/${eventId}/venue-checks`
                      ? 'active'
                      : ''
                  }
                >
                  <div className="SideMenu__icon">
                    <Icon
                      src={getIcon('taskList')}
                      size={20}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <p>Tasks</p>
                </Link>
              </li>
            )}
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/bans`}
                className={
                  history.location.pathname === `/dashboard/${eventId}/bans`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('documentLibrary')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Bulletin Board</p>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/document-library`}
                className={
                  history.location.pathname ===
                  `/dashboard/${eventId}/document-library`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('docLibrary')}
                    size={24}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Document Library</p>
              </Link>
            </li>

            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/crowd-management`}
                className={
                  history.location.pathname ===
                  `/dashboard/${eventId}/crowd-management`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('crowdManagementIcon')}
                    size={24}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Crowd Management</p>
              </Link>
            </li>

            {hasAccessToReportAndDebrief && (
              <>
                <li>
                  <Link
                    onClick={() => {
                      dispatch(closeSlidingView())
                      setOpen(false)
                    }}
                    to={`/dashboard/${eventId}/report`}
                    className={
                      history.location.pathname ===
                      `/dashboard/${eventId}/resport`
                        ? 'active'
                        : ''
                    }
                  >
                    <div className="SideMenu__icon">
                      <Icon
                        src={getIcon('reports')}
                        size={20}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p>Report</p>
                  </Link>
                </li>
                {utils.hasTicketScanning(currentUser) && (
                  <li>
                    <Link
                      onClick={() => {
                        dispatch(closeSlidingView())
                        setOpen(false)
                      }}
                      to={`/dashboard/${eventId}/ticket-scanning-report`}
                      className={
                        history.location.pathname ===
                        `/dashboard/${eventId}/ticket-scanning-report`
                          ? 'active'
                          : ''
                      }
                    >
                      <div className="SideMenu__icon">
                        <Icon
                          src={getIcon('scanner')}
                          size={20}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <p>Ticket Scanning Report</p>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    onClick={() => {
                      dispatch(closeSlidingView())
                      setOpen(false)
                    }}
                    to={`/dashboard/${eventId}/debrief`}
                    className={
                      history.location.pathname ===
                      `/dashboard/${eventId}/debrief`
                        ? 'active'
                        : ''
                    }
                  >
                    <div className="SideMenu__icon">
                      <Icon
                        src={getIcon('debrief')}
                        size={20}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p>Debrief</p>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/analytics`}
                className={
                  history.location.pathname ===
                  `/dashboard/${eventId}/analytics`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('analytics')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Analytics</p>
              </Link>
            </li>

            {/* <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to={`/dashboard/${eventId}/accreditation`}
                className={
                  history.location.pathname ===
                  `/dashboard/${eventId}/accreditation`
                    ? 'active'
                    : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('accreditation')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Accreditation</p>
              </Link>
            </li> */}

            <div className="SideMenu__divider" />
            <li>
              <Link
                onClick={() => {
                  dispatch(closeSlidingView())
                  setOpen(false)
                }}
                to="/EventList"
                className={
                  history.location.pathname === `/EventList` ? 'active' : ''
                }
              >
                <div className="SideMenu__icon">
                  <Icon
                    src={getIcon('eventChange')}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p>Change Event</p>
              </Link>
            </li>
            <li>
              <div className="CustSupport">
                <div
                  className="SideMenu__icon"
                  onClick={handleClickCustomerSupport}
                  aria-hidden="true"
                >
                  <Icon
                    src={getIcon('support')}
                    size={22}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <button onClick={handleClickCustomerSupport}>
                  Customer Support
                </button>
              </div>
            </li>
            {/* <SiteVersion /> */}
          </ul>
        </div>
        <div
          className="SideMenu__logoutBtn"
          onClick={() => {
            history.push(
              `${COGNITO_AUTH_SERVER.env}/logout?client_id=${COGNITO_CLIENT_ID.env}&redirect_uri=${COGNITO_AUTH_REDIRECT_URL.env}&response_type=code`,
            )
            window.location.href = `${COGNITO_AUTH_SERVER.env}/logout?client_id=${COGNITO_CLIENT_ID.env}&redirect_uri=${COGNITO_AUTH_REDIRECT_URL.env}&response_type=code`

            dispatch(logout())
          }}
          aria-hidden="true"
        >
          <div className="SideMenu__logoutIcon">
            <Icon
              src={getIcon('logoutIcon')}
              size={20}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <button>Log Out</button>
        </div>
      </div>
      {dialogCustomerSupportOpen ? (
        <DialogCustomerSupport
          open={dialogCustomerSupportOpen}
          onClose={handleCloseDialogCustomerSupport}
          onKeyDown={handleKeyDownForDialog}
        />
      ) : null}
    </div>
  )
}

SideMenu2.propTypes = propTypes

SideMenu2.defaultProps = defaultProps

export default compose(
  withUserContext,
  connect(state => ({
    event: state.currentEvent.event,
  })),
)(SideMenu2)

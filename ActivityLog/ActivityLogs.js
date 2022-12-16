import React, { Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'

import utils from '../../utils/helpers'
import dashboardUtils from '../../utils/dashboardFilterHelpers'
import {
  loadClosedIncidents,
  setSelectedIncidentTable,
} from '../../stores/ReduxStores/dashboard/incidents'
import {
  loadLogsOffset,
  pollLogs,
} from '../../stores/ReduxStores/dashboard/logs'
import { openIncidentView } from '../../stores/ReduxStores/dashboard/dashboard'
import { TITLE_TYPES, USER_PERMISSIONS } from '../../utils/constants'

import { Icon, Loading } from '../common'
import Title from '../common/Title/Title'
import ActivityLogGroup from './ActivityLogGroup'
import DashboardSelect from '../DashboardSelect'
import DashboardButton from '../DashboardButton'
import DialogAddActivityLog from '../Dialog/DialogAddActivityLog'
import ActivityLogMessage from './ActivityLogMessage'

import { getIcon } from '../../stores/IconStore'

class ActivityLogs extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logs: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
    logTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired,
    nextPage: PropTypes.number,
    incidents: PropTypes.array,
  }

  static defaultProps = {
    nextPage: null,
    incidents: null,
  }

  constructor() {
    super()
    this.state = {
      filterValue: 'all',
      intervalId: null,
      isLogBoxVisible: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.formatLogs = this.formatLogs.bind(this)
    this.openIncidentDialog = this.openIncidentDialog.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(loadLogsOffset(1))
    this.props.dispatch(loadClosedIncidents())
    //const intervalId = setInterval(this.fetchLogs, 5000)
    //this.setState({ intervalId })
    this.fetchLogs() 
  }

  componentWillUnmount() {
    //clearInterval(this.state.intervalId)
  }

  fetchLogs = () => {
    this.props.dispatch(pollLogs())
  }

  getFilteredLogs(logs) {
    const { filterValue } = this.state
    const filteredLogs = {}

    if (!logs || !logs.length) return {}

    logs
      .filter(log => {
        let filterCondition =
          filterValue === 'all' ? true : filterValue === log.log_type

        if (filterValue === 'today') {
          const today = new Date()
          const logDate = new Date(log.created_at)

          filterCondition =
            today.getFullYear() === logDate.getFullYear() &&
            today.getMonth() + 1 === logDate.getMonth() + 1 &&
            today.getDate() === logDate.getDate()
        }

        return filterCondition
      })
      .forEach(log => {
        const day = moment(log.created_at)
          .startOf('day')
          .format()

        if (!filteredLogs[day]) filteredLogs[day] = []
        filteredLogs[day].push(log)
      })

    return filteredLogs
  }

  handleFilterChange(filterValue) {
    this.setState({ filterValue })
  }

  loadMore = () => {
    const { dispatch } = this.props
    dispatch(loadLogsOffset(this.props.nextPage))
  }

  formatLogs = logs => {
    return logs.map(log => {
      const currentLogMessage = log.log_message
      const splitedLogMessage = currentLogMessage.split('incident')
      const targetLogMessage = splitedLogMessage[1] ? (
        <ActivityLogMessage
          logText={`${splitedLogMessage[0]} incident`}
          incidentCode={splitedLogMessage[1]}
          onClick={this.openIncidentDialog}
        />
      ) : (
        log.log_message
      )
      return {
        ...log,
        log_message: targetLogMessage,
      }
    })
  }

  openIncidentDialog = incidentCode => () => {
    const getCurrentIncident = new Promise(resolve => {
      const currentIncident = this.props.incidents.find(
        incident => incident.incident_code === incidentCode,
      )
      resolve(currentIncident)
    })

    getCurrentIncident.then(currentIncident => {
      this.props.dispatch(openIncidentView(currentIncident.id))
      this.props.dispatch(setSelectedIncidentTable(currentIncident))
    })
  }

  toggleAddLogBox = () => {
    this.setState({
      isLogBoxVisible: !this.state.isLogBoxVisible,
    })
  }

  render() {
    const { logs, logTypes, loading } = this.props
    const filteredLogs = this.getFilteredLogs(this.formatLogs(logs))

    const selectedFilter = logTypes.filter(
      type => type === this.state.filterValue,
    )[0]
    const filterValueIsAll = this.state.filterValue === 'all'

    return (
      <div className="activity-logs">
        {loading ? (
          <Loading centered />
        ) : (
          <>
            {logTypes.length > 0 && (
              <div className="activity-logs__header">
                <Title type={TITLE_TYPES.h3}>Activity Log</Title>
                {/* <ButtonWithIcon
                  icon={BUTTON_ICONS.Add}
                  wide
                  onClick={() =>
                    this.props.dispatch(
                      openDialog(DIALOG_TYPE.AddActivityLog, {}),
                    )
                  }
                  title="Add Entry"
                /> */}
                <div className="activity-logs__btn">
                  {/* <DashboardSelect
                    options={logTypes.map(type => ({
                      value: type,
                      label: utils.makeReadable(type),
                    }))}
                    onChange={({ value }) => {
                      this.handleFilterChange(value)
                    }}
                    value={
                      filterValueIsAll
                        ? { value: 'all', label: 'Filter by:' }
                        : {
                            value: selectedFilter,
                            label: utils.makeReadable(selectedFilter),
                          }
                    }
                  /> */}
                  <button
                    onClick={this.toggleAddLogBox}
                    className="activity-logs__send-button"
                  >
                    <Icon src={getIcon('send')} size={18} />
                    <div className="activity-logs__button-text">
                      Add activity details
                    </div>
                  </button>
                </div>
              </div>
            )}
            {this.state.isLogBoxVisible && (
              <DialogAddActivityLog {...this.props} />
            )}
            <div className="activity-logs__body">
              <table>
                <tr className="activity-logs__head">
                  <th>Date & Time</th>
                  <th>User</th>
                  {/* <th>Type</th> */}
                  <th>Activity</th>
                </tr>
                {Object.keys(filteredLogs).map(key => (
                  <ActivityLogGroup
                    key={key.toString()}
                    header={moment(key)}
                    logs={filteredLogs[key]}
                  />
                ))}
              </table>

              <DashboardButton
                onClick={this.loadMore}
                // variant={VARIANT.Primary}
                // loading={loadingMore}
              >
                Load more
              </DashboardButton>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default connect(state => {
  const {
    auth: { currentUser },
  } = state

  const { geofenceIdFilter, groupIdFilter } = state.dashboard

  const geofences = state.eventGeofences.list

  const geofence = utils.getDataById(geofences, geofenceIdFilter)

  const staffGroups = state.staffGroups.list

  const staffGroup = staffGroups.find(
    ({ object_id }) => object_id === groupIdFilter,
  )

  const { allLogsLoaded, loadingMore } = state.logs

  const logsArr = Object.values(state.logs.data)
  const nextPage = state.logs.nextPage
  const count = state.logs.count

  const logs =
    geofence || staffGroup
      ? utils.sort(
          logsArr.filter(
            dashboardUtils.filterLogsByGeofenceOrUserGroup(
              geofence,
              staffGroup,
            ),
          ),
          log => log.created_at,
          'desc',
        )
      : currentUser.permission_role === USER_PERMISSIONS.TargetedDashboardUser
      ? dashboardUtils.filterLogsByUserGroups(staffGroups, logsArr)
      : utils.sort(logsArr, log => log.created_at, 'desc')

  const logTypes = ['all', 'today']

  logs.forEach(log => {
    const logType = log.log_type
    if (!logTypes.includes(logType)) logTypes.push(logType)
  })

  return {
    logs,
    logTypes,
    loading: state.logs.status === 'loading',
    allLogsLoaded,
    loadingMore,
    nextPage,
    pollingPage: state.logs.pollingPage,
    count,
    incidents: Object.values(state.incidents.data),
  }
})(ActivityLogs)

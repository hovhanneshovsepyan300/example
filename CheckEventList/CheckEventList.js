import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { loadStaff } from '../../stores/ReduxStores/dashboard/staff'

const CheckTitle = props => (
  <div className="incidentTitle">{props.children}</div>
)

CheckTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

const CheckItem = props => (
  <div className="incidentItem" style={{ fontSize: "17px" }}>{props.children}</div>
)

CheckItem.propTypes = {
  children: PropTypes.node.isRequired,
}

const propTypes = {
  incidentMessageLoading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const CheckEvent = ({
  eventChecks,
  staff,
  dispatch
}) => {
  useEffect(() => {
    dispatch(loadStaff())
  }, [dispatch])

  const keys = Object.keys(eventChecks);
  const completedByUser = staff[eventChecks.completed_by]
  const location = eventChecks.completed_location
    ? {
      latitude: eventChecks.completed_location.coordinates[0],
      longitude: eventChecks.completed_location.coordinates[1],
    }
    : null

  return (
    <div>
      {
        keys.map(item => {
          const eventItem = eventChecks[item]
          return (
            <div className="incidentContainer">
              <CheckTitle>
                <span className="incidentHeader">
                  <span style={{ color: '#20315F' }}>
                    {eventItem.admin_check.title}
                  </span> |{' '}
                  <span style={{ color: eventItem.status === "late" ? "red" : "green" }}>
                    {eventItem.status}
                  </span> |<span style={{ color: "#525257" }}>{' Created'} {moment(eventItem.created_at)
                    .format('DD/MM/YYYY HH:mm')
                    .toLocaleString('en-GB')}</span>

                </span>
              </CheckTitle>
              <div className="incidentItems" style={{ marginLeft: "10px", marginBottom: "16px" }} >
                <span style={{ fontSize: "15px", color: "#20315F" }}>
                  <b>Type </b>{'  '}{eventItem.admin_check.event_type}{' | '}<b>Data</b>{'  '}{moment.utc(eventItem.occurs_at).format('DD/MM/YYYY')}{'  '}<b>Time</b>{moment.utc(eventItem.occurs_at).format('HH:mm')}{' | '}{'  '}<b>Recurring</b>{'  '}
                  {10}
                </span>
              </div>
              <div style={{ marginLeft: "10px", marginBottom: "16px" }}>
                <span style={{ fontSize: "15px", color: "#20315F" }}>
                  <b>Assignee </b>{' | '}
                  {eventItem.admin_check.event_type}{'  '}
                  <b>Location </b>{' | '}
                  {
                    location ? `(${location.lat})(${location.lng}) SMT AR` : "No Location"
                  }
                </span>
              </div>
              {eventItem.status === "complete" ?
                < div className="incidentItems">
                  <CheckItem>
                    <span>
                      <b>Completed at </b>{' | '}
                      {eventItem.completed_at
                        ? moment(eventItem.completed_at).format('DD/MM/YYYY')
                        : 'No date'}
                    </span>
                  </CheckItem>
                  <CheckItem>
                    <span>
                      <b>Completed by </b>{' | '}
                      {!completedByUser ? "Unknow" : completedByUser}
                    </span>
                  </CheckItem>
                </div> : <></>}
              <div className="incidentItems" >
                <CheckItem>
                  <span>
                    <b>Task details </b>{' | '}
                    {eventItem.admin_check.description}
                  </span>
                </CheckItem>
              </div>
              <div style={{ margin: "1%", fontSize: "17px", color: "#20315F", fontWeight: 700 }}>
                <p>Comments</p>
              </div>
              <div className="incidentItems">
                <CheckItem>
                  <span>
                    {!eventItem.completed_comment ? "No data" : eventItem.completed_comment}
                  </span>
                </CheckItem>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

CheckEvent.propTypes = propTypes

CheckEvent.defaultProps = {}

export default connect(state => ({
  staff: state.staff.data,
}))(CheckEvent)

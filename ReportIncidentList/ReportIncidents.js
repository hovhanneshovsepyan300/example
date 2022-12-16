import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'
import { compose } from 'redux'
import moment from 'moment'
import utils from '../../utils/helpers'
import Loading from '../common/Loading/Loading'
import Image from '../common/Image/Image'
import IncidentTypeName from '../IncidentTypeName'

import { withUserContext } from '../../Contexts'

import { IncidentOrders } from '../../utils/incidentOrders'
import {
  getAllIncidentMessages,
  loadAllMessages,
} from '../../stores/ReduxStores/dashboard/incidentMessages'

const IncidentTitle = props => (
  <div className="incidentTitle" style={{ color: "#20315F" }}>{props.children}</div>
)

IncidentTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

const IncidentItem = props => (
  <div className="incidentItem" style={{ fontSize: "17px" }}>{props.children}</div>
)

IncidentItem.propTypes = {
  children: PropTypes.node.isRequired,
}

const propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
  formFieldValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.instanceOf(Parse.Object).isRequired,
  allIncidentMessages: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
  ).isRequired,
  incidentMessageLoading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const ReportIncidents = ({
  incidents,
  formFieldValues,
  currentUser,
  allIncidentMessages,
  dispatch,
}) => {
  useEffect(() => {
    dispatch(loadAllMessages())
    return () => { }
  }, [dispatch])

  return (
    <div>
      {incidents.map(incident => {
        let locationData = null

        const captureData = incident.capture_data
        const location = incident.location

        if (captureData.location) {
          locationData = captureData.location
        } else if (location) {
          locationData = location
        }

        if (!locationData) {
          locationData = {}
        }
        return (
          <div className="incidentContainer">
            <IncidentTitle>
              <span className="incidentHeader">
                <IncidentTypeName>{incident}</IncidentTypeName> |{' '}
                <span style={{ fontWeight: "normal" }}>{incident.incident_code} </span>|{' '}
                <span style={{ fontWeight: "normal" }}>{moment(incident.created_at)
                  .format('DD/MM/YYYY • HH:mm')
                  .toLocaleString('en-GB')}</span>
              </span>
            </IncidentTitle>
            <div className="incidentItems">
              <IncidentItem>
                <span>
                  <b>Created by</b> {' | '}
                  {incident.reported_by.name}
                </span>
              </IncidentItem>
              <IncidentItem>
                <span>
                  <b>Resolved at</b>{' | '}
                  {!incident.resolved_date
                    ? 'not resolved'
                    : moment(incident.resolved_date)
                      .format('DD/MM/YYYY HH:mm')
                      .toLocaleString('en-GB')}
                </span>
              </IncidentItem>
              <IncidentItem>
                <span>
                  <b>Resolved note</b>{' | '}
                  {!incident.resolved_text
                    ? 'not resolved'
                    : incident.resolved_text}
                </span>
              </IncidentItem>
            </div>
            <div className="incidentItems">
              <IncidentItem>
                <span>
                  <b>Closed by</b>{' | '}
                  {!incident.archived_by
                    ? 'not closed'
                    : incident.archived_by.name}
                </span>
              </IncidentItem>
              <IncidentItem>
                <span>
                  <b>Closed by</b>{' | '}
                  {!incident.archived_text
                    ? 'not closed'
                    : incident.archived_text}
                </span>
              </IncidentItem>
            </div>
            <IncidentItem>
              <span>
                <b>Location</b>{' | '}
                {`(${locationData.longitude.toFixed(
                  6,
                )}), (${locationData.latitude.toFixed(6)}) • STM • AR`}
              </span>
            </IncidentItem>
            <div className="incidentItems">
              <IncidentItem>
                <span>
                  <b>Data</b>{' '}
                  {(IncidentOrders[incident.type_value.toLowerCase()]
                    ? IncidentOrders[incident.type_value.toLowerCase()]
                    : Object.keys(captureData || {})
                  )
                    .filter(key => captureData[key] !== 'Null')
                    .map((key, ind, arr) => {
                      const value = utils.getFieldValue(
                        formFieldValues,
                        captureData[key],
                      )
                      if (typeof value === 'string') {
                        return (
                          <span key={key}>
                            <span>{utils.makeReadable(key)}:</span> {value}{' '}
                            {arr.length - 1 > ind ? ' ' : ''}
                          </span>
                        )
                      }
                      return null
                    })}
                </span>
              </IncidentItem>
            </div>
            <div style={{ margin: "1%", fontSize: "17px", color: "#20315F", fontWeight: 700 }}>
              <p>Messages</p>
            </div>
            <div className="incidentItems row" style={{ margin: 0 }}>
              {
                allIncidentMessages[incident.id].length === 0 ?
                  <IncidentItem>
                    <span>No Message</span>
                  </IncidentItem>
                  :
                  allIncidentMessages[incident.id].map(message =>
                  (<div className="col-lg-4" style={{ textAlign: "right" }}>
                    <IncidentItem >
                      <p style={{ fontSize: "15px" }}>{message.message}</p>
                      <p style={{ color: "#B9B3B3", fontSize: "12px" }}>{new Date(message.created_at).toLocaleString(
                        'en-GB',
                      )}</p>
                    </IncidentItem>
                  </div>
                  )
                  )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

ReportIncidents.propTypes = propTypes

ReportIncidents.defaultProps = {}

export default compose(
  withUserContext,
  connect(state => {
    const allDataSource = state.incidentForm.dataSources
      .filter(({ type }) => type === 'data')
      .map(({ values }) => values)

    return {
      allIncidentMessages: getAllIncidentMessages(state),
      incidentMessageLoading: state.incidentMessages.status === 'loading',
      formFieldValues: utils.flattenArray(allDataSource),
    }
  }),
)(ReportIncidents)

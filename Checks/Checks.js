import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../common'

import ChecksListItem from './ChecksListItem'

import { TITLE_TYPES } from '../../utils/constants'
import { CHECK_TYPE_FILTERS } from '../../utils/constants'

import Title from '../common/Title/Title'

import DashboardSelect from '../DashboardSelect'
import {
  loadChecks,
  clearChecks,
} from '../../stores/ReduxStores/dashboard/eventChecks'

const Checks = () => {
  const dispatch = useDispatch()
  const checks = useSelector(state => state.eventChecks.data)
  const loading = useSelector(state => state.eventChecks.status === 'loading')
  console.log(checks, 'checks')
  useEffect(() => {
    dispatch(loadChecks())
    return () => dispatch(clearChecks())
  }, [dispatch])

  return (
    <>
      {loading ? (
        <Loading centered />
      ) : (
        <div className="checks-list">
          <div className="checks-list__header">
            <Title type={TITLE_TYPES.h3}>Checks</Title>
            <div className="checks-list__btn">
              <DashboardSelect
                options={CHECK_TYPE_FILTERS.map(type => ({
                  value: type.filter,
                  label: type.text,
                }))}
                onChange={({ value }) => {
                  // this.handleFilterChange(value)
                }}
                // value={
                //   filterValueIsAll
                //     ? { value: 'all', label: 'Filter by:' }
                //     : {
                //         value: selectedFilter,
                //         label: utils.makeReadable(selectedFilter),
                //       }
                // }
              />
            </div>
          </div>
          {checks && Object.keys(checks)?.length > 0 ? (
            <div className="checks-list__body">
              <table>
                <tr className="check-list__head">
                  <th>Time</th>
                  <th>Check title</th>
                  <th>Type</th>
                  <th>No of assignees</th>
                </tr>
                <tbody>
                  {Object.keys(checks).map(key => (
                    <ChecksListItem key={key.toString()} check={checks[key]} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="checks-list__empty">No event Checks Available</div>
          )}
        </div>
      )}
    </>
  )
}
export default Checks

import React from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { CHECK_TYPE_TEXT } from '../../utils/constants'

import moment from 'moment'
const propTypes = {
  check: PropTypes.instanceOf(Parse.Object),
}

const ChecksListItem = ({ check }) => {
  const adminCheck = check.admin_check
  console.log('check check check : ', check)
  return (
    <tr className="checks-list__list-item">
      <td>{moment.utc(check.occurs_at).time()}</td>
      <td>{adminCheck?.title}</td>
      <td>{CHECK_TYPE_TEXT[adminCheck?.event_type]}</td>
      <td>{check.users?.length}</td>
    </tr>
  )
}

ChecksListItem.propTypes = propTypes

ChecksListItem.defaultProps = {
  check: {},
}

export default ChecksListItem

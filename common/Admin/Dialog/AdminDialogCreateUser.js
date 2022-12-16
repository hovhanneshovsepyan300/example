import React from 'react'
import AdminUserDetailPage from '../../../../containers/admin/AdminUserDetailPage'
import PropTypes from 'prop-types'

const propTypes = { enableCloseDialog: PropTypes.bool }

const AdminDialogCreateUser = ({ ...props }) => (
  <div className="admin-dialog__wrapper">
    <AdminUserDetailPage
      newUser
      enableCloseDialog
      isDialog
      {...props}
      match={{ params: { id: null } }}
    />
  </div>
)

AdminDialogCreateUser.propTypes = propTypes

AdminDialogCreateUser.defaultProps = { enableCloseDialog: true }

export default AdminDialogCreateUser

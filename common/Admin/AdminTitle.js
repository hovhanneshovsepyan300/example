import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node.isRequired,
}

const AdminTitle = ({ children }) => (
  <div className="admin-head">
    <h1 className="admin-title admin-title__heading">{children}</h1>
  </div>
)

AdminTitle.propTypes = propTypes

export default AdminTitle

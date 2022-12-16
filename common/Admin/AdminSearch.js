import React from 'react'
import PropTypes from 'prop-types'
import SearchIcon from './../../../images/icons/icon-search.svg'

const AdminSearch = ({ placeholder, showIconVariation }) => {
  return (
    <div className="admin_search">
      {showIconVariation === 'prefix' ? (
        <div className="admin_search-icon_block">
          <img src={SearchIcon} alt="Search" />
        </div>
      ) : null}
      <input placeholder={placeholder} />
      {showIconVariation === 'suffix' ? (
        <div className="admin_search-icon_block">
          <img src={SearchIcon} alt="Search" />
        </div>
      ) : null}
    </div>
  )
}

AdminSearch.propTypes = {
  placeholder: PropTypes.string,
  showIconVariation: PropTypes.string,
}

AdminSearch.defaultProps = {
  placeholder: 'Search',
  showIconVariation: 'prefix',
}

export default AdminSearch

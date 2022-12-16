import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Icon } from './common'
import { getIcon } from '../stores/IconStore'

const optionShape = { label: PropTypes.string, value: PropTypes.string }

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape(optionShape)),
  onChange: PropTypes.func,
  value: PropTypes.shape(optionShape),
  icon: PropTypes.string,
  placeholder: PropTypes.string,
}

const DashboardSelect = ({ options, onChange, value, icon, placeholder }) => (
  <div className="dashboard-group-filter">
    <Icon src={getIcon(icon)} size={18} />
    <Select
      className="dashboard-group-filter__select"
      classNamePrefix="dashboard-group-filter__select"
      options={options}
      onChange={onChange}
      // value={value}
      styles={{ menu: styles => ({ ...styles, zIndex: 999 }) }}
      placeholder={placeholder}
    />
  </div>
)

DashboardSelect.propTypes = propTypes

DashboardSelect.defaultProps = {
  options: [],
  onChange: () => {},
  value: null,
  icon: 'filter',
  placeholder: 'Filter',
}

export default DashboardSelect

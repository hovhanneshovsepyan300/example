import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import {
  SELECT_PERMISSION_OPTIONS,
  SELECT_PIN_OPTIONS,
} from '../../../containers/admin/AdminUserDetailPage'

import styles from './index.module.scss'

const SharedSelectInput = ({ label, height, options, value, onChange }) => {
  if (label === 'Pin') {
    SELECT_PIN_OPTIONS.map(selectedPin => {
      if (selectedPin?.value === value?.value) {
        value = selectedPin
      }
    })
  } else if (label === 'Permission') {
    SELECT_PERMISSION_OPTIONS.map(selectedPermission => {
      if (selectedPermission.value === value?.value) {
        value = selectedPermission
      }
    })
  }
  console.log('sss', value)
  const selectStyles = useMemo(
    () => ({
      control: styles => ({
        ...styles,
        height,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'transparent',
        paddingTop: 20,
        border: 'none',
      }),
      option: styles => ({
        ...styles,
        color: '#20315F',
        fontWeight: 400,
        fontSize: '16px',
      }),
      menu: styles => ({
        ...styles,
        marginTop: 65,
      }),
      singleValue: styles => ({
        ...styles,
        color: '#20315F',
        fontWeight: 400,
        fontSize: '16px',
      }),
    }),
    [height],
  )
  return (
    <div className={styles.sharedSelectInputRoot}>
      <p className={styles.label}>{label}</p>
      <div style={{ height }} className={styles.selectContainer}>
        <Select
          styles={selectStyles}
          options={options}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => (
              <div className={styles.dropdownIndicator}></div>
            ),
            Placeholder: () => null,
          }}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

SharedSelectInput.propTypes = {
  label: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.array,
  value: PropTypes.object,
  onChange: PropTypes.func,
}

SharedSelectInput.defaultProps = {
  label: 'Type of item',
  height: '60px',
  options: [],
  value: { label: '', value: '' },
  onChange: () => {},
}

export default SharedSelectInput

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from './common'
import SVGIcons from './SVGIcons'

const propTypes = {
  action: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.any,
  }).isRequired,
  icon: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
}

const HeaderButton = ({ action, icon, dispatch, children, isDisabled }) => (
  <div className="header-button">
    <Button
      className={`header-button ${isDisabled ? 'header-disable' : ''}`}
      onClick={() => {
        if (!isDisabled) {
          dispatch(action)
        }
      }}
      size="sm"
      margin="0px 7px"
      tabIndex={-1}
      disabled={isDisabled}
      style={{
        backgroundColor:
          icon == 'evacuate' ? '#f8e71c' : icon == 'unread' ? '#3DAB3A' : '',
      }}
    >
      <i className={`${icon == 'evacuate' ? 'evacuate-hover' : ''}`}>
        <SVGIcons name={icon} />
      </i>
      <span
        style={{
          color: icon == 'evacuate' ? '#20315f' : '',
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </span>
    </Button>
  </div>
)

HeaderButton.propTypes = propTypes

HeaderButton.defaultProps = {
  isDisabled: false,
}

export default connect()(HeaderButton)

import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

const HeaderTitle = ({ title }) => {
  return <div className={styles.headerRoot}>{title}</div>
}

HeaderTitle.propTypes = {
  title: PropTypes.string,
}

HeaderTitle.defaultProps = {
  title: '',
}

export default HeaderTitle

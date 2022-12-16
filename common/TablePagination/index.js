import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as LeftArrowIcon } from './../../../images/icons/table-pagination-left-arrow.svg'
import { ReactComponent as RightArrowIcon } from './../../../images/icons/table-pagination-right-arrow.svg'

const TablePagination = () => {
  const [pageOffset, setPageOffset] = useState(1)
  const [selectedPage, setSelectedPage] = useState(1)

  return (
    <div className="table_pagination">
      <LeftArrowIcon
        onClick={() => {
          if (pageOffset > 1) {
            setPageOffset(pageOffset - 1)
          }
        }}
      />
      <div className="pages_block">
        {Array.from(Array(3).keys()).map(page => (
          <div className="page_item">{page + pageOffset}</div>
        ))}
      </div>
      <RightArrowIcon onClick={() => setPageOffset(pageOffset + 1)} />
    </div>
  )
}

TablePagination.propTypes = {}

TablePagination.defaultProps = {}

export default TablePagination

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'

import ButtonWithIcon from '../common/ButtonWithIcon'
import HaloCheckUploader from '../common/HaloCheckUploader'
import { BUTTON_ICONS, VARIANT, USER_PERMISSIONS } from '../../utils/constants'

import { SearchInput, Selector } from '.'
import { withUserContext } from '../../Contexts'
import '../../styles/css/external/newButtons.css'
import { csvUploader } from '../../api/users'
import { notify } from '../../stores/ReduxStores/admin/admin'
import InputModal from '../common/InputModal/InputModal'
import './../common/InputModal/InputModal.scss'
import { useDispatch } from 'react-redux'

const propTypes = {
  globalActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOf(Object.values(BUTTON_ICONS)),
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
  searchPlaceholder: PropTypes.string.isRequired,

  search: PropTypes.string.isRequired,
  eventId: PropTypes.string,
  selectedFilter: PropTypes.string,

  selectedRows: PropTypes.arrayOf(PropTypes.object),
  afterGlobalAction: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  clientsData: PropTypes.arrayOf(PropTypes.object),
  onFilterChange: PropTypes.func,

  hasRowsSelected: PropTypes.bool,

  onCreateClick: PropTypes.func,
  onUploadClick: PropTypes.func,
  onSelectClick: PropTypes.func,
  onDownloadClick: PropTypes.func,

  currentUser: PropTypes.instanceOf(Parse.User).isRequired,
  reloadHaloChecks: PropTypes.func,
  toggleHaloChecksLoadingModal: PropTypes.func,
  isSearchDisplay: PropTypes.bool,
}

const AdminTableHeader = ({
  globalActions,
  searchPlaceholder,

  search,
  selectedFilter,

  selectedRows,
  afterGlobalAction,
  onSearch,
  clientsData,
  onFilterChange,

  hasRowsSelected,

  onCreateClick,
  onUploadClick,
  onSelectClick,

  currentUser,
  eventId,
  reloadHaloChecks,
  toggleHaloChecksLoadingModal,
  isSearchDisplay,
}) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const inputFileRef = React.useRef()
  const [modal, showModal] = useState(false)
  const [csv, setCsv] = useState()
  const [disableUpload, setDisableUpload] = useState(false)
  const dispatch = useDispatch()
  const openModal = () => {
    showModal(true)
  }

  const closeModal = () => {
    setCsv('')
    setIsDisabled(false)
    showModal(false)
  }
  const handleClick = e => {
    inputFileRef.current.click()
  }
  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo
      let baseURL = ''
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        console.log('Called', reader)
        baseURL = reader.result
        console.log(baseURL)
        resolve(baseURL)
      }
      console.log(fileInfo)
    })
  }
  const uploadFile = () => {
    setDisableUpload(true)
    getBase64(csv)
      .then(async result => {
        console.log('File Is', result.split('base64,')[1])
        let response = await csvUploader(result.split('base64,')[1])
        console.log('res', response)
        if (response.status === true) {
          if (response.data.err.length !== 0) {
            response.data.err.map(error => {
              let errmsg = error.detail
              dispatch(notify(errmsg))
            })
          }
          dispatch(notify('File Uploaded Successfully'))
          setIsDisabled(false)
          closeModal()
        } else {
          dispatch(notify('File Upload Failed, Try Again'))
          setIsDisabled(false)
          closeModal()
        }
      })

      .catch(err => {
        console.log(err)
      })
  }
  const handleUpload = async e => {
    console.log('yea', e.target.files)
    if (e.target.files[0]) {
      setDisableUpload(false)
      showModal(true)
      console.log('e', e.target.files[0])
      setCsv(e.target.files[0])
      inputFileRef.current.value = ''
      setIsDisabled(true)
      console.log('s', csv)
    }
  }
  return (
    <div className="admin-table__header">
      <>
        {modal && (
          <div>
            {/* <button onClick={() =>openModal()}>Open modal</button> */}
            <InputModal isOpen={modal} onClose={closeModal}>
              <h2>Upload CSV</h2>
              <hr />
              {csv !== null && (
                <>
                  <h4 style={{ paddingTop: '12px' }}>
                    <span className="subHead">Selected File: {'   '}</span>
                    {csv.name}
                  </h4>
                  <div className="modalControl">
                    <button
                      className="inputButton third"
                      onClick={uploadFile}
                      disabled={disableUpload}
                    >
                      Upload
                    </button>
                    <button className="inputButton second" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </InputModal>
          </div>
        )}
      </>
      {onCreateClick && (
        <ButtonWithIcon
          icon={BUTTON_ICONS.Add}
          title="Create"
          onClick={onCreateClick}
        />
      )}

      {globalActions.map(globalAction => (
        <ButtonWithIcon
          key={globalAction.icon}
          {...globalAction}
          onClick={() => {
            globalAction.onClick(selectedRows)
            afterGlobalAction()
          }}
          hollow
          disabled={!hasRowsSelected}
          variant={VARIANT.Secondary}
        />
      ))}
      {window.location.href.includes('users') === true && (
        <>
          <input
            ref={inputFileRef}
            type="file"
            accept=".csv"
            onChange={e => {
              handleUpload(e)
            }}
            hidden
          />
          <button
            className="inputBtn"
            onClick={handleClick}
            disabled={isDisabled}
          >
            Choose CSV
          </button>
          {/* {isDisabled&& <button>
          Upload
        </button>} */}
        </>
      )}

      {onSelectClick && onUploadClick && (
        <HaloCheckUploader
          reloadHaloChecks={reloadHaloChecks}
          toggleHaloChecksLoadingModal={toggleHaloChecksLoadingModal}
          eventId={eventId}
          position="right"
        />
      )}
      {isSearchDisplay && (
        <SearchInput
          placeholder={searchPlaceholder}
          value={search}
          onChange={onSearch}
        />
      )}

      {clientsData &&
        currentUser.permission_role === USER_PERMISSIONS.CrestAdmin && (
          <Selector
            value={selectedFilter}
            label="Clients"
            onChange={onFilterChange}
            data={clientsData}
          />
        )}
      {/* {globalActions.map(globalAction => (
        <ButtonWithIcon
          key={globalAction.icon}
          {...globalAction}
          onClick={() => {
            globalAction.onClick(selectedRows)
            afterGlobalAction()
          }}
          hollow
          disabled={!hasRowsSelected}
          variant={VARIANT.Secondary}
        />
      ))} */}
      {/* {onSelectClick && onUploadClick && (
        <HaloCheckUploader
          reloadHaloChecks={reloadHaloChecks}
          toggleHaloChecksLoadingModal={toggleHaloChecksLoadingModal}
          eventId={eventId}
          position="right"
        />
      )} */}
      {/* {clientsData &&
        currentUser.permission_role === USER_PERMISSIONS.CrestAdmin && (
          <Selector
            value={selectedFilter}
            label="Clients"
            onChange={onFilterChange}
            data={clientsData}
          />
        )} */}
    </div>
  )
}

AdminTableHeader.propTypes = propTypes

AdminTableHeader.defaultProps = {
  globalActions: [],
  selectedFilter: '',
  selectedRows: [],
  afterGlobalAction: () => {},
  onFilterChange: () => {},
  hasRowsSelected: false,
  onCreateClick: null,
  onUploadClick: null,
  onSelectClick: null,
  onDownloadClick: null,
  eventId: null,
  clientsData: null,
  reloadHaloChecks: () => {},
  toggleHaloChecksLoadingModal: () => {},
  isSearchDisplay: true,
}

export default withUserContext(AdminTableHeader)

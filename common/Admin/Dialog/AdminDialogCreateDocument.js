import React, { Component, useEffect, useRef, useState } from 'react'

import { AdminField, AdminTitle, AdminButton } from '../index'
import { AdminForm, AdminFormColumn, AdminFormRow } from '../../../AdminForm'
import NiceCheckbox from '../../../AdminTable/NiceCheckbox'
import { VARIANT } from '../../../../utils/constants'
import moment from 'moment'
import SVGIcons from '../../../SVGIcons'

const AdminDialogCreateDocument = props => {
  const [data, setData] = useState({
    assignRole: [],
    name: '',
    details: '',
    date: '',
    mandatory: false,
    file: '',
    id: '',
    fileData: '',
    eventId: '',
  })
  const inputRef = useRef()
  const [loading, setLoading] = useState(false)
  const { onDone, document, onUpdate, onCloseDialog, events } = props

  const validFormats = ['image/png', 'application/pdf', 'image/jpeg']

  useEffect(() => {
    if (document) {
      setData(prev => ({
        ...prev,
        name: document.docName,
        details: document.details,
        id: document.id,
        date: document.date ? document.date : '',
        mandatory: document.mandatory ? document.mandatory : false,
        assignRole: document.assignRole ? document.assignRole : [],
        eventId: document.eventId,
        update: true,
        oldData: {
          eventId: document.eventId,
          type: document.type,
          docName: document.docName,
          fileName: document.fileName,
        },
        type: document.type,
      }))
    }
  }, document)

  const handleCheckChange = (check, e) => {
    let assignRole = data.assignRole ? data.assignRole : []
    if (check) {
      assignRole.push(e)
    } else {
      assignRole = assignRole.filter(data => data != e)
    }
    setData(prev => ({ ...prev, assignRole: assignRole }))
  }
  const updateField = fieldName => {
    return value => {
      setData(prev => ({ ...prev, [fieldName]: value }))
    }
  }

  const handleFileChange = e => {
    let file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      let type = e.target.result.split(';')[0].split(':')[1]
      setData(prev => ({
        ...prev,
        file: file,
        fileData: e.target.result,
        type: type,
      }))
      if (!validFormats.includes(type)) {
        handleCheckChange(false, 'app')
      }
    }
  }

  const openFileExplorer = () => {
    inputRef.current.click()
  }
  return (
    <div className="admin-dialog-document">
      <div className="admin-dialog-wrapper">
        <div className="admin-dialog-top-header">
          <AdminTitle>Upload Documents</AdminTitle>
          <span onClick={onCloseDialog}>
            <SVGIcons name="closeIcon" />
          </span>
        </div>

        <AdminForm>
          <AdminFormRow size={2}>
            <AdminFormColumn>
              <AdminField
                label="Document Name"
                type="text"
                placeholder="Document name"
                required="This field is required."
                value={data.name}
                onChange={updateField('name')}
              />
              <AdminField
                label="Document Details"
                type="textarea"
                placeholder="Other document name"
                value={data.details}
                onChange={updateField('details')}
              />
              <div className="date">
                {/* <label className="label">Date</label> */}
                <AdminField
                  type="date"
                  label="Date"
                  value={data.date}
                  onChange={updateField('date')}
                />
              </div>
            </AdminFormColumn>

            <AdminFormColumn>
              <div className="checkbox">
                <p className="checkbox__title">Assign Role</p>

                <div className="list">
                  <div className="item">
                    {/* <NiceCheckbox
                      checked={data.assignRole.includes('admin')}
                      onChange={e => handleCheckChange(e, 'admin')}
                    /> */}
                    <AdminField
                      type="switch"
                      value={data.assignRole.includes('admin')}
                      onChange={e => handleCheckChange(e, 'admin')}
                    />
                    <label>Admin</label>
                  </div>
                  <div className="item">
                    {/* <NiceCheckbox
                      disabled={data.type && !validFormats.includes(data.type)}
                      checked={data.assignRole.includes('app')}
                      onChange={e => handleCheckChange(e, 'app')}
                    /> */}
                    <AdminField
                      type="switch"
                      value={data.assignRole.includes('app')}
                      onChange={e => handleCheckChange(e, 'app')}
                    />
                    <label>App</label>
                  </div>
                  <div className="item">
                    {/* <NiceCheckbox
                      checked={data.assignRole.includes('dash')}
                      onChange={e => handleCheckChange(e, 'dash')}
                    /> */}
                    <AdminField
                      type="switch"
                      value={data.assignRole.includes('dash')}
                      onChange={e => handleCheckChange(e, 'dash')}
                    />
                    <label>Dash</label>
                  </div>
                  <div className="event-list">
                    <AdminField
                      label="Event"
                      placeholder="Please select"
                      type="dropdown"
                      value={data.eventId}
                      onChange={updateField('eventId')}
                      options={events.map(event => ({
                        value: event.object_id,
                        label: event.title,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </AdminFormColumn>
          </AdminFormRow>
        </AdminForm>
        <AdminFormRow size={0}>
          <div className="right-control">
            <div className="mandatory">
              <label className="label">Mandatory</label>
              <AdminField
                type="switch"
                value={data.mandatory}
                onChange={updateField('mandatory')}
              />
            </div>

            <div className="button ">
              {/* <div>
                <label>{data.file ? data.file.name : 'Upload file'}</label>
              </div> */}

              <input
                ref={inputRef}
                onChange={e => {
                  handleFileChange(e)
                }}
                type="file"
                style={{ display: 'none' }}
                accept=".csv,.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />

              <div className="upload-file-wrap">
                <AdminButton
                  onClick={() => {
                    openFileExplorer()
                  }}
                >
                  {/* {data.file ? data.file.name : 'Upload file'} */}
                  {data.file ? 'Uploaded' : 'Upload file'}
                </AdminButton>
              </div>
            </div>
          </div>
        </AdminFormRow>
        <div className="admin-dialog-footer-button">
          <div className="button">
            <div className="button__cancle">
              <AdminButton onClick={onCloseDialog}> Cancel</AdminButton>
            </div>
            <div className="button__save">
              <AdminButton
                disabled={
                  (!data.file ||
                    !data.name ||
                    !data.date ||
                    !data.details ||
                    !data.eventId) &&
                  !data.update
                }
                onClick={() => {
                  onDone(data)
                  setLoading(true)
                }}
                loading={loading}
              >
                {data.update ? 'Update' : 'Save'}
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDialogCreateDocument

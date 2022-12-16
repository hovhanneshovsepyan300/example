import React, { useState } from 'react'
import { Loading } from '../common'
import IncidentVideoTable from '../IncidentVideoTable'
import { openIncidentView } from '../../stores/ReduxStores/dashboard/dashboard'
import { AdminButton, AdminField } from '../common/Admin'
import { saveIncidentVideo } from '../../api/incidents'

const IncidentVideoAttachment = (props) => {

  const [filter, setFilter] = useState({ label: 'All', value: '' })
  const [chosenIncident, setChosenIncident] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const {
    liveIncidents,
    closeView,
    customIncidentTypes,
    incidentsTableData,
    incidentsLoading,
    recordingLink
  } = props

  const selectIncident = (incidentId) => {
    setChosenIncident(incidentId)
  }

  const onNameChange = (name) =>{
    setName(name)
  }

  const onDescriptionChange = (description) =>{
    setDescription(description)
  }

  const clearIncident = () =>{
    setChosenIncident(null)
  }

  const saveVideo = () =>{
    const data = {
      name,
      description,
      link: recordingLink + '/media/hls/master.m3u8'
    }
    saveIncidentVideo(chosenIncident, data)
    //console.log({chosenIncident, data})
    //send data using api using incidentId
    closeView()
  }

  const windowStyle = {
    margin: '10px'
  }
  return (
    <div>
      {!chosenIncident ? 
      <div className="incidents__content" style={windowStyle}>
        <div className="incidents__content__list">
          <IncidentVideoTable
            incidents={liveIncidents}
            filter={filter}
            customIncidentTypes={customIncidentTypes}
            dispatch={props.dispatch}
            onClick={incidentId => {
              selectIncident(incidentId)
            }}
          />
          {incidentsTableData.length === 0 &&
            !incidentsLoading &&
            'No Incidents'}
          {incidentsLoading && <Loading />}
        </div>
      </div>
      :
      <div style={windowStyle}>
        <AdminField
            label="Name"
            type="text"
            value={name}
            onChange={onNameChange}
            required="Please provide a name for the footage"
          />
          <AdminField
            label="Description"
            type="textarea"
            value={description}
            onChange={onDescriptionChange}
            required="Please provide a description for the footage"
          />
          <AdminButton
              onClick={() => clearIncident()}
            >
              Back
            </AdminButton>
            <AdminButton
              onClick={() => saveVideo()}
              loading={saving}
              disabled={
                !name ||
                !description
              }
            >
              Save
            </AdminButton>
      </div>}
    </div>
  )
}

export default IncidentVideoAttachment

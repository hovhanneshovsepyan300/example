import React, { useRef, useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DEFAULT_CENTER } from '../../utils/constants'
import utils from '../../utils/helpers'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { Loading } from './../common'
import { MAPBOX_API_KEY } from '../../settings'

mapboxgl.accessToken = MAPBOX_API_KEY.env

const propTypes = {
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}
const IncidentFormFieldMapboxMap = ({ handleChange, id, loading }) => {
  const map = useRef(null)
  const marker = useRef(null)
  const [checkedSat, setCheckedSat] = useState(false)
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11')
  const [lng, setLng] = useState(DEFAULT_CENTER.lng)
  const [lat, setLat] = useState(DEFAULT_CENTER.lat)
  const [zoom, setZoom] = useState(3)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    })
    marker.current = new mapboxgl.Marker()
  }, [])

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
    map.current.on('click', e => {
      let coordinates = e.lngLat
      marker.current.setLngLat(coordinates).addTo(map.current)

      handleChange(id, coordinates)
    })
  }, [])

  const onChangeValue = event => {
    console.log(event.target.value)
    const layerId = event.target.value
    map.current.setStyle('mapbox://styles/mapbox/' + layerId)
    if (layerId === 'satellite-v9') setCheckedSat(true)
    else setCheckedSat(false)
    setMapStyle('mapbox://styles/mapbox/' + layerId)
  }

  return (
    <div className="map-container__content">
      {loading && <Loading centered />}
      <div className="menu" onChange={e => onChangeValue(e)}>
        <input
          type="radio"
          name="map_type"
          value="satellite-v9"
          checked={checkedSat}
        />
        satellite
        <input
          type="radio"
          name="map_type"
          value="streets-v11"
          checked={!checkedSat}
        />
        streets
      </div>
      <div
        id="map"
        className="map-container"
        style={{ width: '100%', height: '300px' }}
      ></div>
    </div>
  )
}

IncidentFormFieldMapboxMap.propTypes = propTypes

IncidentFormFieldMapboxMap.defaultProps = {}

export default connect(state => {
  const { geofenceIdFilter } = state.dashboard
  const geofences = state.eventGeofences.list

  const geofence = utils.getDataById(geofences, geofenceIdFilter)

  return {
    geofences: geofenceIdFilter ? [geofence] : geofences,
    loading: state.eventGeofences.status === 'loading',
  }
})(IncidentFormFieldMapboxMap)

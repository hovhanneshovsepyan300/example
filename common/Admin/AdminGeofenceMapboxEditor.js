import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { MAPBOX_API_KEY } from '../../../settings'
import { DEFAULT_CENTER } from './../../../utils/constants'
import ReactDOM from 'react-dom'
import DashboardPinIcon from '../../DashboardPin/DashboardPinIcon'

mapboxgl.accessToken = MAPBOX_API_KEY.env
class AdminGeofenceMapboxEditor extends Component {
  static propTypes = {
    geofencePoints: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      viewport: {
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng,
        zoom: 5,
      },
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
    }
    this.map = null
    this.marker = null
    this.geofence = null
    this.markers = []
    this.pointList = []
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.state.mapStyle,
      center: [this.state.viewport.longitude, this.state.viewport.latitude],
      zoom: this.state.viewport.zoom,
    })

    this.props.geofencePoints.forEach(point => {
      const el = document.createElement('div')
      el.className = 'marker'
      ReactDOM.render(<DashboardPinIcon type="incident" />, el)
      const marker = new mapboxgl.Marker(el, { draggable: true })
        .setLngLat(point)
        .addTo(this.map)
      el.addEventListener('contextmenu', () => {
        const currentPoint = marker.getLngLat()
        const restPoints = this.props.geofencePoints.filter(
          item => currentPoint.lng !== item.lng,
        )
        this.updatePoints(restPoints)
        marker.remove()
      })
    })
  }

  addMarker() {
    const { map } = this
    const { geofencePoints } = this.props
    if (!map) {
      return
    }
    let position = map.getCenter()

    const point = position
    const points = [...geofencePoints, point]
    const el = document.createElement('div')
    el.className = 'marker'
    ReactDOM.render(<DashboardPinIcon type="incident" />, el)
    const marker = new mapboxgl.Marker(el, { draggable: true })
      .setLngLat(point)
      .addTo(map)
    el.addEventListener('contextmenu', () => {
      const currentPoint = marker.getLngLat()
      const restPoints = points.filter(item => currentPoint.lng !== item.lng)
      this.updatePoints(restPoints)
      marker.remove()
    })
    this.updatePoints(points)
  }

  updatePoints(points) {
    this.props.onChange(points)
  }

  render() {
    return (
      <div className="admin-geofence-editor">
        <div className="map-container__content">
          <div id="map" className="map-container" />
        </div>
      </div>
    )
  }
}

export default AdminGeofenceMapboxEditor

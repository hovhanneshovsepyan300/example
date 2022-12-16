import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'
import { connect } from 'react-redux'
import { compose } from 'redux'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { Button, Loading } from './common'
import Icon from './Icon'
import { loadEventGeofences } from '../stores/ReduxStores/dashboard/eventGeofences'
import {
  resetGeofenceRedraw,
  setMapCenter,
} from '../stores/ReduxStores/dashboard/dashboard'
import {
  MAP_GEOFENCE_STYLE,
  MAP_TYPES,
  DEFAULT_CENTER,
  USER_PERMISSIONS,
} from '../utils/constants'
import utils from '../utils/helpers'
import dashboardUtils from '../utils/dashboardFilterHelpers'
import { withCustomIncidentTypesContext } from '../Contexts'
import CustomIncidentPins from './DashboardPin/CustomIncidentPin'
import CustomStaffPins from './DashboardPin/CustomStaffPin'
import DashboardRightPanelViewSelector from './Dashboard/DashboardRightPanelViewSelector'
import { MAPBOX_API_KEY } from '../settings'
import SVGIcons from './SVGIcons'

mapboxgl.accessToken = MAPBOX_API_KEY.env
class MapContainer extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    geofences: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
    staff: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
    incidents: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
    loading: PropTypes.bool.isRequired,
    customIncidentTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    mapCenter: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    headless: PropTypes.bool,
    showPanelSelector: PropTypes.bool,
    redrawGeofences: PropTypes.bool.isRequired,
    geofenceIdFilter: PropTypes.string,
    groupIdFilter: PropTypes.string,
    event: PropTypes.instanceOf(Parse.Object),
  }

  static defaultProps = {
    headless: false,
    showPanelSelector: true,
    mapCenter: null,
    geofenceIdFilter: '',
    groupIdFilter: '',
    event: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      showStaff: false,
      showIncidents: true,
      mapCenter: props.mapCenter,
      redraw: false,
      recenter: false,
      rezoom: false,
      viewport: {
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng,
        zoom: 5,
      },
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      checkedSat: false,
      incidentList: [],
    }

    this.maps = null
    this.drawnGeofences = {}
    this.centerMap = this.centerMap.bind(this)
    this.changeStyle = this.changeStyle.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.type === MAP_TYPES.Incident) {
      return null
    }

    if (state.geofenceIdFilter !== props.geofenceIdFilter) {
      return {
        geofenceIdFilter: props.geofenceIdFilter,
        redraw: true,
        rezoom: true,
      }
    }

    if (state.groupIdFilter !== props.groupIdFilter) {
      return { groupIdFilter: props.groupIdFilter, redraw: true, rezoom: true }
    }

    if (state.mapCenter !== props.mapCenter) {
      return { mapCenter: props.mapCenter, recenter: true }
    }

    if (props.redrawGeofences) {
      props.dispatch(resetGeofenceRedraw())
      return { redraw: true }
    }

    return null
  }

  componentDidMount() {
    if (this.props.type === 'incident') {
      //   centerPoint = this.props.incidents[0].capture_data.location
      this.map = new mapboxgl.Map({
        container: `map_${this.props.type}`,
        style: this.state.mapStyle,
        center: [
          this.props.incidents[0].capture_data.location.longitude,
          this.props.incidents[0].capture_data.location.latitude,
        ],
        zoom: this.state.viewport.zoom,
      })
      this.map.zoomTo(11, { duration: 2000 })
    } else {
      this.map = new mapboxgl.Map({
        container: `map_${this.props.type}`,
        style: this.state.mapStyle,
        center: [this.state.viewport.longitude, this.state.viewport.latitude],
        zoom: this.state.viewport.zoom,
      })
    }

    this.props.dispatch(loadEventGeofences())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.incidents !== this.props.incidents) {
      this.setState({ incidentList: this.props.incidents })
    }
  }

  getZIndexGenerator() {
    const { incidents, staff } = this.props

    const latitudes = [
      ...incidents.map(incident => incident.capture_data.location.latitude),
      ...staff.map(user => user.location.latitude),
    ]

    const sortedLatitudes = utils.sort(latitudes, latitude => latitude, 'desc')

    return latitude => sortedLatitudes.indexOf(latitude)
  }

  recenter() {
    const { map, maps } = this
    const { mapCenter } = this.state

    if (!map || !maps || !mapCenter) {
      console.warn(
        'debug',
        "recenter stopped because there's no map/maps/mapCenter",
      )
      return
    }

    map.panTo(new maps.LatLng(mapCenter.latitude, mapCenter.longitude))
  }

  redrawGeofences() {
    const { map, maps } = this

    if (!map || !maps) {
      console.warn('debug', "drawGeofences stopped because there's no map/maps")
      return
    }

    const { geofences } = this.props

    Object.values(this.drawnGeofences).forEach(geofence =>
      geofence.setMap(null),
    )

    geofences.forEach(geofence => {
      const zonePoints = geofence.points.map(
        point => new maps.LatLng(point.latitude, point.longitude),
      )
      if (!this.drawnGeofences[geofence.id]) {
        const mapZone = new maps.Polygon({
          map,
          paths: zonePoints,
          ...MAP_GEOFENCE_STYLE,
        })

        this.drawnGeofences[geofence.id] = mapZone
      }
      this.drawnGeofences[geofence.id].setPaths(zonePoints)
      this.drawnGeofences[geofence.id].setMap(map)
    })
  }

  centerMap({ lat, lng }) {
    this.props.dispatch(setMapCenter({ latitude: lat, longitude: lng }))
  }
  changeStyle(layerId) {
    this.map.setStyle('mapbox://styles/mapbox/' + layerId)
    if (layerId === 'satellite-v9') this.setState({ checkedSat: true })
    else this.setState({ checkedSat: false })
    this.setState({ mapStyle: 'mapbox://styles/mapbox/' + layerId })
  }
  render() {
    const {
      loading,
      staff,
      customIncidentTypes,
      headless,
      event,
      showPanelSelector,
    } = this.props
    const { showIncidents, showStaff } = this.state
    const zIndexGenerator = this.getZIndexGenerator()

    return (
      <section
        className={`map-container ${headless ? 'map-container--headless' : ''}`}
      >
        <div className="map-container__header">
          <div className="map-container__header__title">
            {showPanelSelector && <DashboardRightPanelViewSelector />}
          </div>
          <div className="map-container__header__icons">
            <Button
              type="invisible"
              margin={8}
              onClick={() =>
                this.setState({ showIncidents: !this.state.showIncidents })
              }
              className={utils.makeClass(
                'map-container__filter',
                !this.state.showIncidents && 'disabled',
              )}
            >
              <SVGIcons name={'unread'} />
            </Button>
            <Button
              margin={8}
              onClick={() =>
                this.setState({ showStaff: !this.state.showStaff })
              }
              className={utils.makeClass(
                'map-container__filter',
                !this.state.showStaff && 'disabled',
              )}
            >
              <i className="person-icon">
                <SVGIcons name={'userIcon'} />
              </i>
            </Button>
          </div>
        </div>

        <div className="map-container__content">
          {loading && <Loading centered />}
          <div id={`map_${this.props.type}`} className="map-container">
            <CustomIncidentPins
              incidents={this.state.incidentList}
              map={this.map}
              customIncidentTypes={customIncidentTypes}
              zIndexGenerator={zIndexGenerator}
              showIncidents={showIncidents}
            />
            {showStaff && (
              <CustomStaffPins
                staff={staff}
                zIndexGenerator={zIndexGenerator}
                event={event}
                map={this.map}
                showStaff={showStaff}
              />
            )}
            {!showIncidents &&
              document
                .querySelectorAll('.marker')
                .forEach(item => (item.style.display = 'none'))}
            {!showStaff &&
              document
                .querySelectorAll('.marker-staff')
                .forEach(item => (item.style.display = 'none'))}
          </div>
          <div className="menu">
            <input
              type="radio"
              name={`rtoggle_${this.props.type}`}
              value="satellite-v9"
              onChange={e => this.changeStyle(e.target.value)}
              checked={this.state.checkedSat}
            />
            <label htmlFor="satellite-v9">satellite</label>
            <input
              type="radio"
              name={`rtoggle_${this.props.type}`}
              onChange={e => this.changeStyle(e.target.value)}
              value="streets-v11"
              checked={!this.state.checkedSat}
            />
            <label htmlFor="streets-v11">streets</label>
          </div>
        </div>
      </section>
    )
  }
}

export default compose(
  withCustomIncidentTypesContext,
  connect((state, props) => {
    const {
      auth: { currentUser },
    } = state
    const { event } = state.currentEvent
    const { geofenceIdFilter, groupIdFilter } = state.dashboard

    const geofences = state.eventGeofences.list
    const { redrawGeofences } = state.dashboard

    const geofence = utils.getDataById(geofences, geofenceIdFilter)

    const staffGroups = state.staffGroups.list

    const staffGroup = staffGroups.find(
      ({ object_id }) => object_id === groupIdFilter,
    )

    let staff = []
    let incidents = []
    let mapCenter = {}
    let loading = false

    if (props.type === 'dashboard') {
      const isTriagingEnabled = utils.hasIncidentTriaging(
        state.currentEvent.event,
      )

      const staffArr = Object.values(state.staff.data)
        .filter(user => utils.isBookedOn(user, state.currentEvent.event))
        .filter(user => user.location)

      staff =
        geofence || staffGroup
          ? Object.values(state.staff.data)
              .filter(user => utils.isBookedOn(user, state.currentEvent.event))
              .filter(dashboardUtils.filterStaffByGeofenceOrUserGroup(geofence))
              .filter(user => user.location)
          : staffArr

      const triagedIncidents = Object.values(
        state.incidents.data,
      ).filter(incident => (isTriagingEnabled ? incident.triaged : true))

      incidents =
        geofence || staffGroup
          ? triagedIncidents.filter(
              dashboardUtils.filterIncidentsByGeofenceOrUserGroup(
                geofence,
                staffGroup,
              ),
            )
          : currentUser.permission_role ===
            USER_PERMISSIONS.TargetedDashboardUser
          ? dashboardUtils.filterIncidentsByUserGroups(
              staffGroups,
              triagedIncidents,
            )
          : triagedIncidents
      ;({ mapCenter } = state.dashboard)

      loading =
        state.incidents.status === 'loading' ||
        state.staff.status === 'loading' ||
        state.eventGeofences.status === 'loading'
    } else if (props.type === 'incident') {
      staff = []
      let incident = state.incidents.data[props.incidentId]

      if (!incident) {
        incident = state.incidents.closedIncidentList.filter(
          incident => incident.id === props.incidentId,
        )[0]
      }

      incidents = incident ? [incident] : []

      mapCenter = incident.capture_data.location

      loading = !incident
    }

    incidents = incidents.filter(
      incident => incident.capture_data && incident.capture_data.location,
    )

    const filteredMal = dashboardUtils
      .filterStaffByUserGroups(staffGroups, Object.values(state.staff.data))
      .filter(user => user.location)
      .map(staff => ({
        ...staff,
        location: {
          longitude: staff.location.coordinates[0],
          latitude: staff.location.coordinates[1],
        },
      }))

    return {
      incidents,
      staff:
        currentUser.permission_role === USER_PERMISSIONS.TargetedDashboardUser
          ? filteredMal
          : staff.map(staff => ({
              ...staff,
              location: {
                longitude: staff.location.coordinates[0],
                latitude: staff.location.coordinates[1],
              },
            })),
      geofences: geofenceIdFilter ? [geofence] : geofences,
      geofenceIdFilter,
      groupIdFilter,
      mapCenter,
      loading,
      redrawGeofences,
      event,
    }
  }),
)(MapContainer)

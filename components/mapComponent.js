import React from "react";
import L     from "leaflet";
import $     from "jquery";

import _clamp    from "lodash.clamp";
import _debounce from "lodash.debounce";
import _inRange  from "lodash.inrange";

import Dialog   from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";

import { Circle,
         CircleMarker,
         LayersControl,
         LayerGroup,
         Map,
         Marker,
         TileLayer,
         ZoomControl } from "react-leaflet";

import Control            from "react-leaflet-control";
import MarkerClusterGroup from "react-leaflet-markercluster";

import FacilityData      from "./facilityData";
import ParseFacilityData from "./parseFacilityData";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions( {
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-shadow.png",
} );

const { BaseLayer, Overlay } = LayersControl;

export default class MapComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      zoom: 11,
      markers: [],
      facility: "",
      facilityID: "",
      isRefreshing: 0,
      suppressHashChange: false,
      locationPermission: false,
      maxBounds: [ [ 41, -50 ], [ 84, -146 ] ],
      mapCentre: { lat: 43.648264, lng: -79.397858 },
      geoLocation: { lat: "", lng: "", accuracy: "" },
      bounds: { latN: "", latS: "", lngE: "", lngW: "" }
    }
  }

  componentDidMount() {
    this.parseURL();
    window.addEventListener( "hashchange", this.parseURL );
  }

  fetchFacilityDetails( facilityID, lat, lng, zoom ) {
    let url = `/api/facility/${ facilityID }`;
    $.getJSON( url )
    .then( ( facility ) => {
      if( ( lat === facility.loc.coordinates[ 1 ] ) &&
          ( lng === facility.loc.coordinates[ 0 ] ) &&
          ( _inRange( zoom, 7.999, 18.001 ) ) ) {
        this.setState( { facility: ParseFacilityData( facility ),
                         facilityID: facility._id,
                         isRefreshing: this.state.isRefreshing - 1,
                         mapCentre: { lat: lat, lng: lng },
                         suppressHashChange: true,
                         zoom: zoom } )
      } else {
        this.setState( { isRefreshing: this.state.isRefreshing - 1 },
                       () => { this.updateHash( { lat: facility.loc.coordinates[ 1 ],
                                                  lng: facility.loc.coordinates[ 0 ],
                                                  zoom: ( zoom
                                                          ? _clamp( zoom, 8, 18 )
                                                          : 18 ),
                                                  facilityID: facilityID } ) } )
      }
    } )
    .catch( ( err ) => {
      this.setState( { isRefreshing: this.state.isRefreshing - 1 },
                     () => { this.updateHash(); } )
    } )
  }

  fetchMarkers = ( bounds ) => {
    let url = `/api/markers/latN=${ bounds.latN }&latS=${ bounds.latS }&lngE=${ bounds.lngE }&lngW=${ bounds.lngW }`;
    $.getJSON( url )
    .then( ( markers ) => {
      ( JSON.stringify( markers ) === JSON.stringify( this.state.markers ) )
      ? this.setState( { isRefreshing: this.state.isRefreshing - 1 } )
      : this.setState( { markers: markers,
                         isRefreshing: this.state.isRefreshing - 1 } )
    } )
    .catch( ( err ) => { console.log( { error: err.message } ) } );
  }

  getCurrentPosition = ( errorCallback ) => {
    navigator.geolocation.getCurrentPosition( ( position ) => this.setCurrentPosition( position ),
                                              errorCallback );
  }

  geolocationFailure = ( error ) => {
    // replace this with something better
         if( error.code === 1 ) { window.alert( "Please enable location services to use this feature." ) }
    else if( error.code === 2 ) { window.alert( "Geolocation is not supported for this Browser/OS.") }
    else if( error.code === 3 ) { window.alert( "Unable to get your location.") }
  }

  geolocationFailureOnLoad = () => this.setDefaultLocation();

  navigateToLatLngInURL = ( lat, lng, zoom ) => {
    if( !( _inRange( zoom, 7.999, 18.001 ) ) )
        this.updateHash( { lat: lat, lng: lng, zoom: _clamp( zoom, 8, 18 ), facilityID: this.state.facilityID } )
    else if( ( _inRange( lat, this.state.maxBounds[0][0], this.state.maxBounds[1][0] ) ) &&
             ( _inRange( lng, this.state.maxBounds[1][1], this.state.maxBounds[0][1] ) ) ) {
      this.setState( { facility: "",
                       facilityID: "",
                       mapCentre: { lat: lat,
                                    lng: lng },
                       suppressHashChange: true,
                       zoom: zoom } )
    } else {
      this.updateHash();
    }
  }

  onMove = () => {
    if( this.state.suppressHashChange === true ) {
      this.setState( { suppressHashChange: false },
                     this.updateBounds() )
    } else {
      let mapCenter = this.refs.map.leafletElement.getCenter();
      this.updateHash( { lat: mapCenter.lat,
                         lng: mapCenter.lng,
                         zoom: this.refs.map.leafletElement._zoom,
                         facilityID: this.state.facilityID } );
    }
  }

  parseHash( rawHash ) {
    let [ ,facilityID, lat, lng, zoom, ] = rawHash.split( /\s*\/|@|#|,|z\s*/ ).map( ( item ) => ( Number( item ) || item ) );
    if( facilityID ) {
      this.setState( { isRefreshing: ( this.state.isRefreshing + 1 ) },
                     this.fetchFacilityDetails( facilityID, lat, lng, zoom ) );
    } else {
      this.navigateToLatLngInURL( lat, lng, zoom );
    }
  }

  parseURL = () => {
    let rawHash = window.location.hash;
    if( rawHash.length === 0 ) {
      this.getCurrentPosition( this.geolocationFailureOnLoad );
    } else {
      this.parseHash( rawHash );
    }
  }

  setCurrentPosition = ( position ) => {
    this.setState( { geoLocation: { lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    accuracy: position.coords.accuracy },
                     locationPermission: true,
                     suppressHashChange: true },
                   this.updateHash( { lat: position.coords.latitude,
                                      lng: position.coords.longitude,
                                      zoom: this.state.zoom,
                                      facilityID: this.state.facilityID } ) ) }

  setDefaultLocation = () => {
    this.setState( { suppressHashChange: true },
                   this.updateHash( { lat: 43.6482644,
                                      lng: -79.3978587,
                                      zoom: 11,
                                      facilityID: this.state.facilityID } ) )
  }

  updateBounds = () => {
    let mapLimits = this.refs.map.leafletElement.getBounds();

    let latNE = mapLimits._northEast.lat;
    let latSW = mapLimits._southWest.lat;
    let lngNE = mapLimits._northEast.lng;
    let lngSW = mapLimits._southWest.lng;

    let latDelta = 0.25 * Math.abs( latNE - latSW );
    let lngDelta = 0.25 * Math.abs( lngNE - lngSW );

    let bounds = { latN: latNE + latDelta,
                   latS: latSW - latDelta,
                   lngE: lngNE + lngDelta,
                   lngW: lngSW - lngDelta }

    if ( JSON.stringify( bounds ) !== JSON.stringify( this.state.bounds ) ) {
      this.setState( { bounds: bounds,
                       isRefreshing: ( this.state.isRefreshing + 1 ) },
                     this.fetchMarkers( bounds ) )
    }
  }

  updateHash = ( newHash ) => {
    if( typeof newHash === typeof {} ) {
      window.location.replace( `${ window.location.pathname }#${ newHash.facilityID }@${ newHash.lat },${ newHash.lng },${ newHash.zoom }z` );
      window.history.pushState( {} , "",                    `#${ newHash.facilityID }@${ newHash.lat },${ newHash.lng },${ newHash.zoom }z` );
    } else {
      window.location.replace( `${ window.location.pathname }#` );
      window.history.pushState( {} , "",                    `#` );
    }
  }

  render() {
    return (
      <Map zoom={ this.state.zoom }
           minZoom={ 8 }
           maxZoom={ 18 }
           animate={ true }
           zoomControl={ false }
           center={ this.state.mapCentre }
           ref="map"
           maxBounds={ this.state.maxBounds }
           onMoveEnd={ _debounce( ( evt ) => { this.onMove() }, 100, { leading: false, trailing: true } ) } >

        <ZoomControl position="bottomleft" />

        <Control position="bottomleft" className="leaflet-bar leaflet-control-zoom" >
          <a role="button"
             title="Locate Me"
             aria-label="Locate Me"
             onClick={ ( evt ) => { this.getCurrentPosition( this.geolocationFailure ) } }
             className="leaflet-control-zoom-in muidocs-icon-custom-geo" />
        </Control>

        <LayersControl position="bottomright" >
          <BaseLayer name="CartoDB.Positron" checked >
            <TileLayer url={ `https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}${ L.Browser.retina ? `@2x` : `` }.png` }
                       attribution={ "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> &copy; <a href=\"http://cartodb.com/attributions\" >CartoDB</a>" } />
          </BaseLayer>
          <BaseLayer name="Stamen.Terrain" >
            <TileLayer url={ `https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}${ L.Browser.retina ? `@2x` : `` }.png` }
                       attribution={ "Map tiles by <a href=\"http://stamen.com\" >Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\" >CC BY 3.0</a> &mdash; Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\" >OpenStreetMap</a>" } />
          </BaseLayer>
          { ( this.state.locationPermission )
            ? <Overlay checked name="Current location">
                <LayerGroup>
                  <CircleMarker center={ this.state.geoLocation }
                                onClick={ ( evt ) => { this.getCurrentPosition() } }
                                fill="true"
                                color="white"
                                radius={ 10 }
                                stroke={ true }
                                fillOpacity={ 0.7 }
                                fillColor="#4285f4" />
                  <CircleMarker center={ this.state.geoLocation }
                                onClick={ ( evt ) => { this.getCurrentPosition() } }
                                radius={ 25 }
                                stroke={ false }
                                fillOpacity={ 0.1 }
                                fillColor="#4285f4" />
                  <Circle center={ this.state.geoLocation }
                          onClick={ ( evt ) => { this.getCurrentPosition() } }
                          stroke={ false }
                          fillColor="#4285f4"
                          fillOpacity={ 0.1 }
                          radius={ this.state.geoLocation.accuracy } />
                </LayerGroup>
              </Overlay>
            : null
          }
        </LayersControl>

        <MarkerClusterGroup wrapperOptions={ { enableDefaultStyle: true } }
                            markers={ this.state.markers.map( ( marker ) => ( { lat: marker.loc.coordinates[1],
                                                                                lng: marker.loc.coordinates[0],
                                                                                options: { id: marker._id } } ) ) }
                            onMarkerClick={ ( marker ) => { this.setState( { suppressHashChange: true },
                                                                           this.updateHash( { lat: marker._latlng.lat,
                                                                                              lng: marker._latlng.lng,
                                                                                              zoom: this.state.zoom,
                                                                                              facilityID: marker.options.id } ) ) } } />

        { this.state.facilityID
          ? <Dialog modal={ false }
                    repositionOnUpdate={ true }
                    autoScrollBodyContent={ true }
                    className={ "facility-data-box" }
                    contentClassName={ "facility-data-box-content" }
                    bodyClassName={ "facility-data-box-body" }
                    open={ ( typeof this.state.facility === typeof {} ) }
                    onRequestClose={ () => { this.setState( { facility: "",
                                                              facilityID: "" },
                                                            () => { this.updateHash( { lat: this.state.mapCentre.lat,
                                                                                       lng: this.state.mapCentre.lng,
                                                                                       zoom: this.state.zoom,
                                                                                       facilityID: this.state.facilityID } ) } ) } } >
              <FacilityData facility={ this.state.facility } />
            </Dialog>
          : null }

        <Snackbar open={ !!this.state.isRefreshing }
                  message={ "Fetching data" } />

      </Map>
    )
  }

}

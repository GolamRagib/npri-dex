import React from 'react';
import $     from 'jquery';
import L     from 'leaflet';

import Dialog           from 'material-ui/Dialog';
import Snackbar         from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { Map, 
         TileLayer, 
         LayersControl, 
         ZoomControl }    from 'react-leaflet';
import Control            from 'react-leaflet-control';
import GoogleLayer        from './googleMaps/googleLayer';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import FacilityInfo from './facilityInfo';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions( {
  iconUrl: require( 'leaflet/dist/images/marker-icon.png' ),
  iconRetinaUrl: require( 'leaflet/dist/images/marker-icon-2x.png' ),
  shadowUrl: require( 'leaflet/dist/images/marker-shadow.png' ),
} );

const { BaseLayer } = LayersControl;
const key = process.env.GOOGLE_MAPS_API_KEY;
const terrain = 'TERRAIN';
const road = 'ROADMAP';
const satellite = 'SATELLITE';

const markers = [
  { lat: 41.500, lng: -50.500, options: { id: 'SE limit' } },
  { lat: 41.500, lng: -145.50, options: { id: 'SW limit' } },
  { lat: 83.500, lng: -50.500, options: { id: 'NE limit' } },
  { lat: 83.500, lng: -145.50, options: { id: 'NW limit' } },
]; // for testing only

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

export default class GoogleMap extends React.Component {

  constructor() {
    super();
    this.state = {
      markers: [],
      facility: {},
      isRefreshing: 0,
      infoPaneOpen: false,
      mapLocation: [ 43.6482644, -79.3978587 ],
      bounds: { lat1: '', lat2: '', lng1: '', lng2: '' }
    };
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.moveToCoord = this.moveToCoord.bind(this);
    this.updateLimits = this.updateLimits.bind(this);
    this.fetchMarkers = this.fetchMarkers.bind(this);
    this.fetchFacilityData = this.fetchFacilityData.bind( this );
  }

  closeInfoPane = () => this.setState( { infoPaneOpen: false, facility: {} } );

  componentDidMount() {
    setTimeout( this.updateLimits, 250 );
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition( ( position ) => {
      this.moveToCoord( position.coords.latitude, position.coords.longitude );
    } );
    setTimeout( this.updateLimits, 250 );
  }

  moveToCoord( lat, lng ) {
    this.refs.map.leafletElement.panTo( { lat: lat, lng: lng } );
    this.updateLimits();
  }

  updateLimits() {
    let mapLimits = this.refs.map.leafletElement.getBounds();
    let latNE = mapLimits._northEast.lat;
    let latSW = mapLimits._southWest.lat;
    let lngNE = mapLimits._northEast.lng;
    let lngSW = mapLimits._southWest.lng;
    let latDelta = 0.25 * Math.abs( latNE - latSW );
    let lngDelta = 0.25 * Math.abs( lngNE - lngSW );

    let bounds = { lat1: ( ( latNE * 1000000000 ) / 1000000000 ) + latDelta,
                   lat2: ( ( latSW * 1000000000 ) / 1000000000 ) - latDelta,
                   lng1: ( ( lngNE * 1000000000 ) / 1000000000 ) + lngDelta,
                   lng2: ( ( lngSW * 1000000000 ) / 1000000000 ) - lngDelta };

    if( !( JSON.stringify( bounds ) === JSON.stringify( this.state.bounds ) ) ) {
      this.setState( { bounds: bounds } );
      this.fetchMarkers( bounds );
    };

  }

  fetchMarkers( bounds ) {
    this.setState( { isRefreshing: ( this.state.isRefreshing + 1 ) } );
    let url = `/api/markers/lat1=${ bounds.lat1 }&lat2=${ bounds.lat2 }&lng1=${ bounds.lng1 }&lng2=${ bounds.lng2 }`;
    $.get( url )
    .then( ( markers ) => {
      ( JSON.stringify( markers ) === JSON.stringify( this.state.markers ) )
        ? this.setState( { isRefreshing: Math.max( this.state.isRefreshing - 1, 0 ) } )
        : this.setState( { markers: markers, isRefreshing: Math.max( this.state.isRefreshing - 1, 0 ) } )
    } )
    .catch( ( err ) => {
      console.log( { error: err.message } );
    } );
  }

  fetchFacilityData( NPRI_ID, latlng ) {
    this.setState( { isRefreshing: ( this.state.isRefreshing + 1 ) } );
    let url = `/api/facility/${ NPRI_ID }`;
    $.get( url )
    .then( ( facility ) => {
      this.setState( { facility: facility, infoPaneOpen: true, isRefreshing: Math.max( this.state.isRefreshing - 1, 0 ) } );
    } )
    .then( this.moveToCoord( latlng.lat, latlng.lng ) )
    .catch( ( err ) => {
      console.log( { error: err.message } );
    } );
  }

  render() {

    return (
      <div>
        <Map ref='map'
             animate={ true }
             minZoom={ 8 }
             maxZoom={ 18 }
             zoomControl={ false }
             zoom={ 11 }
             center={ this.state.mapLocation }
             maxBounds={ [ [ 41, -50 ], [ 84, -146 ] ] }
             onMoveEnd={ (evt) => { setTimeout( this.updateLimits, 250 ) } }
             onZoomEnd={ (evt) => { setTimeout( this.updateLimits, 250 ) } } >

          <ZoomControl position='bottomleft' />

          <Control position="bottomleft" className="leaflet-bar leaflet-control-zoom" >
            <a role="button"
               title="Locate Me"
               aria-label="Locate Me"
               className="leaflet-control-zoom-in muidocs-icon-custom-geo"
               onClick={ () => this.getCurrentPosition() } style={ { fontSize: 18 } } />
          </Control>

          <LayersControl position='bottomright' >
            <BaseLayer checked name='Google Maps Roads' >
              <GoogleLayer googlekey={ key } maptype={ road } />
            </BaseLayer>
            <BaseLayer name='Google Maps Satellite' >
              <GoogleLayer googlekey={ key } maptype={ satellite } />
            </BaseLayer>
            <BaseLayer name='Google Maps Terrain' >
              <GoogleLayer googlekey={ key } maptype={ terrain } />
            </BaseLayer>
          </LayersControl>

          <MarkerClusterGroup markers={ this.state.markers }
            wrapperOptions={ { enableDefaultStyle: true } }
            onMarkerClick={ ( marker ) => { this.fetchFacilityData( marker.options.id, marker._latlng ) } } />

        </Map>

        <Dialog modal={ false }
                repositionOnUpdate={ true }
                open={ this.state.infoPaneOpen }
                onRequestClose={ this.closeInfoPane }
                autoScrollBodyContent={ true }
                bodyStyle={ { padding: 0 } } >
          <FacilityInfo facility={ this.state.facility } />

        </Dialog>

        <Snackbar open={ !!this.state.isRefreshing } /* the magical cast-to-bool! */
                  message={ "Fetching data" } />

      </div>
    )
  }
}
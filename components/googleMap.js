import React from 'react';
import $     from 'jquery';
import L     from 'leaflet';

import Dialog           from 'material-ui/Dialog';
import Snackbar         from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { Map,
         TileLayer,
         ZoomControl,
         LayersControl }  from 'react-leaflet';
import Control            from 'react-leaflet-control';
import GoogleLayer        from './googleMaps/googleLayer';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import FacilityData      from './facilityData';
import ParseFacilityData from './parseFacilityData';

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

export default class GoogleMap extends React.Component {

  constructor() {
    super();
    this.state = {
      markers: [],
      facility: {},
      isRefreshing: 0,
      facilityDataBoxOpen: false,
      mapLocation: [ 43.6482644, -79.3978587 ],
      bounds: { lat1: '', lat2: '', lng1: '', lng2: '' }
    };
  };

  closefacilityDataBox = () => this.setState( { facilityDataBoxOpen: false, facility: {} } );

  componentDidMount() {
    setTimeout( this.updateLimits, 250 );
    this.getCurrentPosition();
  };

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition( ( position ) => {
      this.moveToCoord( position.coords.latitude, position.coords.longitude );
    } );
    setTimeout( this.updateLimits, 250 );
  };

  moveToCoord = ( lat, lng ) => {
    this.leafletMap.leafletElement.panTo( { lat: lat, lng: lng } );
    this.updateLimits();
  };

  updateLimits = () => {
    let mapLimits = this.leafletMap.leafletElement.getBounds();
    let latNE = ( mapLimits._northEast.lat * 1000000000 ) / 1000000000;
    let latSW = ( mapLimits._southWest.lat * 1000000000 ) / 1000000000;
    let lngNE = ( mapLimits._northEast.lng * 1000000000 ) / 1000000000;
    let lngSW = ( mapLimits._southWest.lng * 1000000000 ) / 1000000000;
    let latDelta = 0.25 * Math.abs( latNE - latSW );
    let lngDelta = 0.25 * Math.abs( lngNE - lngSW );

    let bounds = { lat1: ( latNE + latDelta ),
                   lat2: ( latSW - latDelta ),
                   lng1: ( lngNE + lngDelta ),
                   lng2: ( lngSW - lngDelta ) };

    ( !( JSON.stringify( bounds ) === JSON.stringify( this.state.bounds ) ) )
    ? this.setState( { bounds: bounds, isRefreshing: ( this.state.isRefreshing + 1 ) }, this.fetchMarkers( bounds ) )
    : null;
  };

  fetchMarkers = ( bounds ) => {
    let url = `/api/markers/lat1=${ bounds.lat1 }&lat2=${ bounds.lat2 }&lng1=${ bounds.lng1 }&lng2=${ bounds.lng2 }`;
    $.get( url )
    .then( ( markers ) => {
      ( JSON.stringify( markers ) === JSON.stringify( this.state.markers ) )
      ? this.setState( { isRefreshing: this.state.isRefreshing - 1 } )
      : this.setState( { markers: markers, isRefreshing: this.state.isRefreshing - 1 } )
    } )
    .catch( ( err ) => {
      console.log( { error: err.message } );
    } );
  };

  fetchFacilityData = ( NPRI_ID, latlng ) => {
    let url = `/api/facility/${ NPRI_ID }`;
    $.get( url )
    .then( ( facility ) => {
      let parsedFacilityData = ParseFacilityData( facility );
      this.setState( { facility: parsedFacilityData, facilityDataBoxOpen: true, isRefreshing: this.state.isRefreshing - 1 } );
    } )
    .then( this.moveToCoord( latlng.lat, latlng.lng ) )
    .catch( ( err ) => {
      console.log( { error: err.message } );
    } );
  };

  render() {
    return (
      <div>
        <Map zoom={ 11 }
             minZoom={ 8 }
             maxZoom={ 18 }
             animate={ true }
             zoomControl={ false }
             center={ this.state.mapLocation }
             ref={ map => { this.leafletMap = map } }
             maxBounds={ [ [ 41, -50 ], [ 84, -146 ] ] }
             onMoveEnd={ (evt) => { setTimeout( this.updateLimits, 250 ) } }
             onZoomEnd={ (evt) => { setTimeout( this.updateLimits, 250 ) } } >

          <ZoomControl position='bottomleft' />

          <Control position="bottomleft" className="leaflet-bar leaflet-control-zoom" >
            <a role="button"
               title="Locate Me"
               aria-label="Locate Me"
               onClick={ () => this.getCurrentPosition() }
               className="leaflet-control-zoom-in muidocs-icon-custom-geo" />
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
                              onMarkerClick={ ( marker ) => { this.setState( { isRefreshing: ( this.state.isRefreshing + 1 ) } ), this.fetchFacilityData( marker.options.id, marker._latlng ) } } />

        </Map>

        <Dialog modal={ false }
                repositionOnUpdate={ true }
                bodyStyle={ { padding: 0 } }
                autoScrollBodyContent={ true }
                open={ this.state.facilityDataBoxOpen }
                onRequestClose={ this.closefacilityDataBox } >
          <FacilityData facility={ this.state.facility } />

        </Dialog>

        <Snackbar open={ !!this.state.isRefreshing } /* the magical cast-to-bool! */
                  message={ "Fetching data" } />

      </div>
    )
  };

};

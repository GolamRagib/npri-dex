import React, {PropTypes}  from 'react';
import {GridLayer} from 'react-leaflet';
import {Google} from './leafletGoogle';

export default class GoogleLayer extends GridLayer {

  componentWillMount() {
    super.componentWillMount();
    const {map: _map, googlekey, maptype, asclientid, ...props} = this.props;
    this.leafletElement = new L.gridLayer.googleMutant(this.props);
  }

   componentDidUpdate (prevProps) {
    const { opacity, zIndex } = this.props
    if (opacity !== prevProps.opacity) {
      this.leafletElement.setOpacity(opacity)
    }
    if (zIndex !== prevProps.zIndex) {
      this.leafletElement.setZIndex(zIndex)
    }
  }

}

GoogleLayer.propTypes = {
    googlekey: PropTypes.string.isRequired,
    maptype: PropTypes.string,
    asclientid: PropTypes.bool
}
import React from 'react';
import AppBar from 'material-ui/AppBar';

const TopBar = () => (
  <AppBar title="NPRI Data Explorer"
          iconClassNameLeft="muidocs-icon-custom-code"
          style={ { position: 'fixed', backgroundColor: "#ac1f34", top: 0, left: 0 } } />
);

export default TopBar;
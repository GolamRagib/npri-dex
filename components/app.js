import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GoogleMap from "./googleMap";

import AppBarX from './appBarX';

export default class App extends React.Component {
  render() {
    return <MuiThemeProvider>
      <div>
        <AppBarX />
        <GoogleMap />
      </div>
    </MuiThemeProvider>
  }
}
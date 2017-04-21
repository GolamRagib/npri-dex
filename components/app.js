import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBarX from './appBarX';
import MapComponent from "./mapComponent";

export default class App extends React.Component {
  render() {
    return <MuiThemeProvider>
      <div>
        <AppBarX />
        <MapComponent />
      </div>
    </MuiThemeProvider>
  }
}
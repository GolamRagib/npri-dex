import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './TopBar';
import MapComponent from "./MapComponent";

export default class App extends React.Component {
  render() {
    return <MuiThemeProvider>
      <div>
        <TopBar />
        <MapComponent />
      </div>
    </MuiThemeProvider>
  }
}
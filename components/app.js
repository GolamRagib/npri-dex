import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import MapComponent from "./mapComponent";

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
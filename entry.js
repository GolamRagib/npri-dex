import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/app';

injectTapEventPlugin();

ReactDOM.render( <App />, document.getElementById( "placeholder" ) );
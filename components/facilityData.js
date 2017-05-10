import React from 'react';

import Divider from 'material-ui/Divider';
import { List,
         ListItem } from 'material-ui/List';
import { darkBlack,
         lightBlack } from 'material-ui/styles/colors';

const FacilityData = ( { facility } ) => {
  return <List style={ { padding: 0 } } >
    { facility.map( ( row, index ) => (
      <div key={ index } >
        <ListItem innerDivStyle={ { padding: 16 } }
                  primaryText={ <p style={ { color: lightBlack, fontSize: 14, margin: 0 } } >{ row.label }</p> }
                  secondaryText={ <p style={ { color: darkBlack, margin: 0 } } >{ row.data }</p> } />
        { ( index !== ( facility.length - 1 ) ) ? <Divider /> : "" }
      </div>
    ) ) }
  </List>
};

export default FacilityData;
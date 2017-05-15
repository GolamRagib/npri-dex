import React from 'react';

import {
  darkBlack,
  lightBlack,
} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

const FacilityData = ( { facility } ) => {

  return <div>
    {
      facility.map(
        ( row, index ) => (
          <div key={ index } >
            <h4 style={ {
              color: lightBlack,
              fontSize: 14,
              margin: '16px 16px 0px 16px',
            } } >
              { row.label }
            </h4>
            <p style={ {
              color: darkBlack,
              fontSize: 14,
              margin: '0px 16px 16px 16px',
              whiteSpace: 'pre-line',
            } } >
              { row.data }
            </p>
            {
              ( index === ( facility.length - 1 ) )
              ? ""
              : <Divider />
            }
          </div>
        )
      )
    }
  </div>

};

export default FacilityData;

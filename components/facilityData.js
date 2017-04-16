import React from 'react';
import { Table,
         TableRow,
         TableBody,
         TableRowColumn } from 'material-ui/Table';

const FacilityData = ( { facility } ) => {
  return (
    <Table selectable={ false } >
      <TableBody displayRowCheckbox={ false }
                  showRowHover={ true }
                  stripedRows={ false } >
        { facility.map( ( row, index ) => (
          <TableRow key={ index } >
            <TableRowColumn style={ { whiteSpace: 'pre-line', wordWrap: 'break-word' } } >{ row.label }</TableRowColumn>
            <TableRowColumn style={ { whiteSpace: 'pre-line', wordWrap: 'break-word' } } >{ row.data }</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

export default FacilityData;
import React from 'react';
import { Table,
         TableRow,
         TableBody,
         TableRowColumn } from 'material-ui/Table';

const FacilityInfo = ( { facility } ) => {
  return (
    <Table selectable={ false } >
      <TableBody displayRowCheckbox={ false }
                  showRowHover={ true }
                  stripedRows={ false } >
        { facility.map( ( row, index ) => (
          <TableRow key={ index } >
            <TableRowColumn style={ { whiteSpace: 'pre-line', wordWrap: 'break-word' } } >{ row.name }</TableRowColumn>
            <TableRowColumn style={ { whiteSpace: 'pre-line', wordWrap: 'break-word' } } >{ row.text }</TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

export default FacilityInfo;
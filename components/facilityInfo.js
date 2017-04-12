// To do:
// - Make ./facilityInfo a stateless component
//   - Move the componentDidMount() code to ./googleMap
//   - Instead of sending facility, send tableData to ./facilityInfo

import React from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

export default class FacilityInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: []
    };
  }

  validatePC( pc ) {
    var regEx = /[a-zA-Z][0-9][a-zA-Z] [0-9][a-zA-Z][0-9]/;
    var result = regEx.test( pc )
      ? pc
      : pc.substring(0, 3)+" "+pc.substring(3, 6) ;
    return result.toUpperCase();
  }

  componentWillMount() {
    let tableData = [];

    this.props.facility.NPRI_ID 
    ? tableData.push( { name: "NPRI ID", text: this.props.facility.NPRI_ID } )
    : null ;

    this.props.facility.COMP_NAME 
    ? tableData.push( { name: "Company", text: this.props.facility.COMP_NAME } )
    : null ;

    this.props.facility.FACI_NAME 
    ? tableData.push( { name: "Facility", text: this.props.facility.FACI_NAME } )
    : null ;

    let ADDR_1 = ( this.props.facility.ADDR_1 && this.props.facility.ADDR_2 )
    ? `${ this.props.facility.ADDR_1 }
${ this.props.facility.ADDR_2 }`
    : this.props.facility.ADDR_1
          ? this.props.facility.ADDR_1
          : this.props.facility.ADDR_2
            ? this.props.facility.ADDR_2
            : "" ;

    let ADDR_2 = this.props.facility.CITY
                 ? this.props.facility.PROVINCE
                   ? this.props.facility.POSTAL_CODE
                     ? `${ this.props.facility.CITY }, ${ this.props.facility.PROVINCE } ${ this.validatePC( this.props.facility.POSTAL_CODE ) }`
                     : `${ this.props.facility.CITY }, ${ this.props.facility.PROVINCE }`
                   : this.props.facility.POSTAL_CODE
                     ? `${ this.props.facility.CITY } ${ this.validatePC( this.props.facility.POSTAL_CODE ) }`
                     : `${ this.props.facility.CITY }`
                 : this.props.facility.PROVINCE
                   ? this.props.facility.POSTAL_CODE
                     ? `${ this.props.facility.PROVINCE } ${ this.validatePC( this.props.facility.POSTAL_CODE ) }`
                     : `${ this.props.facility.PROVINCE }`
                   : this.props.facility.POSTAL_CODE
                     ? `${ this.validatePC( this.props.facility.POSTAL_CODE ) }`
                     : "";

    let ADDR = ADDR_1
               ? ADDR_2
                 ? `${ ADDR_1 }
${ ADDR_2 }`
                 : ADDR_1
               : ADDR_2
                 ? ADDR_2
                 : ""

// There are probably much much much better ways of computing ADDR_1, ADDR_2 and ADDR

    if( ADDR ) {
      tableData.push( { name: "Address", text: ADDR } )
    };

    ( this.props.facility.loc.coordinates[0] && this.props.facility.loc.coordinates[1] ) 
    ? tableData.push( { name: "Coordinates", text: `[ ${ this.props.facility.loc.coordinates[1] }, ${ this.props.facility.loc.coordinates[0] } ]` } )
    : null ;

    ( this.props.facility.CSD && this.props.facility.CSD.NAME ) 
    ? tableData.push( { name: "Census Sub-Division", text: this.props.facility.CSD.NAME } )
    : null ;

    (this.props.facility.CMA && this.props.facility.CMA.NAME ) 
    ? tableData.push( { name: "Census Metropolitan Area", text: this.props.facility.CMA.NAME } )
    : null ;

    ( this.props.facility.ER && this.props.facility.ER.NAME ) 
    ? tableData.push( { name: "Economic Region", text: this.props.facility.ER.NAME } )
    : null ;

    ( this.props.facility.KIS && this.props.facility.KIS.NAME_EN ) 
    ? tableData.push( { name: "Industry", text: this.props.facility.KIS.NAME_EN } )
    : null ;

    ( this.props.facility.ECOZONE && this.props.facility.ECOZONE.NAME_EN ) 
    ? tableData.push( { name: "Ecozone", text: this.props.facility.ECOZONE.NAME_EN } )
    : null ;

    ( this.props.facility.MDA && this.props.facility.MDA.NAME_EN ) 
    ? tableData.push( { name: "Major Drainage Area", text: this.props.facility.MDA.NAME_EN } )
    : null ;

    this.setState( { tableData: tableData } );
  }

  render() {
    return <div>

      <Table selectable={ false } >
        <TableBody displayRowCheckbox={ false }
                    showRowHover={ true }
                    stripedRows={ false } >
          { this.state.tableData.map( ( row, index ) => (
            <TableRow key={ index } >
              <TableRowColumn style={ { whiteSpace: 'normal', wordWrap: 'break-word' } } >{ row.name }</TableRowColumn>
              <TableRowColumn style={ { whiteSpace: 'pre-line', wordWrap: 'break-word' } } >{ row.text }</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  }
};
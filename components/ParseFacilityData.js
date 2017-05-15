import FormatPostalCode from './FormatPostalCode';

export default function ParseFacilityData( facility ) {
  let tableData = [];

  [ { name: "NPRI_ID",   label: "NPRI ID"  },
    { name: "COMP_NAME", label: "Company"  },
    { name: "FACI_NAME", label: "Facility" } ]
  .map( (item) => {
    if( facility[ item.name ] ) { tableData.push( { label: item.label, data: facility[ item.name ] } ) }
  } );

  let ADDR_1 = [ facility.ADDR_1, facility.ADDR_2 ].filter( ( item ) => !!item ).join( ", " );

  let ADDR_2 = "";

  if( facility.CITY ) { ADDR_2 += facility.CITY; };

  if( facility.CITY && facility.PROVINCE ) { ADDR_2 += ", "; };

  if( facility.PROVINCE ) { ADDR_2 += facility.PROVINCE; };

  if( facility.POSTAL_CODE && ( facility.CITY || facility.PROVINCE ) ) { ADDR_2 += " "; };

  if( facility.POSTAL_CODE ) { ADDR_2 += FormatPostalCode( facility.POSTAL_CODE ); };

  let ADDR = [ ADDR_1, ADDR_2 ].filter( ( item ) => !!item ).join( "\n" );

  if( ADDR ) {
    tableData.push( { label: "Address", data: ADDR } )
  };

  if ( facility.loc.coordinates[0] && facility.loc.coordinates[1] ) {
    tableData.push( { label: "Coordinates", data: `[ ${ facility.loc.coordinates[1] }, ${ facility.loc.coordinates[0] } ]` } )
  };

  [ { name: "CSD", label: "Census Sub-Division" },
    { name: "CMA", label: "Census Metropolitan Area" },
    { name: "ER",  label: "Economic Region" } ]
  .map( (item) => {
    if( facility[ item.name ] && facility[ item.name ].NAME ) { tableData.push( { label: item.label, data: facility[ item.name ].NAME } ) }
  } );

  [ { name: "KIS",     label: "Industry"            },
    { name: "ECOZONE", label: "Ecozone"             },
    { name: "MDA",     label: "Major Drainage Area" } ]
  .map( (item) => {
    if( facility[ item.name ] && facility[ item.name ].NAME_EN ) { tableData.push( { label: item.label, data: facility[ item.name ].NAME_EN } ) }
  } );

  return tableData;
}

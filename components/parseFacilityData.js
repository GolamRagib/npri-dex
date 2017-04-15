import Postal_Code_6_to_7 from './Postal_Code_6_to_7';

export default function ParseFacilityData( facility ) {
  let tableData = [];

  if( facility.NPRI_ID ) {
    tableData.push( { name: "NPRI ID", text: facility.NPRI_ID } )
  };

  if( facility.COMP_NAME ) {
    tableData.push( { name: "Company", text: facility.COMP_NAME } )
  };

  if( facility.FACI_NAME ) {
    tableData.push( { name: "Facility", text: facility.FACI_NAME } )
  };

  let ADDR_1 = ( facility.ADDR_1 && facility.ADDR_2 )
  ? `${ facility.ADDR_1 }
${ facility.ADDR_2 }`
  : facility.ADDR_1
        ? facility.ADDR_1
        : facility.ADDR_2
          ? facility.ADDR_2
          : "" ;

  let ADDR_2 = facility.CITY
                ? facility.PROVINCE
                  ? facility.POSTAL_CODE
                    ? `${ facility.CITY }, ${ facility.PROVINCE } ${ Postal_Code_6_to_7( facility.POSTAL_CODE ) }`
                    : `${ facility.CITY }, ${ facility.PROVINCE }`
                  : facility.POSTAL_CODE
                    ? `${ facility.CITY } ${ Postal_Code_6_to_7( facility.POSTAL_CODE ) }`
                    : `${ facility.CITY }`
                : facility.PROVINCE
                  ? facility.POSTAL_CODE
                    ? `${ facility.PROVINCE } ${ Postal_Code_6_to_7( facility.POSTAL_CODE ) }`
                    : `${ facility.PROVINCE }`
                  : facility.POSTAL_CODE
                    ? `${ Postal_Code_6_to_7( facility.POSTAL_CODE ) }`
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

  if ( facility.loc.coordinates[0] && facility.loc.coordinates[1] ) {
    tableData.push( { name: "Coordinates", text: `[ ${ facility.loc.coordinates[1] }, ${ facility.loc.coordinates[0] } ]` } )
  };

  if( facility.CSD && facility.CSD.NAME ) {
    tableData.push( { name: "Census Sub-Division", text: facility.CSD.NAME } )
  };

  if(facility.CMA && facility.CMA.NAME ) {
    tableData.push( { name: "Census Metropolitan Area", text: facility.CMA.NAME } )
  };

  if( facility.ER && facility.ER.NAME ) {
    tableData.push( { name: "Economic Region", text: facility.ER.NAME } )
  };

  if( facility.KIS && facility.KIS.NAME_EN ) {
    tableData.push( { name: "Industry", text: facility.KIS.NAME_EN } )
  };

  if( facility.ECOZONE && facility.ECOZONE.NAME_EN ) {
    tableData.push( { name: "Ecozone", text: facility.ECOZONE.NAME_EN } )
  };

  if( facility.MDA && facility.MDA.NAME_EN ) {
    tableData.push( { name: "Major Drainage Area", text: facility.MDA.NAME_EN } )
  };

  return tableData;
}

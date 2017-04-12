export default function Postal_Code_6_to_7( pc ) {
  var regEx = /[a-zA-Z][0-9][a-zA-Z] [0-9][a-zA-Z][0-9]/;
  var result = regEx.test( pc )
    ? pc
    : `${ pc.substring( 0, 3 ) } ${ pc.substring( 3, 6 ) }` ;
  return result.toUpperCase();
}

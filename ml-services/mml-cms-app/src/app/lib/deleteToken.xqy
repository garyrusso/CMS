declare variable $uri as xs:string external;

(:
module namespace token = "http://marklogic.com/ps/custom/deleteToken";
declare namespace rapi = "http://marklogic.com/rest-api";
:)

let $_ := xdmp:document-delete($uri)

return "done"


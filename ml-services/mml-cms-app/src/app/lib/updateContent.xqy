declare namespace mml = "http://macmillanlearning.com";

declare variable $uri as xs:string external;
declare variable $doc external;

(:
module namespace token = "http://marklogic.com/ps/custom/deleteToken";
declare namespace rapi = "http://marklogic.com/rest-api";
:)

let $docOrig := fn:doc($uri)

let $log := xdmp:log(".................. $uri:    "||$uri)
let $log := xdmp:log(".................. title 1: "||$docOrig/mml:content/mml:feed/mml:title/text())
let $log := xdmp:log(".................. title 2: "||$doc/mml:content/mml:feed/mml:title/text())

return
(
  xdmp:node-replace($docOrig/mml:content, $doc/mml:content),
  "done"
)

xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/logout";

import module namespace json = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";

(:
 :)
declare 
%roxy:params("")
function mml:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $token := xdmp:get-request-header("X-Auth-Token")

  let $validSessionDoc :=
    if ($token) then auth:findSessionByToken($token) else ""

  let $username :=
    if ($validSessionDoc) then $validSessionDoc/*:username/text() else ""

  let $_ := xdmp:log("..............logout username = '"||$username||"'")

  let $result :=
    if (fn:string-length($username) gt 0) then
      auth:logout($username)
    else
      <json:object type="object">
        <json:responseCode>400</json:responseCode>
        <json:message>invalid session</json:message>
        <json:authToken>{$token}</json:authToken>
        <json:username>unknown</json:username>
      </json:object>

  let $resultCode := $result/json:responseCode/text()

  let $_ := map:put($context, "output-types", "text/json")
  let $_ := map:put($context, "output-status", ($resultCode, "OK"))

  return
    document {
      json:serialize($result)
    }
};


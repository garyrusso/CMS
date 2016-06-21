xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/login";

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
  let $userInfo := auth:getUserNamePasswordFromBase64String(xdmp:get-request-header("UserInfo"))

  let $log := xdmp:log("................. $username: '"||$userInfo/userName/text()||"'")
  let $log := xdmp:log("................. $password: '"||$userInfo/password/text()||"'")

  let $result := auth:login($userInfo/userName/text(), $userInfo/password/text())

  let $resultCode := $result/json:responseCode/text()

  let $_ := map:put($context, "output-types", "text/json")
  let $_ := map:put($context, "output-status", ($resultCode, "OK"))

  return
    document {
      json:serialize($result)
    }
};


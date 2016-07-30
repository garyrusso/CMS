xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/search";

import module namespace utils = "http://marklogic.com/ps/custom/search-all-rest-utils" at "/app/lib/search-all-rest-utils.xqy";

import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";

declare namespace jn   = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

(:
 :)
declare 
%roxy:params("")
function mml:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $config := json:config("custom")
  
  (: X-Auth-Token Check :)
  let $retObj :=
    if (fn:starts-with(auth:getLoggedInUserFromHeader(), $auth:INVALID-USER)) then
    (
      map:put($context, "output-status", (403, "forbidden")),
      json:transform-to-json(
        element { fn:QName($NS,"mml:status") } { $auth:INVALID-USER }, $config
      )
    )
    else
      utils:getAction($context, $params)

  return
    $retObj
};

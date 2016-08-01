xquery version "1.0-ml";

module namespace mml-api = "http://marklogic.com/rest-api/resource/dictionary";

import module namespace utils = "http://marklogic.com/ps/custom/dictionary-rest-utils" at "/app/lib/dictionary-rest-utils.xqy";
import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mml = "http://macmillanlearning.com"	;

declare variable $NS := "http://macmillanlearning.com";

(:
This API is responsible to get list of dictionary values for a given dictionary type
 Parameters - "dictionaryType=xs:string", "output-format=xs:string" - to support JSON & XML
 :)
declare 
%roxy:params("dictionaryType=xs:string", "output-format=xs:string")
function mml-api:get(
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

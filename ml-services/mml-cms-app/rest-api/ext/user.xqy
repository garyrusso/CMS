xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/user";

import module namespace utils = "http://marklogic.com/ps/custom/user-rest-utils" at "/app/lib/user-rest-utils.xqy";
import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

import module namespace c     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mmlc = "http://macmillanlearning.com";

declare variable $NS := "http://macmillanlearning.com";

(:
 :)
declare 
%roxy:params("q=xs:string", "start=xs:integer", "pageLength=xs:integer")
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
        element { fn:QName($NS,"mmlc:status") } { $auth:INVALID-USER }, $config
      )
    )
    else
      utils:getAction($context, $params)

  return
    $retObj
};

(:
 :)
declare 
%roxy:params("")
function mml:put(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()?
{
  let $config := json:config("custom")
  
  (: X-Auth-Token Check :)
  let $retObj :=
    if (fn:starts-with(auth:getLoggedInUserFromHeader(), $auth:INVALID-USER)) then
    (
      map:put($context, "output-status", (403, "forbidden")),
      json:transform-to-json(
        element { fn:QName($NS,"mmlc:status") } { $auth:INVALID-USER }, $config
      )
    )
    else
      utils:putAction($context, $params, $input)

  return
    $retObj
};

(:
 :)
declare 
%roxy:params("")
%rapi:transaction-mode("update")
function mml:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
  let $config := json:config("custom")
  
  (: X-Auth-Token Check :)
  let $retObj :=
    if (fn:starts-with(auth:getLoggedInUserFromHeader(), $auth:INVALID-USER)) then
    (
      map:put($context, "output-status", (403, "forbidden")),
      json:transform-to-json(
        element { fn:QName($NS,"mmlc:status") } { $auth:INVALID-USER }, $config
      )
    )
    else
      utils:postAction($context, $params, $input)

  return
    $retObj
};

(:
 :)
declare 
%roxy:params("")
function mml:delete(
    $context as map:map,
    $params  as map:map
) as document-node()?
{
  let $config := json:config("custom")
  
  (: X-Auth-Token Check :)
  let $retObj :=
    if (fn:starts-with(auth:getLoggedInUserFromHeader(), $auth:INVALID-USER)) then
    (
      map:put($context, "output-status", (403, "forbidden")),
      json:transform-to-json(
        element { fn:QName($NS,"mmlc:status") } { $auth:INVALID-USER }, $config
      )
    )
    else
      utils:deleteAction($context, $params)

  return
    $retObj
};


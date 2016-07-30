xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/file";

import module namespace utils = "http://marklogic.com/ps/custom/file-rest-utils" at "/app/lib/file-rest-utils.xqy";

import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace admin = "http://marklogic.com/xdmp/admin" at "/MarkLogic/admin.xqy";
      
declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";

declare namespace xdmp = "http://marklogic.com/xdmp";
declare namespace mt   = "http://marklogic.com/xdmp/mimetypes";
declare namespace http = "http://www.w3.org/1999/xhtml";

declare variable $NS := "http://macmillanlearning.com";

declare function mml:type-from-filename($name as xs:string) as xs:string*
{
   let $ext   := fn:tokenize($name, '\.')[fn:last()]
   let $types := admin:mimetypes-get(admin:get-configuration())
   
   return
      $types[mt:extensions/data() = $ext]/mt:name
};

declare function mml:decode-content-type($header as xs:string)
      as xs:string
{
   let $type := normalize-space((substring-before($header, ';'), $header)[. ne ''][1])
      return
         if ( starts-with($type, 'multipart/') ) then
            'MULTIPART'
         else if ( $type eq 'text/html' ) then
            'HTML'
         else if ( ends-with($type, '+xml')
                      or $type eq 'text/xml'
                      or $type eq 'application/xml'
                      or $type eq 'text/xml-external-parsed-entity'
                      or $type eq 'application/xml-external-parsed-entity' ) then
            'XML'
         else if ( starts-with($type, 'text/')
                      or $type eq 'application/x-www-form-urlencoded'
                      or $type eq 'application/xml-dtd' ) then
            'TEXT'
         else
            'BINARY'
};

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

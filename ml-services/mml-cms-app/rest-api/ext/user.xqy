xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/user";

(:
import module namespace json = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
:)
import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace usr   = "http://marklogic.com/roxy/models/user" at "/app/models/user-model.xqy";

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
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (200, "OK")),
  document { "GET called on the ext service extension" }
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
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (201, "Created")),
  document { "PUT called on the ext service extension" }
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
 let $output-types := map:put($context,"output-types","application/xml")

  (: GR001 - Get user id from token :)
  let $userId :=
    if (fn:not(fn:empty(map:get($params, "userid")))) then
      map:get($params, "userid")
    else
      ""

  let $jUserDataDoc :=  document { $input }

  (: Convert json to xml :)
  let $userDoc  := json:transform-from-json($jUserDataDoc)
  
  let $user :=
      element user-profile
      {
        element firstname { $userDoc/*:firstname/text() }, 
        element lastname  { $userDoc/*:lastname/text() }, 
        element username  { $userDoc/*:username/text() }, 
        element password  { $userDoc/*:password/text() },
        element created   { $userDoc/*:created/text() }
      }

(:
  let $doc := tr:createUserDataDoc($client, $user, $templateId, "", $userDataDoc)
:)
  let $doc := usr:save($user)

  let $_ := map:put($context, "output-types", "application/xml")
  let $_ := map:put($context, "output-status", (201, "Created"))
  
  return
    document {
      $user
    }
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
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (200, "OK")),
  document { "DELETE called on the ext service extension" }
};

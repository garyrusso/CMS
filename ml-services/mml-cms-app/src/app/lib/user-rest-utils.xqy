xquery version "1.0-ml";

module namespace userRestLib = "http://marklogic.com/ps/custom/user-rest-utils";

import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";
import module namespace usr    = "http://marklogic.com/roxy/models/user" at "/app/models/user-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function userRestLib:getAction(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $q  := map:get($params, "q")
  let $st := map:get($params, "start")
  let $ps := map:get($params, "pageLength")
  let $ft := map:get($params, "format")

  let $qtext      := if (fn:string-length($q) eq 0)  then "" else $q
  let $start      := if (fn:string-length($st) eq 0) then  1 else xs:integer($st)
  let $pageLength := if (fn:string-length($ps) eq 0) then 10 else xs:integer($ps)
  let $format     := if ($ft eq "json") then "json" else "xml"
  
  let $output-types :=
    if ($format eq "json") then
    (
      map:put($context,"output-types","application/json")
    )
    else
    (
      map:put($context,"output-types","application/xml")
    )

  let $retObj := usr:searchUsers($qtext, $start, $pageLength)

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  let $_ := map:put($config,"array-element-names", xs:QName("mml:result") )

  let $doc :=
    if ($format eq "json") then
    (
      text { json:transform-to-json($retObj, $config) }
    )
    else
    (
      $retObj
    )

  return document { $doc }
};

declare function userRestLib:putAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $inputUri := map:get($params, "uri")
  let $ft := map:get($params, "format")

  let $uri    := if (fn:string-length($inputUri) eq 0)  then "" else $inputUri
  let $format := if ($ft eq "json") then "json" else "xml"
  
  let $output-types :=
    if ($format eq "json") then
    (
      map:put($context,"output-types","application/json")
    )
    else
    (
      map:put($context,"output-types","application/xml")
    )

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
        element email     { $userDoc/*:email/text() }
      }

  let $_ := map:put($context, "output-types", "application/xml")
  let $_ := map:put($context, "output-status", (200, "Updated"))

  let $doc := usr:save($user)

  return
    document {
      $user
    }
};

declare function userRestLib:postAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context,"output-types","application/xml")

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
        element email     { $userDoc/*:email/text() }
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

declare function userRestLib:deleteAction(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $inputUri := map:get($params, "uri")
  let $ft := map:get($params, "format")

  let $uri    := if (fn:string-length($inputUri) eq 0)  then "" else $inputUri
  let $format := if ($ft eq "xml") then "xml" else "json"
  
  let $output-types :=
    if ($format eq "xml") then
    (
      map:put($context,"output-types","application/xml")
    )
    else
    (
      map:put($context,"output-types","application/json")
    )
    
  let $errorMessage :=
    if (fn:string-length($uri) eq 0) then "invalid uri"
    else
      try {
        xdmp:document-delete($uri)
      }
      catch ($e) {
        $e/error:message/text()
      }
      
  let $statusMessage :=
    if (fn:string-length($errorMessage) eq 0) then
      "Document deleted: "||$uri
    else
      $errorMessage||" "||$uri

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )

  let $retObj :=
    element results {
      element { "status" } { $statusMessage }
    }

  let $doc :=
    if ($format eq "xml") then
    (
      $retObj
    )
    else
    (
      text { json:transform-to-json($retObj, $config) }
    )

  let $_ := map:put($context, "output-status", (200, "Deleted"))

  return
    document {
      $doc
    }
};


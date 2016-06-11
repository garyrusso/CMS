xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/user";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";

import module namespace json    = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace usr     = "http://marklogic.com/roxy/models/user" at "/app/models/user-model.xqy";
import module namespace content = "http://marklogic.com/roxy/models/content" at "/app/models/content-model.xqy";

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

  let $retObj := mml:searchUsers($qtext, $start, $pageLength)

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  let $_ := map:put($config,"array-element-names", xs:QName("mmlc:result") )

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

(:
 :)
declare 
%roxy:params("")
function mml:delete(
    $context as map:map,
    $params  as map:map
) as document-node()?
{
  let $inputUri := map:get($params, "uri")
  let $ft := map:get($params, "format")

  let $uri    := if (fn:string-length($inputUri) eq 0)  then "" else $inputUri
  let $format := if ($ft eq "json") then "json" else "xml"
  
  let $statusMessage := "Document deleted: "||$uri
  
  let $output-types :=
    if ($format eq "json") then
    (
      map:put($context,"output-types","application/json")
    )
    else
    (
      map:put($context,"output-types","application/xml")
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

  let $_ := map:put($context, "output-types", "application/xml")
  let $_ := map:put($context, "output-status", (200, "Deleted"))

  let $doc :=
    element results {
      element { "status" } { $statusMessage||"  "||$errorMessage }
    }
  
  return
    document {
      $doc
    }
};

declare function mml:searchUsers($qtext, $start, $pageLength)
{
  let $options :=
        <options xmlns="http://marklogic.com/appservices/search">
          <search-option>filtered</search-option>
          <term>
            <term-option>case-insensitive</term-option>
          </term>
          <additional-query>{cts:collection-query(("user"))}</additional-query>
          <constraint name="username">
            <word>
              <element ns="http://macmillanlearning.com" name="username"/>
            </word>
          </constraint>
          <constraint name="firstname">
            <word>
              <element ns="http://macmillanlearning.com" name="firstName"/>
            </word>
          </constraint>
          <constraint name="lastname">
            <word>
              <element ns="http://macmillanlearning.com" name="lastName"/>
            </word>
          </constraint>
          <transform-results apply="metadata-snippet">
            <preferred-elements>
              <element ns="http://macmillanlearning.com" name="username"/>
              <element ns="http://macmillanlearning.com" name="fullName"/>
              <element ns="http://macmillanlearning.com" name="firstName"/>
              <element ns="http://macmillanlearning.com" name="lastName"/>
              <element ns="http://macmillanlearning.com" name="email"/>
            </preferred-elements>
            <max-matches>2</max-matches>
            <max-snippet-chars>150</max-snippet-chars>
            <per-match-tokens>20</per-match-tokens>
          </transform-results>
          <return-results>true</return-results>
          <return-query>true</return-query>
        </options>
   
  let $statusMessage := "user document found"

  let $results := search:search($qtext, $options, $start, $pageLength)
  
  let $retObj :=
      if (fn:count($results/search:result) ge 1) then
      (
        element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") }    { $statusMessage },
          element { fn:QName($NS,"mml:count") }     { fn:count($results/search:result) },
          for $result in $results/search:result
          return
            element { fn:QName($NS,"mml:result") } {
              element { fn:QName($NS,"mml:uri") }       { xs:string($result/@uri) },
              element { fn:QName($NS,"mml:username") }  { $result/search:snippet/mmlc:username/text() },
              element { fn:QName($NS,"mml:fullName") }  { $result/search:snippet/mmlc:fullName/text() },
              element { fn:QName($NS,"mml:firstName") } { $result/search:snippet/mmlc:firstName/text() },
              element { fn:QName($NS,"mml:lastName") }  { $result/search:snippet/mmlc:lastName/text() },
              element { fn:QName($NS,"mml:email") }     { $result/search:snippet/mmlc:email/text() }
            }
        }
      )
      else
      (
        element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") } { "no users found" }
        }
      )
   
  return $retObj
};

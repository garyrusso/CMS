xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/file";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

import module namespace usr   = "http://marklogic.com/roxy/models/user" at "/app/models/user-model.xqy";
import module namespace fm    = "http://marklogic.com/roxy/models/file" at "/app/models/file-model.xqy";
import module namespace c     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace am    = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mmlc = "http://macmillanlearning.com";

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
  (: Add Auth Token Check here :)

  let $responseCode := xdmp:set-response-code(300, "OK")

  let $q  := map:get($params, "q")
  let $st := map:get($params, "start")
  let $ps := map:get($params, "pageLength")
  let $ft := map:get($params, "format")
  let $tempUri := map:get($params, "uri")

  let $qtext      := if (fn:string-length($q) eq 0)  then "" else $q
  let $uri        := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
  let $start      := if (fn:string-length($st) eq 0) then  1 else xs:integer($st)
  let $pageLength := if (fn:string-length($ps) eq 0) then 10 else xs:integer($ps)
  let $format     := if ($ft eq "xml") then "xml" else "json"

  let $output-types :=
    if (fn:string-length($uri) gt 0) then
    (
      map:put($context,"output-types","application/pdf")
    )
    else
    if ($format eq "json") then
    (
      map:put($context,"output-types","application/json")
    )
    else
    (
      map:put($context,"output-types","application/xml")
    )

  let $retObj :=
    if (fn:string-length($uri) gt 0) then
      fn:doc($uri)
    else
      mml:searchBinaryFiles($qtext, $start, $pageLength)

  let $auditAction :=
    if (fn:string-length($uri) gt 0 and fn:not(fn:empty($retObj))) then
    (
      am:save("downloaded", $uri, "file")
    )
    else
      ""

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  let $_ := map:put($config,"array-element-names", xs:QName("mmlc:uri") )

  let $doc :=
    if ($format eq "json" and fn:string-length($uri) eq 0) then
    (
      text { json:transform-to-json($retObj, $config) }
    )
    else
    (
      $retObj
    )

  return
    document {
      $doc
    }
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
  (: Add Auth Token Check here :)

  let $ft := map:get($params, "format")
  let $fUri := map:get($params, "uri")

  let $uri    := if (fn:string-length($fUri) eq 0) then "" else $fUri
  let $format := if ($ft eq "xml") then "xml" else "json"
  
  let $output-types := map:put($context,"output-types","application/json")
  
  let $file :=  document { $input }
  let $fileSize := xdmp:binary-size($file/binary())

  let $log := xdmp:log("............... file size: "||$fileSize)

  let $doc :=
    if ($fileSize eq 0) then
      "no payload"
    else
    if (fn:string-length($uri) eq 0) then
      "invalid uri"
    else
      fm:saveByUri($uri, $file)

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("updated", $uri, "file")
    else
      ""

  let $_ := map:put($context,"output-types","application/json")
  let $_ := map:put($context, "output-status", (201, "Created"))

  let $retObj :=
    element results {
        element { "status" } { $doc }
      }
  
  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  
  return
    document {
      text { json:transform-to-json($retObj, $config) }    
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
  (: Add Auth Token Check here :)
  
  let $ft := map:get($params, "format")
  let $fn := map:get($params, "fileName")

  let $fileName := if (fn:string-length($fn) eq 0) then "" else $fn
  let $format     := if ($ft eq "xml") then "xml" else "json"
  
  let $output-types := map:put($context,"output-types","application/json")
  
  let $file :=  document { $input }
  let $fileSize := xdmp:binary-size($file/binary())

  let $log := xdmp:log("............... file size: "||$fileSize)

  let $doc :=
    if ($fileSize eq 0) then
      "no payload"
    else
    if (fn:string-length($fileName) eq 0) then
      "invalid filename"
    else
      fm:save($fileName, $file)

  let $auditAction :=
    if (fn:string-length($fileName) gt 0) then
      am:save("created", "/file/"||$fileName, "file")
    else
      ""

  let $_ := map:put($context,"output-types","application/json")
  let $_ := map:put($context, "output-status", (201, "Created"))

  let $retObj :=
    element results {
        element { "status" } { $doc }
      }
  
  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  
  return
    document {
      text { json:transform-to-json($retObj, $config) }    
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
  (: Add Auth Token Check here :)

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

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("deleted", $uri, "file")
    else
      ""

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

declare function mml:searchBinaryFiles($qtext, $start, $pageLength)
{
  let $query := cts:and-query((
                  cts:directory-query("/file/","infinity"),
                  cts:not-query(
                    cts:collection-query("binary")
                  )
                ))

  let $results := cts:search(fn:doc(), $query)

  let $uris := $results/mmlc:fileInfo/mmlc:uri/text()

  let $statusMessage := "file(s) found"

  let $retObj :=
      if (fn:count($uris) ge 1) then
      (
        element { fn:QName($NS,"mml:results") } {
        element { fn:QName($NS,"mml:status") }    { $statusMessage },
        element { fn:QName($NS,"mml:count") }     { fn:count($uris) },
        element { fn:QName($NS,"mml:uris") }
        {
          for $uri in $uris
            return
              element { fn:QName($NS,"mml:uri") } { $uri }
        }
        }
      )
      else
      (
        element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") } { "no files found" }
        }
      )

  return $retObj
};

declare function mml:searchBinaryFilesOrig($qtext, $start, $pageLength)
{
  let $options :=
    <options xmlns="http://marklogic.com/appservices/search">
      <search-option>filtered</search-option>
      <term>
        <term-option>case-insensitive</term-option>
      </term>
      <additional-query>{cts:collection-query(("file"))}</additional-query>
      <return-results>true</return-results>
      <return-query>true</return-query>
    </options>
   
  let $statusMessage := "file found"

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
            element { fn:QName($NS,"mml:uri") }       { xs:string($result/@uri) }
          }
        }
      )
      else
      (
        element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") } { "no files found" }
        }
      )

  return $retObj
};

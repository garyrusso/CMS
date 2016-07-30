xquery version "1.0-ml";

module namespace fileRestLib = "http://marklogic.com/ps/custom/file-rest-utils";

import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";
import module namespace fm     = "http://marklogic.com/roxy/models/file" at "/app/models/file-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function fileRestLib:getAction(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $responseCode := xdmp:set-response-code(300, "OK")

  let $q  := map:get($params, "q")
  let $st := map:get($params, "start")
  let $ps := map:get($params, "pageLength")
  let $ft := map:get($params, "format")
  let $tempUri := map:get($params, "uri")
  
  let $info := if (fn:not(fn:empty(map:get($params, "info")))) then 1 else 0
  let $log := xdmp:log(".................... info: "||$info)

  let $qtext      := if (fn:string-length($q) eq 0)  then "" else $q
  let $uri        := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
  let $start      := if (fn:string-length($st) eq 0) then  1 else xs:integer($st)
  let $pageLength := if (fn:string-length($ps) eq 0) then 10 else xs:integer($ps)
  let $format     := if ($ft eq "xml") then "xml" else "json"

  let $output-types :=
    if (fn:string-length($uri) gt 0 and $info eq 0) then
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
    if (fn:string-length($uri) gt 0 and $info eq 0) then
      fn:doc($uri)
    else
    if (fn:string-length($uri) gt 0 and $info eq 1) then
      fm:getFileInfo($uri)
    else
      fm:searchBinaryFilesByQString($qtext, $start, $pageLength)

  let $auditAction :=
    if ((fn:string-length($uri) gt 0) and ($info eq 0) and (fn:not(fn:empty($retObj)))) then
    (
      am:save("downloaded", $uri, "file")
    )
    else
      ""

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  let $_ :=
    map:put(
      $config, "array-element-names",
      (
        xs:QName("mml:result"),
        xs:QName("mml:auditEntry")
      )
    )

  let $doc :=
    if (($format eq "json" and fn:string-length($uri) eq 0) or ($info eq 1)) then
    (
      text { json:transform-to-json($retObj, $config)/container }
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

declare function fileRestLib:putAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
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

declare function fileRestLib:postAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $ft := map:get($params, "format")
  let $fn := map:get($params, "fileName")

  let $fileName := if (fn:string-length($fn) eq 0) then "" else $fn
  let $format     := if ($ft eq "xml") then "xml" else "json"
  
  let $output-types := map:put($context,"output-types","application/json")
  
  let $file :=  document { $input }

  let $fileSize := xdmp:binary-size($file/binary())
  
  let $log :=
    for $header at $n in xdmp:get-request-header-names()
      order by $header
        return
          xdmp:log($n||" ............... header: "||$header||" --- value: "||xdmp:get-request-header($header))

  let $doc :=
    if ($fileSize eq 0) then
      "no payload"
    else
    if (fn:string-length($fileName) eq 0) then
      "invalid filename"
    else
      fm:save($fileName, $fileSize, $file)

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

declare function fileRestLib:deleteAction(
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
    (
      try {
        let $fileUri := 
          if (fn:string-length($uri) gt 0) then 
            fm:findFileInfoUri($uri)
          else ()
          
        return
        (
          xdmp:document-delete($fileUri),
          xdmp:document-delete($uri)
        )
      }
      catch ($e) {
        $e/error:message/text()
      }
    )
      
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

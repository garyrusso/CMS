xquery version "1.0-ml";

module namespace fm = "http://marklogic.com/roxy/models/file";

import module namespace search  = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace cfg     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace invoke  = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace ch      = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req     = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace auth    = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace json    = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace am      = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";

declare namespace cts    = "http://marklogic.com/cts";
declare namespace mml    = "http://macmillanlearning.com";

declare option xdmp:mapping "false";

declare variable $NS := "http://macmillanlearning.com";

declare variable $SEARCH-OPTIONS :=
  <options xmlns="http://marklogic.com/appservices/search">
    <return-query>1</return-query>
  </options>;

declare function fm:getContentUri($hash)
{
  let $uri := fn:concat("/content/", $hash, "/")
  
  return $uri
};

declare function fm:save($fileName as xs:string, $fileSize as xs:unsignedLong, $file)
{
  (
    fm:_save($fileName, $fileSize, $file),
    "File Successfully Saved: "||"/file/"||$fileName
  )
};

declare function fm:_save($fileName as xs:string, $fileSize as xs:unsignedLong, $doc)
{
(:
  let $hashedDir := xdmp:hash64($content/mml:feed/mml:title/text())
  let $log := xdmp:log("......... hash: "||$hashedDir)
:)
  let $uri := "/file/"||$fileName
  
  let $loggedInUser := auth:getFullName(auth:getLoggedInUserFromHeader())
  let $currentDateTime := fn:current-dateTime()

  (: check if file already exists :)

  let $infoDoc :=
    element { fn:QName($NS,"mml:fileInfo") } {
      element { fn:QName($NS,"mml:objectType") } { "File" },
      element { fn:QName($NS,"mml:fileName") }   { $fileName },
      element { fn:QName($NS,"mml:size") }       { $fileSize },
      element { fn:QName($NS,"mml:uri") }        { $uri },
      element { fn:QName($NS,"mml:created")}     { $currentDateTime },
      element { fn:QName($NS,"mml:createdBy") }  { $loggedInUser },
      element { fn:QName($NS,"mml:modified") }   { $currentDateTime },
      element { fn:QName($NS,"mml:modifiedBy") } { $loggedInUser }
    }

  let $infoUri := "/file/"||xdmp:hash64($infoDoc)||".xml"

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           declare variable $infoUri external;
           declare variable $infoDoc external;
           xdmp:document-insert($uri, $doc, xdmp:default-permissions(), ("file", "binary")),
           xdmp:document-insert($infoUri, $infoDoc, xdmp:default-permissions(), ("file"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("doc"), $doc, xs:QName("infoUri"), $infoUri, xs:QName("infoDoc"), $infoDoc)
    )
};

declare function fm:saveByUri($uri as xs:string, $file)
{
  (
    fm:_saveByUri($uri, $file),
    "File Successfully Saved: "||$uri
  )
};

declare function fm:_saveByUri($uri as xs:string, $doc)
{
  (: check if file already exists :)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           xdmp:document-insert($uri, $doc, xdmp:default-permissions(), ("file"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("doc"), $doc)
    )
};

declare function fm:delete($uri)
{
  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           xdmp:document-delete($uri)'
        )
  return
  (
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri)
    ),
    fn:concat("file Successfully Deleted: ", $uri)
  )
};

declare function fm:search($type)
{
  fm:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function fm:invoke($function, $params)
{
  invoke:invoke(
    $function,
    "http://marklogic.com/roxy/lib/profile/user", 
    "/app/lib/profile-user.xqy", 
    $params,
    fn:true(),
    xdmp:database-name(xdmp:database())
  )
};

declare function fm:searchBinaryFiles($qtext, $start, $pageLength)
{
  let $query := cts:and-query((
                  cts:directory-query("/file/","infinity"),
                  cts:not-query(
                    cts:collection-query("binary")
                  )
                ))

  let $results := cts:search(fn:doc(), $query)

  let $uris := $results/mml:fileInfo/mml:uri/text()

  let $statusMessage := "file(s) found"

  let $retObj :=
      element { fn:QName($NS,"mml:container") } {
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
      }

  return $retObj
};

declare function fm:getFileInfo($uri)
{
  let $query := cts:and-query((
                    cts:collection-query("file"),
                    cts:element-value-query(fn:QName($NS, "uri"), $uri)
                  ))
  
  let $result := cts:search(fn:doc(), $query)[1]

  let $fileInfo :=
    if (fn:not(fn:empty($result))) then
      element { fn:QName($NS,"mml:fileInfo") } {
        element { fn:QName($NS,"mml:fileName") }   { $result/mml:fileInfo/mml:fileName/text() },
        element { fn:QName($NS,"mml:size") }       { $result/mml:fileInfo/mml:size/text() },
        element { fn:QName($NS,"mml:uri") }        { $result/mml:fileInfo/mml:uri/text() },
        element { fn:QName($NS,"mml:created") }    { $result/mml:fileInfo/mml:created/text() },
        element { fn:QName($NS,"mml:createdBy") }  { $result/mml:fileInfo/mml:createdBy/text() },
        element { fn:QName($NS,"mml:modified") }   { $result/mml:fileInfo/mml:modified/text() },
        element { fn:QName($NS,"mml:modifiedBy") } { $result/mml:fileInfo/mml:modifiedBy/text() }
      }
      else
      (
        element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") } { "no files found" }
        }
      )

  let $auditDoc := 
    if (fn:not(fn:empty($result))) then am:getAuditInfo($uri) else ()

  let $retObj :=
        element { fn:QName($NS,"mml:container") }
        {
          $fileInfo,
          $auditDoc
        }

  return $retObj
};

declare function fm:findFileInfoUri($fileUri as xs:string)
{
  let $query := cts:and-query((
                   cts:collection-query("file"),
                   cts:element-value-query(fn:QName($NS, "uri"), $fileUri)
                 ))
 
  let $uri := cts:uris("/file/", (), $query)[1]

  return $uri
};

declare function fm:searchBinaryFilesByQString($qtext, $start, $pageLength)
{
  let $options :=
    <options xmlns="http://marklogic.com/appservices/search">
      <search-option>filtered</search-option>
      <term>
        <term-option>case-insensitive</term-option>
      </term>
      <additional-query>
        <cts:and-query xmlns:cts="http://marklogic.com/cts">
          <cts:collection-query>
            <cts:uri>file</cts:uri>
          </cts:collection-query>
          <cts:not-query>
            <cts:collection-query>
              <cts:uri>binary</cts:uri>
            </cts:collection-query>
          </cts:not-query>
        </cts:and-query>
      </additional-query>
      <constraint name="filename">
        <word>
          <element ns="http://macmillanlearning.com" name="fileName"/>
        </word>
      </constraint>
      <transform-results apply="metadata-snippet">
        <preferred-elements>
          <element ns="http://macmillanlearning.com" name="fileName"/>
          <element ns="http://macmillanlearning.com" name="uri"/>
          <element ns="http://macmillanlearning.com" name="size"/>
        </preferred-elements>
        <max-matches>2</max-matches>
        <max-snippet-chars>150</max-snippet-chars>
        <per-match-tokens>20</per-match-tokens>
      </transform-results>
      <return-results>true</return-results>
      <return-query>true</return-query>
    </options>
   
  let $statusMessage := "file found"

  let $results := search:search($qtext, $options, $start, $pageLength)

  let $retObj :=
      element { fn:QName($NS,"mml:container") }
      {
        if (fn:count($results/search:result) ge 1) then
        (
          element { fn:QName($NS,"mml:results") } {
          element { fn:QName($NS,"mml:status") }    { $statusMessage },
          element { fn:QName($NS,"mml:count") }     { fn:count($results/search:result) },
          for $result in $results/search:result
            return
              element { fn:QName($NS,"mml:result") } {
              element { fn:QName($NS,"mml:fileName") }  { $result/search:snippet/mml:fileName/text() },
              element { fn:QName($NS,"mml:uri") }       { $result/search:snippet/mml:uri/text() },
              element { fn:QName($NS,"mml:size") }      { $result/search:snippet/mml:size/text() }
            }
          }
        )
        else
        (
          element { fn:QName($NS,"mml:results") } {
            element { fn:QName($NS,"mml:status") } { "no files found" }
          }
        )
      }

  return $retObj
};

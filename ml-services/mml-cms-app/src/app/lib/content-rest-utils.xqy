xquery version "1.0-ml";

module namespace contentRestLib = "http://marklogic.com/ps/custom/content-rest-utils";

import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";
import module namespace cm     = "http://marklogic.com/roxy/models/content" at "/app/models/content-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function contentRestLib:getAction(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $q    := map:get($params, "q")
  let $st   := map:get($params, "start")
  let $ps   := map:get($params, "pageLength")
  let $ft   := map:get($params, "format")
  let $sort := map:get($params, "sort")
  let $tempUri := map:get($params, "uri")

  let $qtext      := if (fn:string-length($q) eq 0)  then "" else $q
  let $uri        := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
  let $start      := if (fn:string-length($st) eq 0) then  1 else xs:integer($st)
  let $pageLength := if (fn:string-length($ps) eq 0) then 10 else xs:integer($ps)
  let $sortBy     := if (fn:string-length($sort) eq 0) then "relevance" else $sort
  let $format     := if ($ft eq "xml") then "xml" else "json"

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore")
  let $_ :=
    map:put(
      $config, "array-element-names",
      (
        xs:QName("mml:creator"),
        xs:QName("mml:subjectHeading"),
        xs:QName("mml:subjectKeyword"),
        xs:QName("mml:contentResourceType"),
        xs:QName("mml:project"),
        xs:QName("mml:auditEntry"),
        xs:QName("mml:result"),
        xs:QName("mml:facet"),
        xs:QName("mml:facetValues"),
        xs:QName("mml:value")
      )
    )

  let $output-types :=
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
    (
      let $contentDoc := fn:doc($uri)

      let $auditDoc := am:getAuditInfo($uri)
	  
  	  let $prjTitle := $contentDoc/mml:content/mml:metadata/mml:projects/mml:project/text()
  	  
  	  let $contentDocs := cm:findProjectDocsByProjectTitle($prjTitle)
	  
      let $preDoc :=
        element { fn:QName($NS,"mml:container") }
        {
          $contentDoc/mml:content/mml:metadata/mml:systemId,
          $contentDoc/mml:content/mml:metadata/mml:created,
          $contentDoc/mml:content/mml:metadata/mml:modified,
          $contentDoc/mml:content/mml:metadata/mml:createdBy,
          $contentDoc/mml:content/mml:metadata/mml:modifiedBy,
          $contentDoc/mml:content/mml:feed/mml:title,
          $contentDoc/mml:content/mml:feed/mml:description,
          $contentDoc/mml:content/mml:feed/mml:contentState,
          $contentDoc/mml:content/mml:feed/mml:source,
          $contentDoc/mml:content/mml:feed/mml:publisher,
          $contentDoc/mml:content/mml:feed/mml:datePublished,
          $contentDoc/mml:content/mml:feed/mml:contentResourceTypes/mml:contentResourceType,
          $contentDoc/mml:content/mml:feed/mml:technical/mml:fileFormat,
          $contentDoc/mml:content/mml:feed/mml:technical/mml:fileName,
          $contentDoc/mml:content/mml:feed/mml:technical/mml:filePath,
          $contentDoc/mml:content/mml:feed/mml:technical/mml:fileSize,
          $contentDoc/mml:content/mml:feed/mml:creators/mml:creator,
          $contentDoc/mml:content/mml:metadata/mml:subjectHeadings/mml:subjectHeading,
          $contentDoc/mml:content/mml:metadata/mml:subjectKeywords/mml:subjectKeyword,
          $auditDoc,
          for $content in $contentDocs
      			return
      			  element { fn:QName($NS,"mml:project") } { $content/* }
        }

      let $doc :=
        if (fn:doc-available($uri)) then
        (
          json:transform-to-json($preDoc, $config)/container
        )
        else
          json:transform-to-json(
            element { fn:QName($NS,"mml:status") } { "no document found having uri: "||$uri }, $config
          )

      return $doc
    )
    else
      cm:searchContentDocs($qtext, $start, $pageLength, $sortBy)

	let $_ := map:put($context, "output-status", (200, "fetched"))

  return
    document {
      if ($format eq "json" and fn:string-length($uri) eq 0) then
      (
        text { json:transform-to-json($retObj, $config) }
      )
      else
      (
        $retObj
      )
    }
};

declare function contentRestLib:putAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $ft := map:get($params, "format")
  let $tempUri := map:get($params, "uri")

  let $uri        := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
  let $format     := if ($ft eq "json") then "json" else "xml"
  
  let $output-types := map:put($context,"output-types","application/json")

  let $jContentDoc :=  document { $input }

  (: Convert json to xml :)
  let $contentDoc  := json:transform-from-json($jContentDoc)
  
  let $contentObj :=
        element content
        {
          element meta {
            element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
            element projectState { $contentDoc/jn:meta/jn:projectState/text() },
            element subjectHeadings {
              for $subjectHeading in $contentDoc/jn:meta/jn:subjectHeadings/jn:item/text()
                return
                  element subjectHeading { $subjectHeading }
            },
            element subjectKeywords {
              for $subjectKeyword in $contentDoc/jn:meta/jn:subjectKeywords/jn:item/text()
                return
                  element subjectKeyword { $subjectKeyword }
            },
            element projects {
              for $project in $contentDoc/jn:meta/jn:projects/jn:item/text()
                return
                  element project { $project }
            }
          },
          element feed {
            element title { $contentDoc/jn:feed/jn:title/text() }, 
            element description { $contentDoc/jn:feed/jn:description/text() },
            element source { $contentDoc/jn:feed/jn:source/text() },
            element publisher { $contentDoc/jn:feed/jn:publisher/text() },
            element datePublished { $contentDoc/jn:feed/jn:datePublished/text() },
            element contentState { $contentDoc/jn:feed/jn:contentState/text() },
            element creators {
              for $creator in $contentDoc/jn:feed/jn:creators/jn:item/text()
                return
                  element creator { $creator }
            },
            element contentResourceTypes {
              for $resource in $contentDoc/jn:feed/jn:contentResourceTypes/jn:item/text()
                return
                  element contentResourceType { $resource }
            },			
            element technical {
              element fileFormat { $contentDoc/jn:feed/jn:technical/jn:fileFormat/text() },
              element fileName   { $contentDoc/jn:feed/jn:technical/jn:fileName/text() },
              element filePath   { $contentDoc/jn:feed/jn:technical/jn:filePath/text() },
              element fileSize   { $contentDoc/jn:feed/jn:technical/jn:fileSize/text() }
          }
        }
      }

  let $status :=
    if (fn:string-length($uri) gt 0) then
      cm:update($uri, $contentObj)
    else
      "invalid uri"

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("updated", $uri, "content")
    else
      ""

  let $retObj :=
    element results {
        element { "status" } { $status }
      }
  
  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )

  let $_ := map:put($context, "output-types", "application/json")
  let $_ := map:put($context, "output-status", (201, "Updated"))

  return
    document {
      text { json:transform-to-json($retObj, $config) }    
    }
};

declare function contentRestLib:postAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context,"output-types","application/json")

  let $jContentDoc :=  document { $input }

  (: Convert json to xml :)
  let $contentDoc  := json:transform-from-json($jContentDoc)
  
  let $contentObj :=
        element content
        {
          element meta {
            element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
            element projectState { $contentDoc/jn:meta/jn:projectState/text() },
            element subjectHeadings {
              for $subjectHeading in $contentDoc/jn:meta/jn:subjectHeadings/jn:item/text()
                return
                  element subjectHeading { $subjectHeading }
            },
            element subjectKeywords {
              for $subjectKeyword in $contentDoc/jn:meta/jn:subjectKeywords/jn:item/text()
                return
                  element subjectKeyword { $subjectKeyword }
            },
            element projects {
              for $project in $contentDoc/jn:meta/jn:projects/jn:item/text()
                return
                  element project { $project }
            }
          },
          element feed {
            element title { $contentDoc/jn:feed/jn:title/text() }, 
            element description { $contentDoc/jn:feed/jn:description/text() },
            element source { $contentDoc/jn:feed/jn:source/text() },
            element publisher { $contentDoc/jn:feed/jn:publisher/text() },
            element datePublished { $contentDoc/jn:feed/jn:datePublished/text() },
            element contentState { $contentDoc/jn:feed/jn:contentState/text() },
            element creators {
              for $creator in $contentDoc/jn:feed/jn:creators/jn:item/text()
                return
                  element creator { $creator }
            },
            element contentResourceTypes {
              for $resource in $contentDoc/jn:feed/jn:contentResourceTypes/jn:item/text()
                return
                  element contentResourceType { $resource }
            },
            element technical {
              element fileFormat { $contentDoc/jn:feed/jn:technical/jn:fileFormat/text() },
              element fileName   { $contentDoc/jn:feed/jn:technical/jn:fileName/text() },
              element filePath   { $contentDoc/jn:feed/jn:technical/jn:filePath/text() },
              element fileSize   { $contentDoc/jn:feed/jn:technical/jn:fileSize/text() }
          }
        }
      }

  let $uri := "/content/"||xdmp:hash64($contentDoc)||".xml"

  let $doc := cm:save($uri, $contentObj)

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("created", $uri, "content")
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

declare function contentRestLib:deleteAction(
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
        cm:updateContentState($uri, "inactive")
      }
      catch ($e) {
        $e/error:message/text()
      }
      
  let $statusMessage :=
    if (fn:string-length($errorMessage) eq 0) then
      "Document status was updated to inactive: "||$uri
    else
      $errorMessage||" "||$uri

  let $auditAction :=
    if (fn:string-length($uri) gt 0 and fn:doc($uri)) then
      am:save("marked inactive", $uri, "content")
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


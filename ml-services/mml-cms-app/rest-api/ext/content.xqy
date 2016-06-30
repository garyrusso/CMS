xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/content";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";

import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace usr   = "http://marklogic.com/roxy/models/user" at "/app/models/user-model.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace cm    = "http://marklogic.com/roxy/models/content" at "/app/models/content-model.xqy";
import module namespace c     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace am    = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mmlc = "http://macmillanlearning.com";
declare namespace jn   = "http://marklogic.com/xdmp/json/basic";

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

  let $q  := map:get($params, "q")
  let $st := map:get($params, "start")
  let $ps := map:get($params, "pageLength")
  let $ft := map:get($params, "format")
  let $tempUri := map:get($params, "uri")

  let $qtext      := if (fn:string-length($q) eq 0)  then "" else $q
  let $uri        := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
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
    
  let $retObj :=
    if (fn:string-length($uri) gt 0) then
    (
      let $contentDoc := fn:doc($uri)
      let $projects :=
        element { fn:QName($NS,"mml:projects") }
        {
          element { fn:QName($NS,"mml:project") } { "project 1" },
          element { fn:QName($NS,"mml:project") } { "project 2" }
        }

      let $doc1 :=
        element { fn:QName($NS,"mmlc:container") }
        {
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:systemId,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:technical/mmlc:fileSize,
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:created,
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:modified,
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:createdBy,
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:modifiedBy,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:title,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:description,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:contentState,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:source,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:publisher,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:datePublished,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:contentResourceTypes/mmlc:contentResourceType,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:technical/mmlc:fileFormat,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:technical/mmlc:fileName,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:technical/mmlc:filePath,
          $contentDoc/mmlc:content/mmlc:feed/mmlc:technical/mmlc:fileSize
        }

      let $config1 := json:config("custom")
      let $_ := map:put($config1, "whitespace", "ignore")
      let $_ := map:put($config1, "array-element-names", xs:QName("mmlc:contentResourceType") ) 

      let $config2 := json:config("custom")
      let $_ := map:put($config2, "whitespace", "ignore")
      let $_ := map:put($config2,"array-element-names", xs:QName("mmlc:creator") ) 
      let $doc2 := 
        element { fn:QName($NS,"mmlc:container") }
        {
          $contentDoc/mmlc:content/mmlc:feed/mmlc:creators/mmlc:creator
        }
      
      let $config3 := json:config("custom")
      let $_ := map:put($config3, "whitespace", "ignore")
      let $_ := map:put($config3,"array-element-names", xs:QName("mmlc:subjectHeading") ) 
      let $doc3 := 
        element { fn:QName($NS,"mmlc:container") }
        {
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:subjectHeadings/mmlc:subjectHeading
        }
      
      let $config4 := json:config("custom")
      let $_ := map:put($config4, "whitespace", "ignore")
      let $_ := map:put($config4,"array-element-names", xs:QName("mmlc:subjectKeyword") ) 
      let $doc4 := 
        element { fn:QName($NS,"mmlc:container") }
        {
          $contentDoc/mmlc:content/mmlc:metadata/mmlc:subjectKeywords/mmlc:subjectKeyword
        }
        
      let $auditDoc := am:getAuditInfo($uri)
      
      let $config5 := json:config("custom")
      let $_ := map:put($config5, "whitespace", "ignore")
      let $_ := map:put($config5, "array-element-names", xs:QName("mmlc:auditEntry"))
        
      let $node1 := 
          text { json:transform-to-json($doc1, $config1)/container }||
          text { json:transform-to-json($doc2, $config2)/container }||
          text { json:transform-to-json($doc3, $config3)/container }||
          text { json:transform-to-json($doc4, $config4)/container }||
          text { json:transform-to-json($auditDoc, $config5) }
      
      let $temp :=
        if (fn:doc-available($uri)) then
        (
          json:transform-to-json($doc1, $config1)/container,
          json:transform-to-json($doc2, $config2)/container,
          json:transform-to-json($doc3, $config3)/container,
          json:transform-to-json($doc4, $config4)/container,
          json:transform-to-json($auditDoc, $config5)
        )
        else
          json:transform-to-json(
            element { fn:QName($NS,"mmlc:status") } { "no document found having uri: "||$uri }, $config1
          )

      let $object := json:object()
      
      let $_ := map:put($object,"container",$temp)

      return
        xdmp:to-json($object)
          (:
        document {
          json:transform-to-json($doc1, $config1)/container,
          json:transform-to-json($doc2, $config2)/container,
          json:transform-to-json($doc3, $config3)/container,
          json:transform-to-json($doc4, $config4)/container
          json:transform-to-json($auditDoc, $config5)
        }
          :)
    )
    else
      mml:searchContentDocs($qtext, $start, $pageLength)

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("downloaded", $uri, "content")
    else
      ""

  let $doc :=
    if ($format eq "json" and fn:string-length($uri) eq 0) then
    (
      let $config := json:config("custom")
      let $_ := map:put($config, "whitespace", "ignore")
      let $_ := map:put($config, "array-element-names", xs:QName("mmlc:result") ) 

      return
        document {
          text { json:transform-to-json($retObj, $config) }
        }
    )
    else
    (
      document {
        $retObj
      }
    )

  return
    $doc
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
            element resources {
              for $resource in $contentDoc/jn:feed/jn:resources/jn:item/text()
                return
                  element resource { $resource }
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
      am:save("deleted", $uri, "content")
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

declare function mml:searchContentDocs($qtext, $start, $pageLength)
{
  let $options :=
    <options xmlns="http://marklogic.com/appservices/search">
      <search-option>filtered</search-option>
      <term>
        <term-option>case-insensitive</term-option>
      </term>
      <additional-query>{cts:collection-query(("content"))}</additional-query>
      <constraint name="title">
        <word>
          <element ns="http://macmillanlearning.com" name="title"/>
        </word>
      </constraint>
      <constraint name="publisher">
        <word>
          <element ns="http://macmillanlearning.com" name="publisher"/>
        </word>
      </constraint>
      <constraint name="systemId">
        <word>
          <element ns="http://macmillanlearning.com" name="systemId"/>
        </word>
      </constraint>
	  <constraint name="Keywords">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="subjectKeyword" />
			 <facet-option>limit=5</facet-option>
		  </range>
	   </constraint>
	   <constraint name="Subjects">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="subjectHeading" />
			 <facet-option>limit=5</facet-option>
		  </range>          
	  </constraint>
	   <constraint name="Title">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="title" />
			 <facet-option>limit=5</facet-option>
		  </range>          
	  </constraint>
	   <constraint name="Project State">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="projectState" />
			 <facet-option>limit=5</facet-option>
		  </range>          
	  </constraint>  	  
      <transform-results apply="metadata-snippet">
        <preferred-elements>
          <element ns="http://macmillanlearning.com" name="systemId"/>
          <element ns="http://macmillanlearning.com" name="projectState"/>
          <element ns="http://macmillanlearning.com" name="title"/>
          <element ns="http://macmillanlearning.com" name="description"/>
          <element ns="http://macmillanlearning.com" name="publisher"/>
          <element ns="http://macmillanlearning.com" name="contentState"/>
          <element ns="http://macmillanlearning.com" name="modified"/>		  
          <element ns="http://macmillanlearning.com" name="fileFormat"/>
          <element ns="http://macmillanlearning.com" name="fileName"/>
          <element ns="http://macmillanlearning.com" name="filePath"/>
          <element ns="http://macmillanlearning.com" name="fileSize"/>
          <element ns="http://macmillanlearning.com" name="creators"/>
          <element ns="http://macmillanlearning.com" name="subjectHeadings"/>
          <element ns="http://macmillanlearning.com" name="subjectKeywords"/>
          <element ns="http://macmillanlearning.com" name="projects"/>
          <element ns="http://macmillanlearning.com" name="resources"/>
        </preferred-elements>
        <max-matches>2</max-matches>
        <max-snippet-chars>150</max-snippet-chars>
        <per-match-tokens>20</per-match-tokens>
      </transform-results>
      <return-results>true</return-results>
      <return-query>true</return-query>
    </options>
   
  let $statusMessage := "content document found"

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
            element { fn:QName($NS,"mml:uri") }          { xs:string($result/@uri) },
            element { fn:QName($NS,"mml:systemId") }     { $result/search:snippet/mmlc:systemId/text() },
            element { fn:QName($NS,"mml:title") }        { $result/search:snippet/mmlc:title/text() },
            element { fn:QName($NS,"mml:description") }  { $result/search:snippet/mmlc:description/text() },
            element { fn:QName($NS,"mml:projectState") } { $result/search:snippet/mmlc:projectState/text() },
      			element { fn:QName($NS,"mml:modified") }     { $result/search:snippet/mmlc:modified/text() },
            element { fn:QName($NS,"mml:publisher") }    { $result/search:snippet/mmlc:publisher/text() },
            element { fn:QName($NS,"mml:contentState") } { $result/search:snippet/mmlc:contentState/text() },
            element { fn:QName($NS,"mml:fileFormat") }   { $result/search:snippet/mmlc:fileFormat/text() },
            element { fn:QName($NS,"mml:fileName") }     { $result/search:snippet/mmlc:fileName/text() },
            element { fn:QName($NS,"mml:filePath") }     { $result/search:snippet/mmlc:filePath/text() },
            element { fn:QName($NS,"mml:fileSize") }     { $result/search:snippet/mmlc:fileSize/text() },
            element { fn:QName($NS,"mml:creators") }     {
              for $creator in $result/search:snippet/mmlc:creators/mmlc:creator/text()
                return
                  element { fn:QName($NS,"mml:creator") } { $creator }
            },
            element { fn:QName($NS,"mml:subjectHeadings") }     {
              for $subjectHeading in $result/search:snippet/mmlc:subjectHeadings/mmlc:subjectHeading/text()
                return
                  element { fn:QName($NS,"mml:subjectHeading") } { $subjectHeading }
            },
            element { fn:QName($NS,"mml:subjectKeywords") }     {
              for $subjectKeyword in $result/search:snippet/mmlc:subjectKeywords/mmlc:subjectKeyword/text()
                return
                  element { fn:QName($NS,"mml:subjectKeyword") } { $subjectKeyword }
            },
            element { fn:QName($NS,"mml:projects") }     {
              for $project in $result/search:snippet/mmlc:hasProjects/mmlc:project/text()
                return
                  element { fn:QName($NS,"mml:project") } { $project }
            },
            element { fn:QName($NS,"mml:resources") }     {
              for $resource in $result/search:snippet/mmlc:resources/mmlc:resource/text()
                return
                  element { fn:QName($NS,"mml:resource") } { $resource }
            }
          },
          for $facet in $results/search:facet
            return
              element { fn:QName($NS,"mml:facets") }
              {
                element { fn:QName($NS, "mml:facetName") } { xs:string($facet/@name) }, 
                for $facet-value in $facet/search:facet-value
                  return 
                    element { fn:QName($NS, "mml:facet-values") }
                    {
                      element { fn:QName($NS,"mml:name") } { $facet-value/text() },
                      element { fn:QName($NS,"mml:count") } { xs:string($facet-value/@count) }
                    }
              }
            }
          )
          else
          (
            element { fn:QName($NS,"mml:results") } {
              element { fn:QName($NS,"mml:status") } { "no content docs found" }
            }
          )

  return $retObj
};

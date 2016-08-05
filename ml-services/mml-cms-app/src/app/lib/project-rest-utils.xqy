xquery version "1.0-ml";

module namespace projectRestLib = "http://marklogic.com/ps/custom/project-rest-utils";

import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";
import module namespace pm     = "http://marklogic.com/roxy/models/project" at "/app/models/project-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function projectRestLib:getAction(
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
  let $start      := if (fn:string-length($st) eq 0) then 1 else xs:integer($st)
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
        xs:QName("mml:content"),
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
      let $projectDoc := fn:doc($uri)
      
		  let $contentDocs := pm:findContentDocsByProjectTitle($projectDoc/mml:project/mml:feed/mml:title/text())
		
      let $preDoc :=
        element { fn:QName($NS,"mml:container") }
        {
          $projectDoc/mml:project/mml:feed/mml:systemId,
          $projectDoc/mml:project/mml:feed/mml:projectUri,
          $projectDoc/mml:project/mml:feed/mml:title,
          $projectDoc/mml:project/mml:feed/mml:description,
          $projectDoc/mml:project/mml:metadata/mml:created,
          $projectDoc/mml:project/mml:metadata/mml:modified,
          $projectDoc/mml:project/mml:metadata/mml:createdBy,
          $projectDoc/mml:project/mml:metadata/mml:modifiedBy,
          $projectDoc/mml:project/mml:metadata/mml:projectState,
          $projectDoc/mml:project/mml:metadata/mml:subjectHeadings/mml:subjectHeading,
          $projectDoc/mml:project/mml:metadata/mml:subjectKeywords/mml:subjectKeyword,
          for $content in $contentDocs
      			return
      			  element { fn:QName($NS,"mml:content") } { $content/* }
        }
        
      let $doc :=
        if (fn:doc-available($uri)) then
        (
          if ($format eq "json") then $preDoc else fn:doc($uri)
        )
        else
        element { fn:QName($NS,"mml:container") }
        {
          element { fn:QName($NS,"mml:results") }
          {
            element { fn:QName($NS,"mml:status") } { "no document found having uri: "||$uri }
          }
        }

      return $doc
		)
		else
		(
      pm:searchProjectDocs($qtext, $start, $pageLength, $sortBy)
		)

	let $_ := map:put($context, "output-status", (200, "fetched"))

 	return
    document {
      if ($format eq "json") then
      (
        if (fn:string-length($uri) gt 0) then
          json:transform-to-json($retObj, $config)/container
        else
          json:transform-to-json($retObj, $config)
      )
      else  (: xml :)
      (
        if (fn:starts-with($retObj/mml:results/mml:status/text(), "no document")) then
          $retObj/mml:results
        else
          $retObj
      )
    }
};

declare function projectRestLib:putAction(
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

  let $jProjectDoc :=  document { $input }
  
	(: Convert json to xml :)
	let $projectDoc  := json:transform-from-json($jProjectDoc)

	let $projectObj :=
		element project
		{
			element systemId        { $projectDoc/jn:systemId/text() }, 
			element projectUri      { $projectDoc/jn:projectUri/text() },
			element title           { $projectDoc/jn:title/text() }, 
			element description     { $projectDoc/jn:description/text() },
			element projectState    { $projectDoc/jn:projectState/text() },
			element subjectHeadings {
		  for $subjectHeading in $projectDoc/jn:subjectHeadings/jn:item/text()
				return
				  element subjectHeading { $subjectHeading }
			},
			element subjectKeywords {
		  for $subjectKeyword in $projectDoc/jn:subjectKeywords/jn:item/text()
				return
				  element subjectKeyword { $subjectKeyword }
			}
		}

  let $status :=
    if (fn:string-length($uri) gt 0) then
      pm:update($uri, $projectObj)
    else
      "invalid uri"

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("updated", $uri, "project")
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

declare function projectRestLib:postAction(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context,"output-types","application/json")

  let $jProjectDoc :=  document { $input }
  
	(: Convert json to xml :)
	let $projectDoc  := json:transform-from-json($jProjectDoc)

	let $projectObj :=
		element project
		{
			element systemId        { $projectDoc/jn:systemId/text() }, 
			element projectUri      { $projectDoc/jn:projectUri/text() },
			element title           { $projectDoc/jn:title/text() }, 
			element description     { $projectDoc/jn:description/text() },
			element projectState    { $projectDoc/jn:projectState/text() },
			element subjectHeadings {
			  for $subjectHeading in $projectDoc/jn:subjectHeadings/jn:item/text()
				return
				  element subjectHeading { $subjectHeading }
			},
			element subjectKeywords {
			  for $subjectKeyword in $projectDoc/jn:subjectKeywords/jn:item/text()
				return
				  element subjectKeyword { $subjectKeyword }
			}
		}

  let $uri := "/project/"||xdmp:hash64($projectObj)||".xml"
  let $doc := pm:save($uri, $projectObj)

  let $auditAction :=
    if (fn:string-length($uri) gt 0) then
      am:save("created", $uri, "project")
    else
      ""

	let $returnObj :=
		element results {
			element { "status" } { $doc }
		  }

	let $ft := map:get($params, "format")
	let $format := if ($ft eq "xml") then "xml" else "json"

	let $output-types :=
		if ($format eq "json") then
		(
		  map:put($context,"output-types","application/json")
		)
		else
		(
		  map:put($context,"output-types","application/xml")
		)

	let $config := json:config("custom")
	let $_ := map:put($config, "whitespace", "ignore" )
	let $_ := map:put($context, "output-status", (201, "Created"))

	let $result := 
		if ($format eq "json" ) then
		(
			text { json:transform-to-json($returnObj, $config) }
		)
		else 
			$returnObj	
	return
		document { $result }    
};

declare function projectRestLib:deleteAction(
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
        pm:updateProjecState($uri, "deleted")
      }
      catch ($e) {
        $e/error:message/text()
      }
      
  let $statusMessage :=
    if (fn:string-length($errorMessage) eq 0) then
      "Document marked deleted: "||$uri
    else
      $errorMessage||" "||$uri

  let $auditAction :=
    if (fn:string-length($uri) gt 0 and fn:doc($uri)) then
      am:save("marked deleted", $uri, "project")
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

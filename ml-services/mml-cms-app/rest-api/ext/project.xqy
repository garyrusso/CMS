xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/project";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

import module namespace pm    = "http://marklogic.com/roxy/models/project" at "/app/models/project-model.xqy";
import module namespace am    = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mmlc = "http://macmillanlearning.com";
declare namespace jn   = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";


(:
	API to Get Project content by passing URI 
:)
declare 
%roxy:params("uri=xs:anyURI", "format=xs:string", "st=xs:int", "pl=xs:int")
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
  let $format     := if ($ft eq "xml") then "xml" else "json"

  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore")
  let $_ :=
    map:put(
      $config, "array-element-names",
      (
        xs:QName("mmlc:creator"),
        xs:QName("mmlc:subjectHeading"),
        xs:QName("mmlc:subjectKeyword"),
        xs:QName("mmlc:contentResourceType"),
        xs:QName("mmlc:project"),
        xs:QName("mmlc:content"),
        xs:QName("mmlc:auditEntry"),
        xs:QName("mmlc:result"),
        xs:QName("mmlc:facet"),
        xs:QName("mmlc:facetValues"),
        xs:QName("mmlc:value")
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
		
      let $preDoc :=
        element { fn:QName($NS,"mmlc:container") }
        {
          $projectDoc/mmlc:project/mmlc:feed/mmlc:systemId,
          $projectDoc/mmlc:project/mmlc:feed/mmlc:projectUri,
          $projectDoc/mmlc:project/mmlc:feed/mmlc:title,
          $projectDoc/mmlc:project/mmlc:feed/mmlc:description,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:created,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:modified,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:createdBy,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:modifiedBy,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:projectState,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:subjectHeadings/mmlc:subjectHeading,
          $projectDoc/mmlc:project/mmlc:metadata/mmlc:subjectKeywords/mmlc:subjectKeyword
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
      mml:searchProjectDocs($qtext, $start, $pageLength)
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
        if (fn:starts-with($retObj/mmlc:results/mmlc:status/text(), "no document")) then
          $retObj/mmlc:results
        else
          $retObj
      )
    }
};

(:
  API to update existing Project document by passing URI and project metadata
:)
declare 
%roxy:params("uri=xs:anyURI", "format=xs:string")
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
  API to create a new Project document
:)
declare 
%roxy:params("format=xs:string")
%rapi:transaction-mode("update")
function mml:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
  (: Check Auth Token here :)
  
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

(:
  API to delete a project document - update project status
:)
declare 
%roxy:params("uri=xs:anyURI", "format=xs:string")
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
        pm:updateProjecState($uri, "inactive")
      }
      catch ($e) {
        $e/error:message/text()
      }
      
  let $statusMessage :=
    if (fn:string-length($errorMessage) eq 0) then
      "Document marked inactive: "||$uri
    else
      $errorMessage||" "||$uri

  let $auditAction :=
    if (fn:string-length($uri) gt 0 and fn:doc($uri)) then
      am:save("marked inactive", $uri, "project")
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

declare function mml:findContentDocsByProjectTitle($projectTitle as xs:string)
{
  let $query := cts:and-query((
                    cts:collection-query("content"),
                    cts:element-value-query(fn:QName($NS, "project"), $projectTitle)
                  ))

  let $results := cts:search(fn:doc(), $query)

  let $contentDocs :=
    for $result in $results
      return
   			element { fn:QName($NS,"mml:content") } {
          element { fn:QName($NS,"mml:systemId") }     { $result/mmlc:content/mmlc:metadata/mmlc:systemId/text() },
          element { fn:QName($NS,"mml:projectUri") }   { $result/mmlc:content/mmlc:feed/mmlc:source/text() },
          element { fn:QName($NS,"mml:createdBy") }    { $result/mmlc:content/mmlc:metadata/mmlc:createdBy/text() },
          element { fn:QName($NS,"mml:created") }      { $result/mmlc:content/mmlc:metadata/mmlc:created/text() },
          element { fn:QName($NS,"mml:modifiedBy") }   { $result/mmlc:content/mmlc:metadata/mmlc:modifiedBy/text() },
          element { fn:QName($NS,"mml:modified") }     { $result/mmlc:content/mmlc:metadata/mmlc:modified/text() },
          element { fn:QName($NS,"mml:projectState") } { $result/mmlc:content/mmlc:metadata/mmlc:projectState/text() },
          element { fn:QName($NS,"mml:title") }        { $result/mmlc:content/mmlc:feed/mmlc:title/text() }
        }

  return $contentDocs
};

declare function mml:searchProjectDocs($qtext as xs:string, $start, $pageLength)
{
	let $options :=
	<options xmlns="http://marklogic.com/appservices/search">
	  <search-option>filtered</search-option>
	  <term>
		<term-option>case-insensitive</term-option>
	  </term>
    <additional-query>{cts:collection-query(("project"))}</additional-query>
    <constraint name="title">
      <word>
        <element ns="http://macmillanlearning.com" name="title"/>
      </word>
    </constraint>
    <constraint name="keyword">
      <word>
        <element ns="http://macmillanlearning.com" name="subjectKeyword"/>
      </word>
    </constraint>
    <constraint name="heading">
      <word>
        <element ns="http://macmillanlearning.com" name="subjectHeading"/>
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
		  <element ns="http://macmillanlearning.com" name="projectUri"/>
		  <element ns="http://macmillanlearning.com" name="projectState"/>
		  <element ns="http://macmillanlearning.com" name="title"/>
		  <element ns="http://macmillanlearning.com" name="description"/>
		  <element ns="http://macmillanlearning.com" name="subjectHeadings"/>
		  <element ns="http://macmillanlearning.com" name="subjectKeywords"/>
		  <element ns="http://macmillanlearning.com" name="createdBy"/>
		  <element ns="http://macmillanlearning.com" name="modifiedBy"/>
		  <element ns="http://macmillanlearning.com" name="created"/>
		  <element ns="http://macmillanlearning.com" name="modified"/>
		</preferred-elements>
		<max-matches>2</max-matches>
		<max-snippet-chars>150</max-snippet-chars>
		<per-match-tokens>20</per-match-tokens>
	  </transform-results>
	  <return-results>true</return-results>
	  <return-facets>true</return-facets>
	  <return-query>true</return-query>
	</options>

	let $statusMessage := "Project document found"

	let $results := search:search($qtext, $options, $start, $pageLength)

(:
  let $content1 :=
        element { fn:QName($NS,"mml:content") }
        {
          element { fn:QName($NS,"mml:createdBy") } { "Brian Cross" },
          element { fn:QName($NS,"mml:modifiedBy") } { "Brian Cross" },
          element { fn:QName($NS,"mml:title") } { "Content-1 Title" }
        }
:)

	let $retObj :=
	  if (fn:count($results/search:result) ge 1) then
	  (
  		element { fn:QName($NS,"mml:results") } {
  		element { fn:QName($NS,"mml:status") }     { $statusMessage },
  		element { fn:QName($NS,"mml:count") }      { xs:string($results/@total) },
  		element { fn:QName($NS,"mml:start") }      { xs:string($results/@start) },
  		element { fn:QName($NS,"mml:pageLength") } { xs:string($results/@page-length) },
  		for $result in $results/search:result
  		  let $contentDocs := mml:findContentDocsByProjectTitle($result/search:snippet/mmlc:title/text())
  		  return
    			element { fn:QName($NS,"mml:result") } {
      			element { fn:QName($NS,"mml:uri") }           { xs:string($result/@uri) },
      			element { fn:QName($NS,"mml:systemId") }      { $result/search:snippet/mmlc:systemId/text() },
      			element { fn:QName($NS,"mml:projectUri") }    { $result/search:snippet/mmlc:projectUri/text() },
      			element { fn:QName($NS,"mml:title") }         { $result/search:snippet/mmlc:title/text() },
      			element { fn:QName($NS,"mml:description") }   { $result/search:snippet/mmlc:description/text() },
      			element { fn:QName($NS,"mml:projectState") }  { $result/search:snippet/mmlc:projectState/text() },
      			element { fn:QName($NS,"mml:created") }       { $result/search:snippet/mmlc:created/text() },
      			element { fn:QName($NS,"mml:createdBy") }     { $result/search:snippet/mmlc:createdBy/text() },
      			element { fn:QName($NS,"mml:modified") }      { $result/search:snippet/mmlc:modified/text() },
      			element { fn:QName($NS,"mml:modifiedBy") }    { $result/search:snippet/mmlc:modifiedBy/text() },
        	  for $subjectHeading in $result/search:snippet/mmlc:subjectHeadings/mmlc:subjectHeading/text()
      				return
      				  element { fn:QName($NS,"mml:subjectHeading") } { $subjectHeading },
            for $subjectKeyword in $result/search:snippet/mmlc:subjectKeywords/mmlc:subjectKeyword/text()
              return
                element { fn:QName($NS,"mml:subjectKeyword") } { $subjectKeyword },
        	  for $content in $contentDocs
      				return
      				  element { fn:QName($NS,"mml:content") } { $content/* }
  		  },
        element { fn:QName($NS,"mml:facets") }
        {
          for $facet in $results/search:facet
            return
              element { fn:QName($NS, "mml:facet") } {
                element { fn:QName($NS, "mml:facetName") } { $facet/@name/fn:string() },
                for $value in $facet/search:facet-value
                  return 
                    element { fn:QName($NS, "mml:facetValues") }
                    {
                      element { fn:QName($NS,"mml:name") } { $value/text() },
                      element { fn:QName($NS,"mml:count") } { xs:string($value/@count) }
                    }
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

xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/project";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace json  = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

import module namespace pm    = "http://marklogic.com/roxy/models/project" at "/app/models/project-model.xqy";

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
  
	let $st := map:get($params, "start")
	let $pl := map:get($params, "pageLength")
 	let $tempUri := map:get($params, "uri")
	let $ft := map:get($params, "format")
	
	let $uri := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
	let $start := if ($st eq "")  then 1 else $st
	let $pageLength := if ($pl eq "") then xs:int(20) else $pl
	
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
	
	let $doc := 
		if (fn:string-length($uri) ne 0) then
		(
			pm:get-document($uri)
		)
		else 
		(
			mml:searchProjectDocs($start, $pageLength)
		)

	(: Custom JSON configurator to support nested array elements :)
	let $config := json:config("custom")
	let $_ := map:put($config, "whitespace", "ignore" )

	let $_ :=
		if (fn:string-length($uri) ne 0) then
		(
			map:put($config, "array-element-names", "content")
		)
		else
		(
			map:put($config, "element-namespace", "http://macmillanlearning.com"),
			map:put($config, "array-element-names", ("result", "facets","facet-values","subjectHeading","subjectKeyword") )
		)

	let $_ := map:put($context, "output-status", (200, "fetched"))

	let $result := 
		if ($format eq "json" ) then
		(
			text { json:transform-to-json($doc, $config) }
		)
		else 
			$doc

	return
		document { $result }  	
		
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
    let $tempUri := map:get($params, "uri")
   
    let $uri := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
   
	let $ft := map:get($params, "format")

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
   
	let $inputDoc := document { $input }
   
	(: Convert input json to xml for processing :)
	let $contentDoc  := json:transform-from-json($inputDoc)

	let $newContentObj :=
		element project
		{
		  element metadata {
				element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
				element createdBy { $contentDoc/jn:meta/jn:createdBy/text() },
				element modifiedBy { $contentDoc/jn:meta/jn:modifiedBy/text() },
				element title { $contentDoc/jn:meta/jn:title/text() }, 
				element description { $contentDoc/jn:meta/jn:description/text() },
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
				}			
		  }  
		}  
 
	let $status :=
		if (fn:string-length($uri) gt 0) then
		  pm:update($uri, $newContentObj)
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

	let $result :=
		if ($format eq "json") then 
		(
			text { json:transform-to-json($retObj, $config) }
		)
		else
			$retObj
	
	
	return
		document { $result }   

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
  
	let $ft := map:get($params, "format")
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

	let $jContentDoc :=  document { $input }

	(: Convert json to xml :)
	let $contentDoc  := json:transform-from-json($jContentDoc)

	let $contentObj :=
		element project
		{
		  element metadata {
				element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
				element createdBy { $contentDoc/jn:meta/jn:createdBy/text() },
				element modifiedBy { $contentDoc/jn:meta/jn:createdBy/text() },
				element title { $contentDoc/jn:meta/jn:title/text() }, 
				element description { $contentDoc/jn:meta/jn:description/text() },
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
				}			
		  }  
		}

	let $doc := pm:save($contentObj)

	let $returnObj :=
		element results {
			element { "status" } { $doc }
		  }

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

	let $tempUri := map:get($params, "uri")
	let $ft := map:get($params, "format")
	
	let $uri := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
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
	
	let $status := 
		if (fn:string-length($uri) ne 0) then
		(
			pm:delete($uri)
		)
		else "Invalid URI"
	
	let $returnObject := 
		element results {
			element { "status" } { $status }
		}
	
	let $config := json:config("custom")
	let $_ := map:put($config, "whitespace", "ignore" )
	let $_ := map:put($context, "output-status", (200, "Deleted"))

	let $result := 
		if ($format eq "json" ) then
		(
			text { json:transform-to-json($returnObject, $config) }
		)
		else 
			$returnObject	
	
	return
		document { $result }  	

};

declare function mml:searchProjectDocs($start, $pageLength)
{
	let $options :=
	<options xmlns="http://marklogic.com/appservices/search">
	  <search-option>filtered</search-option>
	  <term>
		<term-option>case-insensitive</term-option>
	  </term>
	  <additional-query>{cts:and-query((cts:directory-query("/project/", "infinity")))}</additional-query>
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

	let $results := search:search("", $options, $start, $pageLength)

	let $retObj :=
	  if (fn:count($results/search:result) ge 1) then
	  (
		element { fn:QName($NS,"mml:results") } {
		element { fn:QName($NS,"mml:status") }    { $statusMessage },
		element { fn:QName($NS,"mml:count") }     { xs:string($results/@total) },
		element { fn:QName($NS,"mml:start") } { xs:string($results/@start) },
		element { fn:QName($NS,"mml:pageLength") } { xs:string($results/@page-length) },
		for $result in $results/search:result
		  return
			element { fn:QName($NS,"mml:result") } {
			element { fn:QName($NS,"mml:uri") }       { xs:string($result/@uri) },
			element { fn:QName($NS,"mml:systemId") }  { $result/search:snippet/mmlc:systemId/text() },
			element { fn:QName($NS,"mml:title") } { $result/search:snippet/mmlc:title/text() },
			element { fn:QName($NS,"mml:description") }  { $result/search:snippet/mmlc:description/text() },
			element { fn:QName($NS,"mml:projectState") }  { $result/search:snippet/mmlc:projectState/text() },
			element { fn:QName($NS,"mml:created") }  { $result/search:snippet/mmlc:created/text() },
			element { fn:QName($NS,"mml:createdBy") }  { $result/search:snippet/mmlc:createdBy/text() },
			element { fn:QName($NS,"mml:modified") }  { $result/search:snippet/mmlc:modified/text() },
			element { fn:QName($NS,"mml:modifiedBy") }  { $result/search:snippet/mmlc:modifiedBy/text() },
			element { fn:QName($NS,"mml:subjectHeadings") }     {
			  for $subjectHeading in $result/search:snippet/mmlc:subjectHeadings/mmlc:subjectHeading/text()
				return
				  element { fn:QName($NS,"mml:subjectHeading") } { $subjectHeading }
			},
			element { fn:QName($NS,"mml:subjectKeywords") }     {
			  for $subjectKeyword in $result/search:snippet/mmlc:subjectKeywords/mmlc:subjectKeyword/text()
				return
				  element { fn:QName($NS,"mml:subjectKeyword") } { $subjectKeyword }
			}
		  },
		  for $facet in $results/search:facet
			return
				 element { fn:QName($NS,"mml:facets") } {
					element { fn:QName($NS, "mml:facetName") } { xs:string($facet/@name) }, 
					for $facet-value in $facet/search:facet-value
					return 
					  element { fn:QName($NS, "mml:facet-values") }  {
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

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
%roxy:params("uri=xs:anyURI", "format=xs:string")
function mml:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
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
	
	let $doc := 
		if (fn:string-length($uri) ne 0) then
		(
			pm:get-document($uri)
		)
		else "Invalid URI"

	(: Custom JSON configurator to support nested array elements :)
	let $config := json:config("custom")
	let $_ := map:put($config, "whitespace", "ignore" )
	let $_ := map:put($config, "array-element-names", "content")

	let $_ := map:put($context, "output-status", (200, "fetched"))

	let $result := 
		if ($format eq "json" ) then
		(
			text { json:transform-to-json($doc, $config) }
		)
		else 
			$doc
	let $log := xdmp:log("format....." || $format)
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
			element administrative {
				element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
				element createdBy { $contentDoc/jn:meta/jn:createdBy/text() },
				element modifiedBy { $contentDoc/jn:meta/jn:modifiedBy/text() }
			},
			element descriptive {
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
			element administrative {
				element systemId     { $contentDoc/jn:meta/jn:systemId/text() }, 
				element createdBy { $contentDoc/jn:meta/jn:createdBy/text() },
				element modifiedBy { $contentDoc/jn:meta/jn:createdBy/text() }
			},
			element descriptive {
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

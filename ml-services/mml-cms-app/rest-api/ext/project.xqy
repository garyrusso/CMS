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
API to Get Project content
 :)
declare 
%roxy:params("")
function mml:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  (: Add Auth Token Check here :)
  
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (200, "OK")),
  document { "GET called on the ext service extension" }
};

(:
  API to update existing Project document by passing URI and project metadata
:)
declare 
%roxy:params("uri=xs:anyURI")
function mml:put(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()?
{
  (: Add Auth Token Check here :)
   let $tempUri := map:get($params, "uri")
   
   let $uri := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
   
   let $output-types := map:put($context,"output-types","application/json")
   
   let $inputDoc := document { $input }
   
   (: Convert json to xml :)
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

	return
		document {
		  text { json:transform-to-json($retObj, $config) }    
	}   

};

(:
  API to create a new Project document
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
  (: Check Auth Token here :)
  
  let $output-types := map:put($context,"output-types","application/json")

  let $userId :=
    if (fn:not(fn:empty(map:get($params, "userid")))) then
      map:get($params, "userid")
    else
      ""

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

  let $_ := map:put($context, "output-types", "application/xml")
  let $_ := map:put($context, "output-status", (201, "Created"))
  
  let $returnObj :=
    element results {
        element { "status" } { $doc }
      }
  
  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  
  return
    document {
      text { json:transform-to-json($returnObj, $config) }    
    }  
  
};

(:
  API to delete a project document - update project status
:)
declare 
%roxy:params("uri=xs:anyURI")
function mml:delete(
    $context as map:map,
    $params  as map:map
) as document-node()?
{
  (: Add Auth Token Check here :)

	let $tempUri := map:get($params, "uri")
	
	let $uri := if (fn:string-length($tempUri) eq 0) then "" else $tempUri
	
	let $output-types := map:put($context, "output-types", "application-json")
	
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

	let $_ := map:put($context, "output-types", "application/json")
	let $_ := map:put($context, "output-status", (200, "Deleted"))

	return
		document {
		  text { json:transform-to-json($returnObject, $config) }    
	}  	

};

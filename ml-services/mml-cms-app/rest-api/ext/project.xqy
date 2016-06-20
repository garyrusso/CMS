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
 : To add parameters to the functions, specify them in the params annotations.
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") mml:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :
 : To report errors in your extension, use fn:error(). For details, see
 : http://docs.marklogic.com/guide/rest-dev/extensions#id_33892, but here's
 : an example from the docs:
 : fn:error(
 :   (),
 :   "RESTAPI-SRVEXERR",
 :   ("415","Raven","nevermore"))
 :)

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
  
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (200, "OK")),
  document { "GET called on the ext service extension" }
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
  
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (201, "Created")),
  document { "PUT called on the ext service extension" }
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
          element meta {
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
  
  return
    document {
      $contentObj
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
  
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (200, "OK")),
  document { "DELETE called on the ext service extension" }
};

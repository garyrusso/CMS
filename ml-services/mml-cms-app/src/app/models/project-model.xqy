xquery version "1.0-ml";

module namespace project = "http://marklogic.com/roxy/models/project";

import module namespace cfg     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace invoke  = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace ch      = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req     = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace auth    = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace json    = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace tools   = "http://marklogic.com/ps/custom/common-tools" at "/app/lib/common-tools.xqy";

declare namespace search = "http://marklogic.com/appservices/search";
declare namespace cts    = "http://marklogic.com/cts";
declare namespace mml    = "http://macmillanlearning.com";

declare option xdmp:mapping "false";

declare variable $NS := "http://macmillanlearning.com";

declare variable $SEARCH-OPTIONS :=
  <options xmlns="http://marklogic.com/appservices/search">
    <return-query>1</return-query>
  </options>;

declare function project:getContentUri($hash)
{
  let $uri := fn:concat("/project/", $hash, "/")
  
  return $uri
};

declare function project:save($content)
{
  (
    project:_save(
      element {fn:QName($NS,"mml:project")}
      {
        element {fn:QName($NS,"metadata")}
        {
			  element {fn:QName($NS,"systemId")}     { $content/metadata/systemId/text() },
			  element {fn:QName($NS,"created")}      { fn:current-dateTime() },
			  element {fn:QName($NS,"createdBy")}    { $content/metadata/createdBy/text() },
			  element {fn:QName($NS,"modified")}     { fn:current-dateTime() },
			  element {fn:QName($NS,"modifiedBy")}   { $content/metadata/modifiedBy/text() },
			  element {fn:QName($NS,"objectType")}   { "Project" },
			  element {fn:QName($NS,"title")}         { $content/metadata/title/text() },
			  element {fn:QName($NS,"description")}   { $content/metadata/description/text() },
			  element {fn:QName($NS,"subjectHeadings")} {
				for $subjectHeading in $content/metadata/subjectHeadings/subjectHeading/text()
				  return
					element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
			  },
			  element {fn:QName($NS,"subjectKeywords")} {
				for $subjectKeyword in $content/metadata/subjectKeywords/subjectKeyword/text()
				  return
					element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
			  },			  
			  element {fn:QName($NS,"projectState")} { $content/metadata/projectState/text() }
		}
	   }
    ),
    fn:concat("Project Successfully Saved: ", $content/metadata/title/text())
  )
};

declare function project:_save($content)
{
  let $hashedDir := xdmp:hash64($content/mml:metadata/mml:title/text())
  (: let $log := xdmp:log("......... hash: "||$hashedDir) :)

  let $uri := "/project/"||$hashedDir||".xml"

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $content external;
           xdmp:document-insert($uri, $content, xdmp:default-permissions(), ("project"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("content"), $content)
    )
};

declare function project:update($uri as xs:string, $content)
{
	let $log := xdmp:log( "URI of existing document...." || $uri)
	
	let $isDocExists := fn:doc-available($uri)
	
	(: Don't change created by value -  :)
	let $createdBy := 
		if ($isDocExists) then ( 
			 fn:doc($uri)/mml:project/mml:metadata/mml:createdBy/text()
		)
		else "webuser"
			
		(: Construct new document from input payload :)
		let $newDoc :=
		  document {
			  element {fn:QName($NS,"mml:project")}
			  {
				element {fn:QName($NS,"metadata")}
				{
				  element {fn:QName($NS,"systemId")}     { $content/metadata/systemId/text() },
				  element {fn:QName($NS,"created")}      { fn:current-dateTime() },
				  element {fn:QName($NS,"createdBy")}    { $createdBy },
				  element {fn:QName($NS,"modified")}     { fn:current-dateTime() },
				  element {fn:QName($NS,"modifiedBy")}   { $content/metadata/modifiedBy/text() },
				  element {fn:QName($NS,"objectType")}   { "Project" },
				  element {fn:QName($NS,"title")}         { $content/metadata/title/text() },
				  element {fn:QName($NS,"description")}   { $content/metadata/description/text() },
				  element {fn:QName($NS,"subjectHeadings")} {
					for $subjectHeading in $content/metadata/subjectHeadings/subjectHeading/text()
					  return
						element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
				  },
				  element {fn:QName($NS,"subjectKeywords")} {
					for $subjectKeyword in $content/metadata/subjectKeywords/subjectKeyword/text()
					  return
						element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
				  },			  
				  element {fn:QName($NS,"projectState")} { $content/metadata/projectState/text() }
				}
			   }
		   }
	let $status := 
		if ($isDocExists) then
		(
			project:_update($uri, $newDoc), 
			fn:concat("Project document updated successfully")
		)
		else "Invalid URI"

	return $status

};


declare function project:_update($uri as xs:string, $newDoc)
{
  let $doc := fn:doc($uri)
  let $log := xdmp:log(".................. $uri:    "||$uri)
  let $log := xdmp:log(".................. $title old doc....:    "||$doc/mml:project/mml:metadata/mml:title/text())
  let $log := xdmp:log(".................. $title new doc....:    "||$newDoc/mml:project/mml:metadata/mml:title/text())
  
  return xdmp:node-replace($doc/mml:project, $newDoc/mml:project)
};


declare function project:delete($uri as xs:string)
{
  let $doc := fn:doc($uri)
  let $old-status := $doc/mml:project/mml:metadata/mml:projectState
  
  let $log := xdmp:log(".................. $uri:    "||$uri)
  let $log := xdmp:log(".................. $status old doc....:    "|| $old-status/text())
  
  let $inactive := "Inactive"
  let $new-status :=  element {fn:QName($NS,"mml:projectState")} { $inactive }
  
  return (xdmp:node-replace($doc/$old-status, $new-status), fn:concat("Project ", $uri ," soft deleted"))
};


declare function project:get-document($uri as xs:string)
{
  let $log := xdmp:log(".................. $uri:    "||$uri)
  let $projectDocument := fn:doc($uri)
  let $project-title := $projectDocument/mml:project/mml:metadata/mml:title/text()

  (: Query to get associated content :)
  let $query := 
		cts:and-query((
			cts:directory-query("/content/", "infinity"),
			cts:element-value-query(
				fn:QName($NS, "project"), $project-title, ("exact")
			)
		))
  
  let $associated-contents := cts:search(fn:doc(), $query)
   
   
  let $resultDocument := 
        element project
        {
          element metadata {
				element systemId     { $projectDocument/mml:project/mml:metadata/mml:systemId/text() }, 
				element createdBy { $projectDocument/mml:project/mml:metadata/mml:createdBy/text() },
				element created { $projectDocument/mml:project/mml:metadata/mml:created/text() },
				element modifiedBy { $projectDocument/mml:project/mml:metadata/modifiedBy/text() },
				element modified { $projectDocument/mml:project/mml:metadata/mml:modified/text() },
				element title { $projectDocument/mml:project/mml:metadata/mml:title/text() }, 
				element description { $projectDocument/mml:project/mml:metadata/description/text() },
				element projectState { $projectDocument/mml:project/mml:metadata/mml:projectState/text() },
				element subjectHeadings {
				  for $subjectHeading in $projectDocument/mml:project/mml:metadata/mml:subjectHeadings/mml:subjectHeading/text()
					return
					  element subjectHeading { $subjectHeading }
				},
				element subjectKeywords {
				  for $subjectKeyword in $projectDocument/mml:project/mml:metadata/mml:subjectKeywords/mml:subjectKeyword/text()
					return
					  element subjectKeyword { $subjectKeyword }
				}
			},				
			element contents {
				 for $content in $associated-contents 
				 return 
				   element content {
					   element title { $content//mml:title/text() },
					   element uri { fn:base-uri($content) },
					   element objectType { $content//mml:objectType/text() },
					   element modified { $content//mml:modified/text() },
					   element createdBy { $content//mml:createdBy/text() },
					   element modifiedBy { $content//mml:modifiedBy/text() }
				   }
		    
		    }
         }
  
  return $resultDocument
};
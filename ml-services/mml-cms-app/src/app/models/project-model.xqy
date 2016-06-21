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
			element {fn:QName($NS, "administrative")}
			{
			  element {fn:QName($NS,"systemId")}     { $content/metadata/administrative/systemId/text() },
			  element {fn:QName($NS,"created")}      { fn:current-dateTime() },
			  element {fn:QName($NS,"createdBy")}    { $content/metadata/administrative/createdBy/text() },
			  element {fn:QName($NS,"modified")}     { fn:current-dateTime() },
			  element {fn:QName($NS,"modifiedBy")}   { $content/metadata/administrative/modifiedBy/text() },
			  element {fn:QName($NS,"objectType")}   { "Project" }
        }
,
			element {fn:QName($NS,"descriptive")}
			{
			  element {fn:QName($NS,"title")}         { $content/metadata/descriptive/title/text() },
			  element {fn:QName($NS,"description")}   { $content/metadata/descriptive/description/text() },
			  element {fn:QName($NS,"subjectHeadings")} {
				for $subjectHeading in $content/metadata/descriptive/subjectHeadings/subjectHeading/text()
				  return
					element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
			  },
			  element {fn:QName($NS,"subjectKeywords")} {
				for $subjectKeyword in $content/metadata/descriptive/subjectKeywords/subjectKeyword/text()
				  return
					element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
			  },			  
			  element {fn:QName($NS,"projectState")} { $content/metadata/descriptive/projectState/text() }
			}
			}
	   }
    ),
    fn:concat("Project Successfully Saved: ", $content/metadata/descriptive/title/text())
  )
};

declare function project:_save($content)
{
  let $hashedDir := xdmp:hash64($content/mml:metadata/mml:descriptive/mml:title/text())
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
			 fn:doc($uri)/mml:project/mml:metadata/mml:administrative/mml:createdBy/text()
		)
		else "webuser"
			
		(: Construct new document from input payload :)
		let $newDoc :=
		  document {
			  element {fn:QName($NS,"mml:project")}
			  {
				element {fn:QName($NS,"metadata")}
				{
					element {fn:QName($NS, "administrative")}
					{
					  element {fn:QName($NS,"systemId")}     { $content/metadata/administrative/systemId/text() },
					  element {fn:QName($NS,"created")}      { fn:current-dateTime() },
					  element {fn:QName($NS,"createdBy")}    { $createdBy },
					  element {fn:QName($NS,"modified")}     { fn:current-dateTime() },
					  element {fn:QName($NS,"modifiedBy")}   { $content/metadata/administrative/modifiedBy/text() },
					  element {fn:QName($NS,"objectType")}   { "Project" }
					},
					element {fn:QName($NS,"descriptive")}
					{
					  element {fn:QName($NS,"title")}         { $content/metadata/descriptive/title/text() },
					  element {fn:QName($NS,"description")}   { $content/metadata/descriptive/description/text() },
					  element {fn:QName($NS,"subjectHeadings")} {
						for $subjectHeading in $content/metadata/descriptive/subjectHeadings/subjectHeading/text()
						  return
							element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
					  },
					  element {fn:QName($NS,"subjectKeywords")} {
						for $subjectKeyword in $content/metadata/descriptive/subjectKeywords/subjectKeyword/text()
						  return
							element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
					  },			  
					  element {fn:QName($NS,"projectState")} { $content/metadata/descriptive/projectState/text() }
					}
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
  let $log := xdmp:log(".................. $title old doc....:    "||$doc/mml:project/mml:metadata/mml:descriptive/mml:title/text())
  let $log := xdmp:log(".................. $title new doc....:    "||$newDoc/mml:project/mml:metadata/mml:descriptive/mml:title/text())
  
  return xdmp:node-replace($doc/mml:project, $newDoc/mml:project)
};


declare function project:delete($uri as xs:string)
{
  let $doc := fn:doc($uri)
  let $old-status := $doc/mml:project/mml:metadata/mml:descriptive/mml:projectState
  
  let $log := xdmp:log(".................. $uri:    "||$uri)
  let $log := xdmp:log(".................. $status old doc....:    "|| $old-status/text())
  
  let $inactive := "Inactive"
  let $new-status :=  element {fn:QName($NS,"mml:projectState")} { $inactive }
  
  return (xdmp:node-replace($doc/$old-status, $new-status),"Project soft deleted")
};
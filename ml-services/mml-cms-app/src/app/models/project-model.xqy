xquery version "1.0-ml";

module namespace project = "http://marklogic.com/roxy/models/project";

import module namespace search  = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace cfg     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace invoke  = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace ch      = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req     = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace auth    = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace json    = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace tools   = "http://marklogic.com/ps/custom/common-tools" at "/app/lib/common-tools.xqy";

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

declare function project:save($uri as xs:string, $project)
{
  let $loggedInUser    := auth:getFullName(auth:getLoggedInUserFromHeader())
  let $currentDateTime := fn:current-dateTime()
  let $projectState    :=
    if (fn:string-length($project/projectState/text()) gt 0) then
      $project/projectState/text()
    else
      "start"
  
  return
  (
    project:_save(
      $uri,
      element {fn:QName($NS,"mml:project")}
      {
        element {fn:QName($NS,"metadata")}
        {
          element {fn:QName($NS,"created")}      { $currentDateTime },
          element {fn:QName($NS,"createdBy")}    { $loggedInUser },
          element {fn:QName($NS,"modified")}     { $currentDateTime },
          element {fn:QName($NS,"modifiedBy")}   { $loggedInUser },
          element {fn:QName($NS,"objectType")}   { "Project" },
          element {fn:QName($NS,"subjectHeadings")} {
            for $subjectHeading in $project/subjectHeadings/subjectHeading/text()
              return
                element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
          },
          element {fn:QName($NS,"subjectKeywords")} {
            for $subjectKeyword in $project/subjectKeywords/subjectKeyword/text()
              return
                element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
          },			  
          element {fn:QName($NS,"projectState")} { $projectState }
        },
        element {fn:QName($NS,"feed")} {
          element {fn:QName($NS,"systemId")}      { $project/systemId/text() },
          element {fn:QName($NS,"projectUri")}    { $project/projectUri/text() },
          element {fn:QName($NS,"title")}         { $project/title/text() },
          element {fn:QName($NS,"description")}   { $project/description/text() }
        }
      }
	   
    ),
    fn:concat("Project Successfully Saved: ", $uri)
  )
};

declare function project:_save($uri as xs:string, $project)
{
  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $project external;
           xdmp:document-insert($uri, $project, xdmp:default-permissions(), ("project"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("project"), $project)
    )
};

declare function project:update($uri as xs:string, $project)
{
	let $log := xdmp:log( "......................update uri: " ||$uri)

  let $invalidUriMessage := "invalid uri"

  let $process :=
    if (fn:string-length($uri) eq 0) then $invalidUriMessage
    else
    if (fn:doc-available($uri)) then
      "process update"
    else
      $invalidUriMessage

  let $loggedInUser    := auth:getFullName(auth:getLoggedInUserFromHeader())
  let $currentDateTime := fn:current-dateTime()
  let $origDoc         := fn:doc($uri)
  
  let $projectState    :=
    if (fn:string-length($project/projectState/text()) gt 0) then
      $project/projectState/text()
    else
      $origDoc/mml:project/mml:metadata/mml:projectState/text()

  (: Construct new document from input payload :)
  let $newDoc :=
    document {
  	  element {fn:QName($NS,"mml:project")}
  	  {
				element {fn:QName($NS,"metadata")}
				{
          element {fn:QName($NS,"created")}      { $origDoc/mml:project/mml:metadata/mml:created/text() },
          element {fn:QName($NS,"createdBy")}    { $origDoc/mml:project/mml:metadata/mml:createdBy/text() },
				  element {fn:QName($NS,"modified")}     { $currentDateTime },
				  element {fn:QName($NS,"modifiedBy")}   { $loggedInUser },
				  element {fn:QName($NS,"objectType")}   { "Project" },
				  element {fn:QName($NS,"subjectHeadings")} {
					for $subjectHeading in $project/subjectHeadings/subjectHeading/text()
					  return
						element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
				  },
				  element {fn:QName($NS,"subjectKeywords")} {
					for $subjectKeyword in $project/subjectKeywords/subjectKeyword/text()
					  return
						element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
				  },			  
				  element {fn:QName($NS,"projectState")} { $projectState }
				},
        element {fn:QName($NS,"feed")} {
          element {fn:QName($NS,"systemId")}      { $project/systemId/text() },
          element {fn:QName($NS,"projectUri")}    { $project/projectUri/text() },
          element {fn:QName($NS,"title")}         { $project/title/text() },
          element {fn:QName($NS,"description")}   { $project/description/text() }
        }
      }
    }

  let $status :=
    if (fn:starts-with($process, $invalidUriMessage)) then $invalidUriMessage
    else
    (
      project:_update($uri, $newDoc),
      fn:concat("Project Successfully Updated: '", $newDoc/mml:project/mml:feed/mml:title/text(), "'")
    )
    
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

declare function project:updateProjecState($uri as xs:string, $status as xs:string)
{
  let $doc := fn:doc($uri)

  let $origNode := $doc/mml:project/mml:metadata/mml:projectState
  let $newNode  := element {fn:QName($NS,"mml:projectState")}  { $status }
  
  let $_ := xdmp:node-replace($origNode, $newNode)

  return "done"
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
    				element modifiedBy { $projectDocument/mml:project/mml:metadata/mml:modifiedBy/text() },
    				element modified { $projectDocument/mml:project/mml:metadata/mml:modified/text() },
    				element title { $projectDocument/mml:project/mml:metadata/mml:title/text() }, 
    				element description { $projectDocument/mml:project/mml:metadata/mml:description/text() },
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

declare function project:findContentDocsByProjectTitle($projectTitle as xs:string)
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
          element { fn:QName($NS,"mml:systemId") }     { $result/mml:content/mml:metadata/mml:systemId/text() },
          element { fn:QName($NS,"mml:uri") }          { xdmp:node-uri($result) },
          element { fn:QName($NS,"mml:source") }       { $result/mml:content/mml:feed/mml:source/text() },
          element { fn:QName($NS,"mml:createdBy") }    { $result/mml:content/mml:metadata/mml:createdBy/text() },
          element { fn:QName($NS,"mml:created") }      { $result/mml:content/mml:metadata/mml:created/text() },
          element { fn:QName($NS,"mml:modifiedBy") }   { $result/mml:content/mml:metadata/mml:modifiedBy/text() },
          element { fn:QName($NS,"mml:modified") }     { $result/mml:content/mml:metadata/mml:modified/text() },
          element { fn:QName($NS,"mml:projectState") } { $result/mml:content/mml:metadata/mml:projectState/text() },
          element { fn:QName($NS,"mml:title") }        { $result/mml:content/mml:feed/mml:title/text() }
        }

  return $contentDocs
};

declare function project:searchProjectDocs($qtext as xs:string, $start as xs:integer, $pageLength as xs:integer, $sortBy as xs:string)
{
  let $sortOrder :=
    switch (fn:lower-case($sortBy)) 
      case "newest"
        return
          document {
            <sort-spec xmlns="http://marklogic.com/appservices/search">
              <sort-order type="xs:dateTime" direction="descending">
                <element ns="http://macmillanlearning.com" name="created"/>
              </sort-order>
              <sort-order>
                <score/>
              </sort-order>
            </sort-spec>
          }
    
      case "modified"
        return
          document {
            <sort-spec xmlns="http://marklogic.com/appservices/search">
              <sort-order type="xs:dateTime" direction="descending">
                <element ns="http://macmillanlearning.com" name="modified"/>
              </sort-order>
              <sort-order>
                <score/>
              </sort-order>
            </sort-spec>
          }

      case "title"
        return
          document {
            <sort-spec xmlns="http://marklogic.com/appservices/search">
              <sort-order type="xs:string" direction="ascending">
                <element ns="http://macmillanlearning.com" name="title"/>
              </sort-order>
              <sort-order>
                <score/>
              </sort-order>
            </sort-spec>
          }

      case "state"
        return
          document {
            <sort-spec xmlns="http://marklogic.com/appservices/search">
              <sort-order type="xs:string" direction="ascending">
                <element ns="http://macmillanlearning.com" name="projectState"/>
              </sort-order>
              <sort-order>
                <score/>
              </sort-order>
            </sort-spec>
          }

      default
        return
          document {
            <sort-spec xmlns="http://marklogic.com/appservices/search">
              <sort-order>
                <score/>
              </sort-order>
            </sort-spec>
          }
  
	let $options :=
	<options xmlns="http://marklogic.com/appservices/search">
	  <search-option>filtered</search-option>
	  <term>
  		<term-option>case-insensitive</term-option>
	  </term>
    <additional-query>
      <cts:and-query xmlns:cts="http://marklogic.com/cts">
        <cts:collection-query>
          <cts:uri>project</cts:uri>
        </cts:collection-query>
        <cts:not-query>
          <cts:element-value-query>
            <cts:element xmlns:mml="http://macmillanlearning.com">mml:projectState</cts:element>
            <cts:text xml:lang="en">Deleted</cts:text>
            <cts:option>case-insensitive</cts:option>
          </cts:element-value-query>
        </cts:not-query>
      </cts:and-query>
    </additional-query>
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
    <constraint name="state">
      <word>
        <element ns="http://macmillanlearning.com" name="projectState"/>
        <term-option>case-insensitive</term-option>
      </word>
    </constraint>	
	  <constraint name="Keywords">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="subjectKeyword" />
		  </range>
	   </constraint>
	   <constraint name="Subjects">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="subjectHeading" />
		  </range>          
	  </constraint>
	   <constraint name="Title">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="title" />
		  </range>          
	  </constraint>
	   <constraint name="Project State">
		  <range collation="http://marklogic.com/collation/" facet="true">
			 <element ns="http://macmillanlearning.com" name="projectState" />
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
    {$sortOrder/search:sort-spec/search:*}
	  <return-results>true</return-results>
	  <return-facets>true</return-facets>
	  <return-query>true</return-query>
	</options>

	let $statusMessage := "Project document found"

	let $results := search:search($qtext, $options, $start, $pageLength)

	let $retObj :=
	  if (fn:count($results/search:result) ge 1) then
	  (
  		element { fn:QName($NS,"mml:results") } {
  		element { fn:QName($NS,"mml:status") }     { $statusMessage },
  		element { fn:QName($NS,"mml:total") }      { xs:string($results/@total) },
  		element { fn:QName($NS,"mml:start") }      { xs:string($results/@start) },
  		element { fn:QName($NS,"mml:count") }      { fn:count($results/search:result) },
  		element { fn:QName($NS,"mml:pageLength") } { xs:string($results/@page-length) },
  		for $result in $results/search:result
  		  let $contentDocs := project:findContentDocsByProjectTitle($result/search:snippet/mml:title/text())
  		  return
    			element { fn:QName($NS,"mml:result") } {
      			element { fn:QName($NS,"mml:uri") }           { xs:string($result/@uri) },
      			element { fn:QName($NS,"mml:systemId") }      { $result/search:snippet/mml:systemId/text() },
      			element { fn:QName($NS,"mml:projectUri") }    { $result/search:snippet/mml:projectUri/text() },
      			element { fn:QName($NS,"mml:title") }         { $result/search:snippet/mml:title/text() },
      			element { fn:QName($NS,"mml:description") }   { $result/search:snippet/mml:description/text() },
      			element { fn:QName($NS,"mml:projectState") }  { $result/search:snippet/mml:projectState/text() },
      			element { fn:QName($NS,"mml:created") }       { $result/search:snippet/mml:created/text() },
      			element { fn:QName($NS,"mml:createdBy") }     { $result/search:snippet/mml:createdBy/text() },
      			element { fn:QName($NS,"mml:modified") }      { $result/search:snippet/mml:modified/text() },
      			element { fn:QName($NS,"mml:modifiedBy") }    { $result/search:snippet/mml:modifiedBy/text() },
        	  for $subjectHeading in $result/search:snippet/mml:subjectHeadings/mml:subjectHeading/text()
      				return
      				  element { fn:QName($NS,"mml:subjectHeading") } { $subjectHeading },
            for $subjectKeyword in $result/search:snippet/mml:subjectKeywords/mml:subjectKeyword/text()
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

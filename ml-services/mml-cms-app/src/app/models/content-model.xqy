xquery version "1.0-ml";

module namespace content = "http://marklogic.com/roxy/models/content";

import module namespace search  = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace cfg     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace invoke  = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace ch      = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req     = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace auth    = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace json    = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace tools   = "http://marklogic.com/ps/custom/common-tools" at "/app/lib/common-tools.xqy";

(: declare namespace search = "http://marklogic.com/appservices/search"; :)
declare namespace cts    = "http://marklogic.com/cts";
declare namespace mml    = "http://macmillanlearning.com";

declare option xdmp:mapping "false";

declare variable $NS := "http://macmillanlearning.com";

declare variable $SEARCH-OPTIONS :=
  <options xmlns="http://marklogic.com/appservices/search">
    <return-query>1</return-query>
  </options>;

declare function content:getContentUri($hash)
{
  let $uri := fn:concat("/content/", $hash, "/")
  
  return $uri
};

declare function content:save($uri as xs:string, $content)
{
  let $loggedInUser    := auth:getFullName(auth:getLoggedInUserFromHeader())
  let $currentDateTime := fn:current-dateTime()
  
  return
  (
    content:_save(
      $uri,
      element {fn:QName($NS,"mml:content")}
      {
        element {fn:QName($NS,"metadata")}
        {
          element {fn:QName($NS,"systemId")}     { $content/meta/systemId/text() },
          element {fn:QName($NS,"projectState")} { $content/meta/projectState/text() },
          element {fn:QName($NS,"created")}      { $currentDateTime },
          element {fn:QName($NS,"createdBy")}    { $loggedInUser },
          element {fn:QName($NS,"modified")}     { $currentDateTime },
          element {fn:QName($NS,"modifiedBy")}   { $loggedInUser },
          element {fn:QName($NS,"objectType")}   { "Content" },
          element {fn:QName($NS,"subjectHeadings")} {
            for $subjectHeading in $content/meta/subjectHeadings/subjectHeading/text()
              return
                element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
          },
          element {fn:QName($NS,"subjectKeywords")} {
            for $subjectKeyword in $content/meta/subjectKeywords/subjectKeyword/text()
              return
                element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
          },
          element {fn:QName($NS,"projects")} {
            for $project in $content/meta/projects/project/text()
              return
                element {fn:QName($NS,"project")} { $project }
          }
        },
        element {fn:QName($NS,"feed")}
        {
          element {fn:QName($NS,"title")}         { $content/feed/title/text() },
          element {fn:QName($NS,"description")}   { $content/feed/description/text() },
          element {fn:QName($NS,"source")}        { $content/feed/source/text() },
          element {fn:QName($NS,"publisher")}     { $content/feed/publisher/text() },
          element {fn:QName($NS,"datePublished")} { $content/feed/datePublished/text() },
          element {fn:QName($NS,"contentState")}  { $content/feed/contentState/text() },
          element {fn:QName($NS,"creators")} {
            for $creator in $content/feed/creators/creator/text()
              return
                element {fn:QName($NS,"creator")} { $creator }
          },
          element {fn:QName($NS,"contentResourceTypes")} {
            for $resourceType in $content/feed/contentResourceTypes/contentResourceType/text()
              return
                element {fn:QName($NS,"contentResourceType")} { $resourceType }
          },
          element {fn:QName($NS,"technical")} {
            element {fn:QName($NS,"fileFormat")}   { $content/feed/technical/fileFormat/text() },
            element {fn:QName($NS,"fileName")}   { $content/feed/technical/fileName/text() },
            element {fn:QName($NS,"filePath")}   { $content/feed/technical/filePath/text() },
            element {fn:QName($NS,"fileSize")}   { $content/feed/technical/fileSize/text() }
          }
        }
      }
    ),
    fn:concat("Content Successfully Saved: ", $uri)
  )
};

declare function content:_save($uri as xs:string, $content)
{
  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $content external;
           xdmp:document-insert($uri, $content, xdmp:default-permissions(), ("content"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("content"), $content)
    )
};

declare function content:update($uri as xs:string, $content)
{
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
  
  let $newDoc :=
    document {
      element {fn:QName($NS,"mml:content")}
      {
        element {fn:QName($NS,"metadata")}
        {
          element {fn:QName($NS,"systemId")}     { $content/meta/systemId/text() },
          element {fn:QName($NS,"projectState")} { $content/meta/projectState/text() },
          element {fn:QName($NS,"created")}      { $origDoc/mml:content/mml:metadata/mml:created/text() },
          element {fn:QName($NS,"createdBy")}    { $origDoc/mml:content/mml:metadata/mml:createdBy/text() },
          element {fn:QName($NS,"modified")}     { $currentDateTime },
          element {fn:QName($NS,"modifiedBy")}   { $loggedInUser },
          element {fn:QName($NS,"objectType")}   { "Content" },
          element {fn:QName($NS,"subjectHeadings")} {
            for $subjectHeading in $content/meta/subjectHeadings/subjectHeading/text()
              return
                element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
          },
          element {fn:QName($NS,"subjectKeywords")} {
            for $subjectKeyword in $content/meta/subjectKeywords/subjectKeyword/text()
              return
                element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
          },
          element {fn:QName($NS,"projects")} {
            for $project in $content/meta/projects/project/text()
              return
                element {fn:QName($NS,"project")} { $project }
          }
        },
        element {fn:QName($NS,"feed")}
        {
          element {fn:QName($NS,"title")}         { $content/feed/title/text() },
          element {fn:QName($NS,"description")}   { $content/feed/description/text() },
          element {fn:QName($NS,"source")}        { $content/feed/source/text() },
          element {fn:QName($NS,"publisher")}     { $content/feed/publisher/text() },
          element {fn:QName($NS,"datePublished")} { $content/feed/datePublished/text() },
          element {fn:QName($NS,"contentState")}  { $content/feed/contentState/text() },
          element {fn:QName($NS,"creators")} {
            for $creator in $content/feed/creators/creator/text()
              return
                element {fn:QName($NS,"creator")} { $creator }
          },
          element {fn:QName($NS,"contentResourceTypes")} {
            for $resourceType in $content/feed/contentResourceTypes/contentResourceType/text()
              return
                element {fn:QName($NS,"contentResourceType")} { $resourceType }
          },		  
          element {fn:QName($NS,"technical")} {
            element {fn:QName($NS,"fileFormat")}   { $content/feed/technical/fileFormat/text() },
            element {fn:QName($NS,"fileName")}   { $content/feed/technical/fileName/text() },
            element {fn:QName($NS,"filePath")}   { $content/feed/technical/filePath/text() },
            element {fn:QName($NS,"fileSize")}   { $content/feed/technical/fileSize/text() }
          }
        }
      }
    }
  
  let $status :=
    if (fn:starts-with($process, $invalidUriMessage)) then $invalidUriMessage
    else
    (
      content:_update($uri, $newDoc),
      fn:concat("Content Successfully Updated: '", $newDoc/mml:content/mml:feed/mml:title/text(), "'")
    )
    
    return $status
};

declare function content:_update1($uri as xs:string, $newDoc)
{
  let $doc := fn:doc($uri)
  let $log := xdmp:log(".................. $uri:    "||$uri)
  let $log := xdmp:log(".................. title 1: "||$doc/mml:content/mml:feed/mml:title/text())
  let $log := xdmp:log(".................. title 2: "||$newDoc/mml:content/mml:feed/mml:title/text())
  
  let $cmd :=
        fn:concat
        (
          'declare namespace mml = "http://macmillanlearning.com";
           declare variable $uri external;
           declare variable $doc external;
           declare variable $newDoc external;
           xdmp:node-replace($doc/mml:content, $newDoc/mml:content)'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("doc"), $doc, xs:QName("newDoc"), $newDoc)
    )
};

declare function content:updateContentState($uri as xs:string, $status as xs:string)
{
  let $doc := fn:doc($uri)

  let $origNode := $doc/mml:content/mml:feed/mml:contentState
  let $newNode  := element {fn:QName($NS,"mml:contentState")}  { $status }
  let $_ := xdmp:node-replace($origNode, $newNode)

  return "done"
};

declare function content:_update($uri as xs:string, $doc)
{
  if($doc) then
    xdmp:spawn("/app/lib/updateContent.xqy", ((xs:QName("uri"), $uri, xs:QName("doc"), $doc)))
  else ()
};

declare function content:delete($username)
{
  let $uri := content:getContentUri($username)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           xdmp:document-delete($uri)'
        )
  return
  (
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri)
    ),
    fn:concat("Content Successfully Deleted: ", $uri)
  )
};

declare function content:get($lookup)
{
  if ($lookup) then
      cts:search(
        //mml:content,
        cts:element-value-query(fn:QName($NS, "title"), $lookup)
      )
  else ()
};

declare function content:getContentDoc($title)
{
  let $doc :=
    if ($title) then
    (
        cts:search(
          fn:doc(),
          cts:and-query((
            cts:directory-query("/content/","infinity"),
            cts:element-value-query(fn:QName($NS, "title"), $title)
          ))
        )[1]
    )
    else ()
  
  let $content :=
    if ($doc) then
      element content-wrapper
      {
        element firstname { $doc/mml:user/mml:feed/mml:firstName/text() }, 
        element lastname  { $doc/mml:user/mml:feed/mml:lastName/text() }, 
        element username  { $doc/mml:user/mml:feed/mml:username/text() }, 
        element password  { $doc/mml:user/mml:feed/mml:password/text() },
        element created   { $doc/mml:user/mml:metadata/mml:created/text() }
      }
    else ()

  return $content
};

declare function content:getContentDocs()
{
  let $docs :=
    for $n in //mml:title
      order by $n/mml:feed/mml:title/text()
        return $n
  
  return
    $docs
};

declare function content:search($type)
{
  content:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function content:invoke($function, $params)
{
  invoke:invoke(
    $function,
    "http://marklogic.com/roxy/lib/profile/user", 
    "/app/lib/profile-user.xqy", 
    $params,
    fn:true(),
    xdmp:database-name(xdmp:database())
  )
};

declare function content:findProjectDocsByProjectTitle($projectTitle as xs:string)
{
  let $query := cts:and-query((
                    cts:collection-query("project"),
                    cts:element-value-query(fn:QName($NS, "title"), $projectTitle)
                  ))

  let $results := cts:search(fn:doc(), $query)

  let $contentDocs :=
    for $result in $results
      return
   			element { fn:QName($NS,"mml:project") } {
          element { fn:QName($NS,"mml:uri") }          { xdmp:node-uri($result) },
          element { fn:QName($NS,"mml:createdBy") }    { $result/mml:project/mml:metadata/mml:createdBy/text() },
          element { fn:QName($NS,"mml:created") }      { $result/mml:project/mml:metadata/mml:created/text() },
          element { fn:QName($NS,"mml:modifiedBy") }   { $result/mml:project/mml:metadata/mml:modifiedBy/text() },
          element { fn:QName($NS,"mml:modified") }     { $result/mml:project/mml:metadata/mml:modified/text() },
          element { fn:QName($NS,"mml:title") }        { $result/mml:project/mml:feed/mml:title/text() }
        }

	return $contentDocs
};

declare function content:searchContentDocs($qtext as xs:string, $start, $pageLength, $sortBy as xs:string)
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
                <element ns="http://macmillanlearning.com" name="contentState"/>
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
            <cts:uri>content</cts:uri>
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
        <element ns="http://macmillanlearning.com" name="contentState"/>
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
  	  <constraint name="Content State">
  		  <range collation="http://marklogic.com/collation/" facet="true">
  			 <element ns="http://macmillanlearning.com" name="contentState" />
  		  </range>
  	  </constraint>  	  
      <transform-results apply="metadata-snippet">
        <preferred-elements>
          <element ns="http://macmillanlearning.com" name="systemId"/>
          <element ns="http://macmillanlearning.com" name="created"/>
          <element ns="http://macmillanlearning.com" name="modified"/>		  
          <element ns="http://macmillanlearning.com" name="createdBy"/>
          <element ns="http://macmillanlearning.com" name="modifiedBy"/>
          <element ns="http://macmillanlearning.com" name="title"/>
          <element ns="http://macmillanlearning.com" name="description"/>
          <element ns="http://macmillanlearning.com" name="contentState"/>
          <element ns="http://macmillanlearning.com" name="projectState"/>
          <element ns="http://macmillanlearning.com" name="source"/>
          <element ns="http://macmillanlearning.com" name="publisher"/>
          <element ns="http://macmillanlearning.com" name="datePublished"/>
          <element ns="http://macmillanlearning.com" name="contentResourceTypes"/>
          <element ns="http://macmillanlearning.com" name="fileFormat"/>
          <element ns="http://macmillanlearning.com" name="fileName"/>
          <element ns="http://macmillanlearning.com" name="filePath"/>
          <element ns="http://macmillanlearning.com" name="fileSize"/>
          <element ns="http://macmillanlearning.com" name="creators"/>
          <element ns="http://macmillanlearning.com" name="subjectHeadings"/>
          <element ns="http://macmillanlearning.com" name="subjectKeywords"/>
          <element ns="http://macmillanlearning.com" name="projects"/>
        </preferred-elements>
        <max-matches>2</max-matches>
        <max-snippet-chars>150</max-snippet-chars>
        <per-match-tokens>20</per-match-tokens>
      </transform-results>
      {$sortOrder/search:sort-spec/search:*}
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
   		element { fn:QName($NS,"mml:total") }      { xs:string($results/@total) },
  		element { fn:QName($NS,"mml:start") }      { xs:string($results/@start) },
  		element { fn:QName($NS,"mml:count") }      { fn:count($results/search:result) },
  		element { fn:QName($NS,"mml:pageLength") } { xs:string($results/@page-length) },
      for $result in $results/search:result
        return
          element { fn:QName($NS,"mml:result") } {
          element { fn:QName($NS,"mml:uri") }           { xs:string($result/@uri) },
          element { fn:QName($NS,"mml:systemId") }      { $result/search:snippet/mml:systemId/text() },
          element { fn:QName($NS,"mml:created") }       { $result/search:snippet/mml:created/text() },
          element { fn:QName($NS,"mml:modified") }      { $result/search:snippet/mml:modified/text() },
          element { fn:QName($NS,"mml:createdBy") }     { $result/search:snippet/mml:createdBy/text() },
          element { fn:QName($NS,"mml:modifiedBy") }    { $result/search:snippet/mml:modifiedBy/text() },
          element { fn:QName($NS,"mml:title") }         { $result/search:snippet/mml:title/text() },
          element { fn:QName($NS,"mml:description") }   { $result/search:snippet/mml:description/text() },
          element { fn:QName($NS,"mml:contentState") }  { $result/search:snippet/mml:contentState/text() },
          element { fn:QName($NS,"mml:projectState") }  { $result/search:snippet/mml:projectState/text() },
          element { fn:QName($NS,"mml:source") }        { $result/search:snippet/mml:source/text() },
          element { fn:QName($NS,"mml:publisher") }     { $result/search:snippet/mml:publisher/text() },
          element { fn:QName($NS,"mml:datePublished") } { $result/search:snippet/mml:datePublished/text() },
          element { fn:QName($NS,"mml:fileFormat") }   { $result/search:snippet/mml:fileFormat/text() },
          element { fn:QName($NS,"mml:fileName") }     { $result/search:snippet/mml:fileName/text() },
          element { fn:QName($NS,"mml:filePath") }     { $result/search:snippet/mml:filePath/text() },
          element { fn:QName($NS,"mml:fileSize") }     { $result/search:snippet/mml:fileSize/text() },
          for $creator in $result/search:snippet/mml:creators/mml:creator/text()
            return
              element { fn:QName($NS,"mml:creator") } { $creator },
          for $contentResourceType in $result/search:snippet/mml:contentResourceTypes/mml:contentResourceType/text()
            return
              element { fn:QName($NS,"mml:contentResourceType") } { $contentResourceType },
          for $subjectHeading in $result/search:snippet/mml:subjectHeadings/mml:subjectHeading/text()
            return
              element { fn:QName($NS,"mml:subjectHeading") } { $subjectHeading },
          for $subjectKeyword in $result/search:snippet/mml:subjectKeywords/mml:subjectKeyword/text()
            return
              element { fn:QName($NS,"mml:subjectKeyword") } { $subjectKeyword },
          for $project in $result/search:snippet/mml:hasProjects/mml:project/text()
            return
              element { fn:QName($NS,"mml:project") } { $project }
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

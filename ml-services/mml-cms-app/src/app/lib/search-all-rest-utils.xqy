xquery version "1.0-ml";

module namespace searchAllRestLib = "http://marklogic.com/ps/custom/search-all-rest-utils";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";
import module namespace pm     = "http://marklogic.com/roxy/models/project" at "/app/models/project-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function searchAllRestLib:getAction(
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

  let $retObj := searchAllRestLib:searchAllDocs($qtext, $start, $pageLength, $sortBy)

	let $_ := map:put($context, "output-status", (200, "fetched"))

 	return
    document {
      if ($format eq "json") then
      (
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

declare function searchAllRestLib:searchAllDocs($qtext as xs:string, $start as xs:integer, $pageLength as xs:integer, $sortBy as xs:string)
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
            <cts:uri>content</cts:uri>
            <cts:uri>project</cts:uri>
          </cts:collection-query>
          <cts:not-query>
            <cts:element-value-query>
              <cts:element xmlns:mml="http://macmillanlearning.com">mml:projectState</cts:element>
              <cts:text xml:lang="en">deleted</cts:text>
              <cts:option>case-insensitive</cts:option>
            </cts:element-value-query>
          </cts:not-query>
          <cts:not-query>
            <cts:element-value-query>
              <cts:element xmlns:mml="http://macmillanlearning.com">mml:contentState</cts:element>
              <cts:text xml:lang="en">deleted</cts:text>
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
          <element ns="http://macmillanlearning.com" name="objectType"/>
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

	let $statusMessage := "documents found"

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

        let $objectType := fn:lower-case($result/search:snippet/mml:objectType[1]/text())

  		  let $contentDocs :=
  		    if (fn:starts-with($objectType, "project")) then
  		      pm:findContentDocsByProjectTitle($result/search:snippet/mml:title/text())
  		    else ()

  		  return
    			element { fn:QName($NS,"mml:result") } {
      			element { fn:QName($NS,"mml:uri") }           { xs:string($result/@uri) },
      			element { fn:QName($NS,"mml:systemId") }      { $result/search:snippet/mml:systemId/text() },
      			element { fn:QName($NS,"mml:projectUri") }    { $result/search:snippet/mml:projectUri/text() },
      			element { fn:QName($NS,"mml:title") }         { $result/search:snippet/mml:title/text() },
				element { fn:QName($NS,"mml:searchType") }         { $result/search:snippet/mml:objectType/text() },
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

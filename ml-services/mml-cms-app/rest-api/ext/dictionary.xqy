xquery version "1.0-ml";

module namespace mml-api = "http://marklogic.com/rest-api/resource/dictionary";

import module namespace json="http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mml = "http://macmillanlearning.com"	;

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
This API is responsible to get list of dictionary values for a given dictionary type
 Parameters - "dictionaryType=xs:string", "output-format=xs:string" - to support JSON & XML
 :)
declare 
%roxy:params("dictionaryType=xs:string", "output-format=xs:string")
function mml-api:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  (: Add Auth Token Check here :)
  
  let $dictionaryType := map:get($params, "dictionaryType")
  let $outputFormat   := map:get($params, "format")

  let $query :=
    if (fn:string-length($dictionaryType) gt 0) then
      cts:and-query((
          cts:directory-query("/dictionary/","infinity"),
          cts:element-value-query(
            fn:QName($NS, "dictionaryType"), $dictionaryType, ("case-insensitive")
        )
      ))
    else
      cts:and-query((
          cts:directory-query("/dictionary/","infinity")
        ))

  let $results := cts:search(fn:doc(), $query)
  let $values := $results/mml:dictionary/mml:dictionaryValues/mml:dictionaryValue/text()

  let $resultXml :=
        element results {
          element count { fn:count($values) },
          for $value in $values
            order by $value
              return (
                element val {
                  element name { fn:lower-case(fn:translate(fn:replace($value, ' ', '_'),'/.','_')) },
                  element value { $value }
                }
              )
        }

  (: Custom JSON configurator to support nested array elements :)
  let $config := json:config("custom")
  let $_ := map:put($config, "whitespace", "ignore" )
  let $_ := map:put($config, "array-element-names", "val")

  (: Depends on content-type either XML or JSON output will be returned :)
  let $output :=
    if ($outputFormat = "json") then 
      json:transform-to-json($resultXml, $config)
    else
      $resultXml

  let $_ := map:put($context, "output-types", if ($outputFormat = "json") then "text/json" else "application/xml")
  let $_ := map:put($context, "output-status", (200, "OK"))

  return
    document { $output }
};

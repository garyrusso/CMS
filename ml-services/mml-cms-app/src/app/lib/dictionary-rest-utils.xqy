xquery version "1.0-ml";

module namespace dictionaryRestLib = "http://marklogic.com/ps/custom/dictionary-rest-utils";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace json   = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
import module namespace am     = "http://marklogic.com/roxy/models/audit" at "/app/models/audit-model.xqy";

declare namespace mml = "http://macmillanlearning.com";
declare namespace jn  = "http://marklogic.com/xdmp/json/basic";

declare variable $NS := "http://macmillanlearning.com";

declare function dictionaryRestLib:getAction(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
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

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
  let $dictionaryType := map:get($params, "dictionaryType")
  let $outputFormat   := map:get($params, "outputFormat")

  let $query :=
    cts:and-query((
        cts:directory-query("/dictionary/","infinity"),
        cts:element-value-query(
          fn:QName($NS, "dictionaryType"), $dictionaryType, ("case-insensitive")
      )
    ))

  let $result := cts:search(fn:doc(), $query)[1]
  let $values := $result/mml:dictionary/mml:dictionaryValues/mml:dictionaryValue/text()

  let $resultXml :=
        <results>{
        for $value in $values
          order by $value
            return (
              <val>
                <name>{fn:lower-case(fn:translate(fn:replace($value, ' ', '_'),'/.','_'))}</name>
                <value>{$value}</value>
              </val>
            )
      }
      </results> 

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

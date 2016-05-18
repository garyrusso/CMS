xquery version "1.0-ml";

module namespace mml-api = "http://marklogic.com/rest-api/resource/dictionary";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";
declare namespace mml = "http://macmillanlearning.com/"	;

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
 Parameter - "dictionaryType=xs:string" 
 :)
declare 
%roxy:params("dictionaryType=xs:string")
function mml-api:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $dictionary-type := map:get($params, "dictionaryType")
  let $values :=  cts:search(//mml:dataDictionary, cts:word-query($dictionary-type))
  let $dict-values := $values/mml:dictionaryValues
  let $result :=
      <results>{
			for $value in $dict-values/mml:dictionaryValue/text()
				return (<val><name>{fn:lower-case(fn:translate(fn:replace($value, ' ', '_'),'/.','_'))}</name><value>{$value}</value></val>)
		}
	  </results>  
  return
  (
	  map:put($context, "output-types", "application/xml"),
	  map:put($context, "output-status", (200, "OK")),
	  document { $result }
  )
};


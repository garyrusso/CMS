xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/ping";

import module namespace json = "http://marklogic.com/json" at "/roxy/lib/json.xqy";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";

(:
 :)
declare 
%roxy:params("")
function mml:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  let $result   := 
         <json:object type="object">
            <json:responseCode>200</json:responseCode>
            <json:message>Ping successful</json:message>
         </json:object>

  let $resultCode := $result/json:responseCode/text()

  let $_ := map:put($context, "output-types", "text/json")
  let $_ := map:put($context, "output-status", ($resultCode, "OK"))
  
  return
    document {
      json:serialize($result)
    }
};

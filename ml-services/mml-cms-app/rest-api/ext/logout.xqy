xquery version "1.0-ml";

module namespace mml = "http://marklogic.com/rest-api/resource/logout";

import module namespace json = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

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
  let $reqHeader := xdmp:get-request-header("UserInfo")
  let $userPwd  :=
    if ($reqHeader) then
    (
      try { xdmp:base64-decode($reqHeader) } catch ($e) { "" }
    )
    else ""
  
  let $username := if ($userPwd) then fn:string((xdmp:get-request-header("username"),fn:tokenize($userPwd, ":")[1])[1]) else ""
  let $password := if ($userPwd) then fn:string((xdmp:get-request-header("password"),fn:tokenize($userPwd, ":")[2])[1]) else ""

  let $_ := xdmp:log(fn:concat("logout ----------- username/pwd = '", $username, " : ", $password||"'"))

  let $result   := auth:logout($username)

  let $resultCode := $result/json:responseCode/text()

  let $_ := map:put($context, "output-types", "text/json")
  let $_ := map:put($context, "output-status", ($resultCode, "OK"))

  return
    document {
      json:serialize($result)
    }
};


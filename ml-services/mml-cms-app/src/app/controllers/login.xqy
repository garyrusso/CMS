xquery version "1.0-ml";

module namespace c = "http://marklogic.com/roxy/controller/login";

import module namespace ch    = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req   = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace error = "http://marklogic.com/roxy/error-lib" at "../views/helpers/error-lib.xqy";
import module namespace auth  = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";

declare namespace json   = "http://marklogic.com/json";

declare option xdmp:mapping "false";

declare variable $RES-TYPE as xs:string := "Login";
declare variable $RES-PREFIX as xs:string := "LOGIN";

declare function c:main() as item()*
{
(:
  let $userPwd  := xdmp:base64-decode(fn:string(fn:tokenize(xdmp:get-request-header("Authorization"), "Basic ")[2]))
:)
  let $reqHeader := xdmp:get-request-header("UserInfo")
  let $userPwd  := if ($reqHeader) then xdmp:base64-decode($reqHeader) else ""
  
  let $username := if ($userPwd) then fn:string((xdmp:get-request-header("username"),fn:tokenize($userPwd, ":")[1])[1]) else ""
  let $password := if ($userPwd) then fn:string((xdmp:get-request-header("password"),fn:tokenize($userPwd, ":")[2])[1]) else ""

let $log := xdmp:log("................. $username: '"||$username||"'")
let $log := xdmp:log("................. $password: '"||$password||"'")

  let $result   := auth:login($username, $password)

  return
  (
    ch:add-value("res-code", xs:int($result/json:responseCode) ),
    ch:add-value("res-message", xs:string($result/json:message) ),
    ch:add-value("result",  $result),
    ch:add-value(
            "res-header", 
            element header {
              element Date {fn:current-dateTime()},
              element Content-Type {req:get("req-header")/content-type/fn:string()}
            }
          )
  )
};

declare function c:login-error() as item()* {
    error:error-handling( 401, "Unauthorized")
};

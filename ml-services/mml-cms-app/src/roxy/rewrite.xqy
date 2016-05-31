(:
Copyright 2012-2015 MarkLogic Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
:)
xquery version "1.0-ml";

import module namespace config = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace def = "http://marklogic.com/roxy/defaults" at "/roxy/config/defaults.xqy";
import module namespace req = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace rewriter = "http://marklogic.com/roxy/rewriter" at "/roxy/lib/rewriter-lib.xqy";

declare namespace rest = "http://marklogic.com/appservices/rest";

declare option xdmp:mapping "false";

let $uri  := xdmp:get-request-url()
let $method := xdmp:get-request-method()
let $path := xdmp:get-request-path()
let $final-uri :=
  req:rewrite(
    $uri,
    $path,
    $method,
    $config:ROXY-ROUTES)
return
  if ($final-uri) then
  (
    let $log := xdmp:log("1.................. non-roxy extension rewrite $final-url: "||$final-uri)
    return $final-uri
  )
  else
    try
    {
      let $log:= xdmp:log("")
      let $log:= xdmp:log("2a.................. roxy extension before rewrite:rewrite() $method: "||$method||" --- $uri: "||$uri)
      let $log:= xdmp:log("")
      
      let $url := (rewriter:rewrite($method, $uri, $path), $uri)[1]
      
      let $log:= xdmp:log("")
      let $log:= xdmp:log("2b.................. roxy extension after rewrite:rewrite() $method: "||$method||" --- $url: "||$url)
      let $log:= xdmp:log("")
      return $url
    }
    catch($ex) {
      if ($ex/error:code = "XDMP-MODNOTFOUND") then
        $uri
      else
        xdmp:rethrow()
    }

xquery version "1.0-ml";

module namespace fm = "http://marklogic.com/roxy/models/file";

import module namespace cfg     = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace invoke  = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace ch      = "http://marklogic.com/roxy/controller-helper" at "/roxy/lib/controller-helper.xqy";
import module namespace req     = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
import module namespace auth    = "http://marklogic.com/roxy/models/authentication" at "/app/models/authentication.xqy";
import module namespace json    = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace tools   = "http://marklogic.com/ps/custom/common-tools" at "/app/lib/common-tools.xqy";

declare namespace search = "http://marklogic.com/appservices/search";
declare namespace cts    = "http://marklogic.com/cts";
declare namespace mml    = "http://macmillanlearning.com";

declare option xdmp:mapping "false";

declare variable $NS := "http://macmillanlearning.com";

declare variable $SEARCH-OPTIONS :=
  <options xmlns="http://marklogic.com/appservices/search">
    <return-query>1</return-query>
  </options>;

declare function fm:getContentUri($hash)
{
  let $uri := fn:concat("/content/", $hash, "/")
  
  return $uri
};

declare function fm:save($fileName as xs:string, $file)
{
  (
    fm:_save($fileName, $file),
    "File Successfully Saved: "||"/resource/"||$fileName
  )
};

declare function fm:_save($fileName as xs:string, $doc)
{
(:
  let $hashedDir := xdmp:hash64($content/mml:feed/mml:title/text())
  let $log := xdmp:log("......... hash: "||$hashedDir)
:)

  let $uri := "/resource/"||$fileName
  
  (: check if file already exists :)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           xdmp:document-insert($uri, $doc, xdmp:default-permissions(), ("resource"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("doc"), $doc)
    )
};

declare function fm:saveByUri($uri as xs:string, $file)
{
  (
    fm:_saveByUri($uri, $file),
    "File Successfully Saved: "||$uri
  )
};

declare function fm:_saveByUri($uri as xs:string, $doc)
{
  (: check if file already exists :)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           xdmp:document-insert($uri, $doc, xdmp:default-permissions(), ("resource"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("doc"), $doc)
    )
};

declare function fm:delete($uri)
{
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
    fn:concat("Resource Successfully Deleted: ", $uri)
  )
};

declare function fm:search($type)
{
  fm:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function fm:invoke($function, $params)
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


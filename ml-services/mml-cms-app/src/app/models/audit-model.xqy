xquery version "1.0-ml";

module namespace am = "http://marklogic.com/roxy/models/audit";

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

declare function am:save($action as xs:string, $targetUri as xs:string, $targetType as xs:string)
{
  let $doc :=
    element { fn:QName($NS,"mml:auditRecord") }
    {
      element { fn:QName($NS,"mml:action") } { $action },
      element { fn:QName($NS,"mml:auditTargetUri") } { $targetUri },
      element { fn:QName($NS,"mml:auditTargetType") } { $targetType }, (: Content or Resource :)
      element { fn:QName($NS,"mml:dateCreated") } { fn:current-dateTime() },
      element { fn:QName($NS,"mml:createdBy") } { auth:getUserNameFromBase64String() }
    }
  
  let $uri := "/audit/"||xdmp:hash64($doc)||".xml"
  
  return
  (
    am:_save($uri, $doc),
    "Audit Doc Successfully Saved: "||$uri
  )
};

declare function am:_save($uri as xs:string, $doc)
{
  (: check if file already exists :)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           xdmp:document-insert($uri, $doc, xdmp:default-permissions(), ("audit"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("doc"), $doc)
    )
};

declare function am:delete($uri)
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

declare function am:search($type)
{
  am:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function am:invoke($function, $params)
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


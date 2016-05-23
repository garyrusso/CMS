xquery version "1.0-ml";

module namespace usr = "http://marklogic.com/roxy/models/user";

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

declare function usr:getUserUri($username)
{
  let $uri := fn:concat("/users/", $username, "/", "profile.xml")
  
  return $uri
};

declare function usr:save1($user)
{
  (
    usr:_save(
      element user-profile
      {
        element firstname { $user/firstname/text() }, 
        element lastname  { $user/lastname/text() }, 
        element username  { $user/username/text() }, 
        element password  { xdmp:md5($user/password/fn:string()) }, 
        element created   { if (fn:empty($user/created/text())) then fn:current-dateTime() else $user/created/text() },
        element modified  { fn:current-dateTime() }
      }
    ),
    fn:concat("User Successfully Saved: ", $user/username/text())
  )
};

declare function usr:save($user)
{
  (
    usr:_save(
      element {fn:QName($NS,"mml:user")}
      {
        element {fn:QName($NS,"metadata")}
        {
          element {fn:QName($NS,"created")}    { if (fn:empty($user/created/text())) then fn:current-dateTime() else $user/created/text() },
          element {fn:QName($NS,"createdBy")}  { "webuser" },
          element {fn:QName($NS,"modified")}   { fn:current-dateTime() },
          element {fn:QName($NS,"modifiedBy")} { "webuser" },
          element {fn:QName($NS,"objectType")} { "User" }
        },
        element {fn:QName($NS,"feed")}
        {
          element {fn:QName($NS,"username")}   { fn:normalize-space(req:get("username", "", "type=xs:string")) },
          element {fn:QName($NS,"fullName")}   { $user/firstname/text()||" "||$user/lastname/text() },
          element {fn:QName($NS,"firstName")}  { $user/firstname/text() },
          element {fn:QName($NS,"lastName")}   { $user/lastname/text() },
          element {fn:QName($NS,"email")}      { fn:lower-case($user/firstname/text())||"."||fn:lower-case($user/lastname/text())||"@macmillan.com" },
          element {fn:QName($NS,"password")}   { xdmp:md5($user/password/fn:string()) }
        }
      }
    ),
    fn:concat("User Successfully Saved: ", $user/username/text())
  )
};

declare function usr:_save($user)
{
  let $uri := usr:getUserUri($user/mml:feed/mml:username/fn:string())

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $user external;
           xdmp:document-insert($uri, $user, xdmp:default-permissions(), ("user"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("user"), $user)
    )
};

declare function usr:_update($user)
{
  let $uri := usr:getUserUri($user/username/fn:string())
  let $doc := fn:doc($uri)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           declare variable $user external;
           xdmp:node-replace(fn:doc()/mml:user/mml:feed/firstname, <firstname>aaa</firstname>)'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("doc"), $doc, xs:QName("user"), $user)
    )
};

declare function usr:delete($username)
{
  let $uri := usr:getUserUri($username)

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
    fn:concat("User Successfully Deleted: ", $username)
  )
};

declare function usr:get($lookup)
{
  if ($lookup) then
      cts:search(
        //mml:user,
        cts:element-value-query(fn:QName($NS, "username"), $lookup)
      )
  else ()
};

declare function usr:getUserList()
{
  let $userlist :=
    for $n in //mml:user
      order by $n/mml:feed/mml:username/text()
        return $n
  
  return
    $userlist
};

declare function usr:search($type)
{
  usr:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function usr:invoke($function, $params)
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


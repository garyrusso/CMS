xquery version "1.0-ml";

module namespace auth = "http://marklogic.com/roxy/models/authentication";

import module namespace invoke = "http://marklogic.com/ps/invoke/functions" at "/app/lib/invoke-functions.xqy";
import module namespace cfg    = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";
import module namespace tools  = "http://marklogic.com/ps/custom/common-tools" at "/app/lib/common-tools.xqy";
import module namespace json   = "http://marklogic.com/json" at "/roxy/lib/json.xqy";
import module namespace req    = "http://marklogic.com/roxy/request" at "/roxy/lib/request.xqy";
(:
import module namespace token  = "http://marklogic.com/ps/custom/deleteToken" at "/app/lib/deleteToken.xqy";
:)

declare namespace mml = "http://macmillanlearning.com";

declare option xdmp:mapping "false";
declare option xdmp:update "false";

declare variable $NS := "http://macmillanlearning.com";

declare variable $auth:INVALID-USER := "invalid user";

declare variable $auth:SESSION-PREFIX := "session";

declare variable $auth:SESSION-TIMEOUT := xs:dayTimeDuration("P1D");
(: declare variable $auth:SESSION-TIMEOUT := xs:dayTimeDuration("PT0H05M"); :)

declare variable $auth:DEFAULT-USER as xs:string := "tester";

declare variable $auth:UTC-TIME-OFFSET := xs:dayTimeDuration("PT8H"); (: use UTC which is GMT :)

declare function auth:getCurrentDateTimeUTC()
{
  fn:current-dateTime() + $auth:UTC-TIME-OFFSET
};

declare function auth:getFullName($username as xs:string)
{
  let $query := cts:and-query((
                    cts:element-value-query(fn:QName($NS, "username"), $username)
                  ))
  
  let $result := cts:search(fn:doc(), $query)[1]
  
  return
    if (fn:starts-with($username, "invalid")) then
      $username
    else
      $result/mml:user/mml:feed/mml:fullName/text()
};

declare function auth:userName()
{
  let $user := map:get($cfg:SESSION, "sessionUser")
  return if($user) then $user else $auth:DEFAULT-USER
};

declare function auth:getLoggedInUserFromHeader()
{
  let $authToken := xdmp:get-request-header("X-Auth-Token")

  let $userInfo   := if (fn:string-length($authToken) eq 0)  then "" else $authToken
  
  let $loggedInUser :=
    if (fn:string-length($authToken) eq 0)  then ""
    else
      auth:findSessionByToken($authToken)/username/text()
  
  return
    if (fn:string-length($loggedInUser) gt 0) then
      $loggedInUser
    else
      $auth:INVALID-USER
};

declare function auth:getUserNamePasswordFromBase64String($userInfoBase64 as xs:string)
{
  let $userPwd  :=
    if ($userInfoBase64) then
    (
      try { xdmp:base64-decode($userInfoBase64) } catch ($e) { "" }
    )
    else ""
  
  let $username := if ($userPwd) then fn:string((xdmp:get-request-header("username"),fn:substring-before($userPwd, ":"))[1]) else ""
  let $password := if ($userPwd) then fn:string((xdmp:get-request-header("password"),fn:substring-after($userPwd, ":"))[1]) else ""
  
  let $userInfo :=
      element userInfo
      {
        element userName { $username }, 
        element password { $password }
      }
      
  return $userInfo
};

declare function auth:login($username as xs:string*, $password as xs:string*)
{
  if(auth:is-valid-user($username,$password)) then
  (
    let $currentSession := auth:findSessionByUser($username)
    let $user := auth:userFind($username)

    let $session := if($currentSession) then $currentSession/*:session else auth:startSession($username)
    
    let $token := xs:string($session/@user-sid)

    return
      <json:object type="object">
        <json:responseCode>200</json:responseCode>
        <json:message>Login successful</json:message>
        <json:authToken>{$token}</json:authToken>
        <json:username>{$user/mml:feed/mml:username/text()}</json:username>
        <json:fullName>{$user/mml:feed/mml:firstName/text()||" "||$user/mml:feed/mml:lastName/text()}</json:fullName>
        <json:expiration>{$session/expiration/text()}</json:expiration>
      </json:object>
  )
  else
  (
    <json:object type="object">
      <json:responseCode>401</json:responseCode>
      <json:message>User/Pass incorrect</json:message>
    </json:object>
  )
};

declare function auth:weblogin($username as xs:string*, $password as xs:string*)
{
  if (auth:is-valid-user($username,$password)) then
  (
    let $currentSession := auth:findSessionByUser($username)
    let $user := auth:userFind($username)

    let $session := if($currentSession) then $currentSession/session else auth:startSession($username)
    (: let $__ := auth:cacheSession($session) :)

    let $token := $session/@user-sid/fn:string()
    let $__    := xdmp:set-session-field("logged-in-user", $user/mml:feed/mml:firstName/text()||" "||$user/mml:feed/mml:lastName/text())
    let $__    := xdmp:set-session-field("logged-in-username", $username)

    return
      element logged-in-user
      {
        element message    { "Login successful" },
        element fullName   { fn:concat($user/mml:feed/mml:firstName/text(), " ", $user/mml:feed/mml:lastName/text()) }, 
        element username   { $user/mml:feed/mml:username/text() }, 
        element expiration { $session/expiration/text() },
        element authToken  { $token }
      }
  )
  else
  (
      element logged-in-user
      {
        element message   { "Invalid Login" },
        element fullName  { "Invalid Username/password" }
      }
  )
};

declare function auth:checkExpiration($session, $username)
{
  let $expiration := xs:dateTime($session/expiration/text())
  
  return
    if ($expiration lt auth:getCurrentDateTimeUTC()) then auth:startSession($username) else $session
};

declare function auth:user-firstname($username as xs:string)
{
  let $user := auth:userFind($username)
  return
    $user/firstname[1]
};

declare function auth:sessionDirectory($username as xs:string) {
  let $usr := auth:userFind($username)
  return
    fn:concat(fn:substring-before(fn:base-uri($usr),"/profile.xml"),"/",$auth:SESSION-PREFIX,"/")
};

declare function auth:startSession($username)
{
  (: let $__ := auth:clearSession($username) :) (: delete any exisitng token docs :)
  let $currDate   := auth:getCurrentDateTimeUTC()
  let $expiration := xs:string($currDate + $auth:SESSION-TIMEOUT)
  let $token      := fn:concat(xdmp:md5(fn:concat(fn:normalize-space($username),xs:string($currDate))), "|", auth:getTokenDateTime($expiration))
  let $uri        := fn:concat(auth:sessionDirectory($username),$token,".xml")

  let $session :=
    element{"session"}
    {
      attribute user-sid    {$token},
      element{"username"}   {$username},
      element{"created"}    {$currDate},
      element{"expiration"} {$expiration}
    }

    let $query := 'xquery version "1.0-ml"; 
                   declare variable $uri as xs:string external; 
                   declare variable $session external;
                   xdmp:document-insert($uri, $session)'    
    return
    (
      xdmp:eval
      (
        $query,
        (xs:QName("uri"),$uri, xs:QName("session"), $session), ()
      )
      , $session
    )
};

declare function auth:getTokenDateTime($expiration)
{
(:
  {1/23/2013 9:38:58 PM}
:)
  let $rawDate    := fn:tokenize(fn:substring($expiration, 1, 19), "T")[1]
  let $rawDay     := fn:tokenize($rawDate, "-")[3]
  let $day        := if (fn:starts-with($rawDay, "0")) then fn:substring($rawDay, 2, 2) else $rawDay
  let $rawMonth   := fn:tokenize($rawDate, "-")[2]
  let $month      := if (fn:starts-with($rawMonth, "0")) then fn:substring($rawMonth, 2, 2) else $rawMonth
  let $year       := fn:tokenize($rawDate, "-")[1]
  let $date       := fn:concat($month, "/", $day, "/", $year)
  let $rawTime    := fn:tokenize(fn:substring($expiration, 1, 19), "T")[2]
  let $time       := xs:time($rawTime)
  let $rawHours   := fn:hours-from-time($time)
  let $minutes    := fn:minutes-from-time($time)
  let $seconds    := fn:seconds-from-time($time)
  let $hours      := if ($rawHours > 12) then $rawHours - 12 else $rawHours
  let $AmPm       := if ($rawHours >= 12) then " PM" else " AM"
  let $tokenTime  := fn:concat($hours, ":", $minutes, ":", $seconds, $AmPm)
  return
    fn:concat($date, " ", $tokenTime)
};

declare function auth:clearSession($username)
{
  for $session in auth:findSessionByUserForCleanup($username)
    return
    (
      (: xdmp:log("........................ deleting token for $uri "||xdmp:node-uri($session)), :)
      auth:deleteToken(xdmp:node-uri($session))
    )
};

declare function auth:deleteToken($uri as xs:string)
{
  let $doc := fn:doc($uri)
  return
    if($doc) then
      xdmp:spawn("/app/lib/deleteToken.xqy", ((xs:QName("uri"), $uri)))
    else ()
};

declare function auth:deleteToken2($uri as xs:string)
{
  let $s := fn:concat('xdmp:document-delete("', $uri, '")')

  let $action :=
    xdmp:eval
    (
      $s, (),
      <options xmlns="xdmp:eval">
        <isolation>different-transaction</isolation> 
        <prevent-deadlocks>false</prevent-deadlocks>
        <database>{xdmp:database()}</database>
      </options>
    )

  return "done"
};

declare function auth:cacheSession($session as element(session))
{
    map:put($cfg:SESSION, "sessionUser", xs:string($session/username) ),
    map:put($cfg:SESSION, "sessionCreated", xs:string($session/created) ),
    map:put($cfg:SESSION, "sessionExpiration", xs:string($session/expiration) )    
};

(: finds valid session using username :)
declare function auth:findSessionByUser($username)
{
  let $query := cts:and-query((
                      cts:directory-query(auth:sessionDirectory($username),"infinity"),
                      cts:element-range-query(xs:QName("expiration"),">", auth:getCurrentDateTimeUTC())
                 ))

  let $uri := cts:uris("",("document","limit=1"), $query )
  
  return
    fn:doc($uri)
};

declare function auth:findSessionByUserForCleanup($username)
{
  let $query := cts:and-query((
                  cts:directory-query(auth:sessionDirectory($username),"infinity"), ()
                ))

  let $uri := cts:uris("",("document","limit=1"), $query )
  
  return
    fn:doc($uri)
};

(: Resets the session if expiration left is less then 50% :)
declare function auth:findSessionByToken($token as xs:string)
{
  let $query := cts:and-query((
                  cts:element-attribute-value-query(xs:QName("session"),xs:QName("user-sid"), $token),
                  cts:element-range-query(xs:QName("expiration"),">", auth:getCurrentDateTimeUTC())
                ))

  let $uri := cts:uris("",("document","limit=1"), $query )
  let $doc := fn:doc($uri)
  
  let $current := fn:current-dateTime()

  return
    if ($doc) then
    (
      let $expiration := xs:dateTime($doc//expiration)
      let $diff := ($expiration - $current)
      
      return
      (
        if($diff < ($auth:SESSION-TIMEOUT div 2) ) then
          (: xdmp:node-replace($doc//expiration/text(), text{fn:current-dateTime()}) :)
          xdmp:log(".................findSessionByToken expiration: '"||$doc//expiration/text()||"'")
        else (),
        $doc/session
      )
    )
    else ()
};

declare function auth:userDirectory()
{
    fn:concat("/user/",auth:userName())
};

declare function auth:is-valid-user($username as xs:string, $password as xs:string)
{
  let $user := auth:userFind($username)
  return
    if($user/mml:feed/mml:password/text() eq xdmp:md5($password)) then fn:true() else fn:false()
};

declare function auth:userFind($username)
{
  if ($username) then
    cts:search(//mml:user,
      cts:element-value-query(fn:QName($NS, "username"), $username))[1]
  else ()
};

declare function auth:logout($username as xs:string)
{
    let $session := auth:findSessionByUser($username)
    let $user := auth:userFind($username)

    let $token := if($session) then $session/session/@user-sid/fn:string() else ()
    
    let $result :=
      if (fn:string-length($token) gt 0) then
      (
        let $_ := auth:clearSession($username)
        return
           <json:object type="object">
              <json:responseCode>200</json:responseCode>
              <json:message>Logout Successful - Token Deleted</json:message>
              <json:authToken>{$token}</json:authToken>
              <json:username>{$username}</json:username>
           </json:object>
      )
      else
      if (fn:string-length($username) gt 0) then
      (
           <json:object type="object">
              <json:responseCode>400</json:responseCode>
              <json:message>user not logged in</json:message>
              <json:authToken>none</json:authToken>
              <json:username>{$username}</json:username>
           </json:object>
      )
      else
      (
           <json:object type="object">
              <json:responseCode>400</json:responseCode>
              <json:message>Unknown Username</json:message>
              <json:authToken>none</json:authToken>
              <json:username>unknown</json:username>
           </json:object>
      )
      
    return $result
};


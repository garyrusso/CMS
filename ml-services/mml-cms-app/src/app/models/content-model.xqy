xquery version "1.0-ml";

module namespace content = "http://marklogic.com/roxy/models/content";

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

declare function content:getContentUri($hash)
{
  let $uri := fn:concat("/content/", $hash, "/")
  
  return $uri
};

declare function content:save($content)
{
(:
{
  "meta": {
    "systemId": "05b8825669ae9dee519349e4a9edafcb",
    "projectState": "start",
    "subjectHeadings": ["Geography"],
    "subjectKeywords": [
      "Hyderabad",
      "Dubai"
    ],
    "projects": ["Beechers 21e", "Jets 2017"]
  },
  "feed": {
    "title": "Beechers 21e EPUB3",
    "description": "The EPUB3/EDUPUB of Beechers Cheese 21th Edition Geography textbook.",
    "source": "Book",
    "creators": ["Harriot Beechers"],
    "publisher": "Harper Collins",
    "datePublished": "2014-06-10",
    "resources": ["/resource/image001.jpg", "/resource/image002.jpg"],
    "contentState": "Initial Review",
    "technical": {
      "fileFormat": "EPUB",
      "fileName": "beechers21e.epub",
      "filePath": "s3://cms/beechers21e.epub",
      "fileSize": "35400"
    }
  }
}
:)
  (
    content:_save(
      element {fn:QName($NS,"mml:content")}
      {
        element {fn:QName($NS,"metadata")}
        {
          element {fn:QName($NS,"systemId")}     { $content/meta/systemId/text() },
          element {fn:QName($NS,"projectState")} { $content/meta/projectState/text() },
          element {fn:QName($NS,"created")}      { fn:current-dateTime() },
          element {fn:QName($NS,"createdBy")}    { "webuser" },
          element {fn:QName($NS,"modified")}     { fn:current-dateTime() },
          element {fn:QName($NS,"modifiedBy")}   { "webuser" },
          element {fn:QName($NS,"objectType")}   { "Content" },
          element {fn:QName($NS,"subjectHeadings")} {
            for $subjectHeading in $content/meta/subjectHeadings/subjectHeading/text()
              return
                element {fn:QName($NS,"subjectHeading")} { $subjectHeading }
          },
          element {fn:QName($NS,"subjectKeywords")} {
            for $subjectKeyword in $content/meta/subjectKeywords/subjectKeyword/text()
              return
                element {fn:QName($NS,"subjectKeyword")} { $subjectKeyword }
          },
          element {fn:QName($NS,"projects")} {
            for $project in $content/meta/projects/project/text()
              return
                element {fn:QName($NS,"project")} { $project }
          }
        },
        element {fn:QName($NS,"feed")}
        {
          element {fn:QName($NS,"title")}         { $content/feed/title/text() },
          element {fn:QName($NS,"description")}   { $content/feed/description/text() },
          element {fn:QName($NS,"source")}        { $content/feed/source/text() },
          element {fn:QName($NS,"publisher")}     { $content/feed/publisher/text() },
          element {fn:QName($NS,"datePublished")} { $content/feed/datePublished/text() },
          element {fn:QName($NS,"contentState")}  { $content/feed/contentState/text() },
          element {fn:QName($NS,"creators")} {
            for $creator in $content/feed/creators/creator/text()
              return
                element {fn:QName($NS,"creator")} { $creator }
          },
          element {fn:QName($NS,"resources")} {
            for $resource in $content/feed/resources/resource/text()
              return
                element {fn:QName($NS,"resource")} { $resource }
          },
          element {fn:QName($NS,"technical")} {
            element {fn:QName($NS,"fileFormat")}   { $content/feed/technical/fileFormat/text() },
            element {fn:QName($NS,"fileName")}   { $content/feed/technical/fileName/text() },
            element {fn:QName($NS,"filePath")}   { $content/feed/technical/filePath/text() },
            element {fn:QName($NS,"fileSize")}   { $content/feed/technical/fileSize/text() }
          }
        }
      }
    ),
    fn:concat("Content Successfully Saved: ", $content/title/text())
  )
};

declare function content:_save($content)
{
  let $hashedDir := xdmp:hash64($content/mml:feed/mml:title/text())
  (: let $log := xdmp:log("......... hash: "||$hashedDir) :)

  let $uri := "/content/"||$hashedDir||".xml"

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $content external;
           xdmp:document-insert($uri, $content, xdmp:default-permissions(), ("content"))'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("uri"), $uri, xs:QName("content"), $content)
    )
};

declare function content:_update($content)
{
  let $uri := content:getContentUri($content/username/fn:string())
  let $doc := fn:doc($uri)

  let $cmd :=
        fn:concat
        (
          'declare variable $uri external;
           declare variable $doc external;
           declare variable $content external;
           xdmp:node-replace(fn:doc()/mml:user/mml:feed/firstname, <firstname>aaa</firstname>)'
        )
  return
    xdmp:eval
    (
      $cmd,
      (xs:QName("doc"), $doc, xs:QName("content"), $content)
    )
};

declare function content:delete($username)
{
  let $uri := content:getContentUri($username)

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
    fn:concat("Content Successfully Deleted: ", $uri)
  )
};

declare function content:get($lookup)
{
  if ($lookup) then
      cts:search(
        //mml:content,
        cts:element-value-query(fn:QName($NS, "title"), $lookup)
      )
  else ()
};

declare function content:getContentDoc($title)
{
  let $doc :=
    if ($title) then
    (
        cts:search(
          fn:doc(),
          cts:and-query((
            cts:directory-query("/content/","infinity"),
            cts:element-value-query(fn:QName($NS, "title"), $title)
          ))
        )[1]
    )
    else ()
  
  let $content :=
    if ($doc) then
      element content-wrapper
      {
        element firstname { $doc/mml:user/mml:feed/mml:firstName/text() }, 
        element lastname  { $doc/mml:user/mml:feed/mml:lastName/text() }, 
        element username  { $doc/mml:user/mml:feed/mml:username/text() }, 
        element password  { $doc/mml:user/mml:feed/mml:password/text() },
        element created   { $doc/mml:user/mml:metadata/mml:created/text() }
      }
    else ()

  return $content
};

declare function content:getContentDocs()
{
  let $docs :=
    for $n in //mml:title
      order by $n/mml:feed/mml:title/text()
        return $n
  
  return
    $docs
};

declare function content:search($type)
{
  content:invoke(
    "search",
    (
      auth:userName(),
      $type,
      $SEARCH-OPTIONS,
      $req:request
    )
  )
};

declare function content:invoke($function, $params)
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


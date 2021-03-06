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

import module namespace c = "http://marklogic.com/roxy/config" at "/app/config/config.xqy";

import module namespace vh = "http://marklogic.com/roxy/view-helper" at "/roxy/lib/view-helper.xqy";

import module namespace facet = "http://marklogic.com/roxy/facet-lib" at "/app/views/helpers/facet-lib.xqy";

declare namespace search = "http://marklogic.com/appservices/search";

declare option xdmp:mapping "false";

declare variable $q as xs:string? := vh:get("q");
declare variable $page as xs:int := vh:get("page");
declare variable $search-options as element(search:options) := vh:get("search-options");
declare variable $response as element(search:response)? := vh:get("response");

declare function local:transform-snippet-orig($nodes as node()*)
{
  for $n in $nodes
  return
    typeswitch($n)
      case element(search:highlight) return
        <span xmlns="http://www.w3.org/1999/xhtml" class="highlight">{fn:data($n)}</span>
      case element() return
        element div
        {
          attribute class { fn:local-name($n) },
          local:transform-snippet(($n/@*, $n/node()))
        }
      default return $n
};

declare function local:transform-snippet($nodes as node()*)
{
  for $n in $nodes
    let $sdoc1 := $n/..
    let $sdoc2 := $n/../../..
    let $sdoc3 := fn:doc($sdoc1/@uri)
    let $sdoc4 := fn:doc($sdoc2/@uri)
    
    let $log := xdmp:log("111............... $sdoc1/@uri: "||$sdoc1/@uri)
    let $log := xdmp:log("222............... $sdoc2/@uri: "||$sdoc2/@uri)
    let $log := xdmp:log("333............... uri: "||xdmp:node-uri($n))

  return
    typeswitch($n)
      case element(search:highlight) return
      (:
        let $node1 := xdmp:eval($n/../@path)
        let $log := xdmp:log("222............... path: "||$n/../@path)
        return
      :)
          <span xmlns="http://www.w3.org/1999/xhtml" class="highlight">{fn:data($n)}</span>
          
      case element() return
        let $docUri := xs:string($sdoc1/@uri)
        let $log := xdmp:log("444............... path: "||$docUri)
        let $doc := fn:doc($docUri)
        let $docType := fn:substring-after(xs:string(fn:node-name($doc/child::element())), "mml:")
        
        return
          if (fn:string-length($docUri) gt 0) then
          (
            if ($docType eq "user") then
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                  <tr><td width="145" valign="top">username</td><td valign="top">{$doc//*:username/text()}</td></tr>
                  <tr><td width="145" valign="top">Full Name</td><td valign="top">{$doc//*:fullName/text()}</td></tr>
                  <tr><td width="145" valign="top">First Name</td><td valign="top">{$doc//*:firstName/text()}</td></tr>
                  <tr><td width="145" valign="top">Last Name</td><td valign="top">{$doc//*:lastName/text()}</td></tr>
                  <tr><td width="145" valign="top">Password</td><td valign="top">{$doc//*:password/text()}</td></tr>
                  <tr><td width="145" valign="top">Created</td><td valign="top">{$doc//*:created/text()}</td></tr>
                </table>
              }
            else
            if ($docType eq "user") then
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                  <tr><td width="145" valign="top">Dictionary Type</td><td valign="top">{$docType}</td></tr>
                </table>
              }
            else
            if ($docType eq "project") then
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                  <tr><td width="145" valign="top">Project Title</td><td valign="top">{$doc//*:title/text()}</td></tr>
                </table>
              }
            else
            if ($docType eq "auditRecord") then
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                  <tr><td width="145" valign="top">Target Uri</td><td valign="top">{$doc//*:auditTargetUri/text()}</td></tr>
                  <tr><td width="145" valign="top">Action</td><td valign="top">{$doc//*:action/text()}</td></tr>
                </table>
              }
            else
            if ($docType eq "fileInfo") then
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                  <tr><td width="145" valign="top">Target Uri</td><td valign="top">{$doc//*:uri/text()}</td></tr>
                  <tr><td width="145" valign="top">Size (bytes)</td><td valign="top">{fn:format-number($doc//*:size/text(), "#,###")}</td></tr>
                </table>
              }
            else
              element div
              {
                <table border="1" width="100%">
                  <tr><td width="145" valign="top">URI</td><td valign="top"><a target="_blank" href="view.xml?uri={$docUri}">{$docUri}</a></td></tr>
                  <tr><td width="145" valign="top">Type</td><td valign="top">{$docType}</td></tr>
                </table>
              }
          )
          else
            element div
            {
              attribute class { fn:local-name($n) },
              local:transform-snippet(($n/@*, $n/node()))
            }
      
      default
        return $n
      
      (:
        let $docUri := if ($n) then $n/../@uri else ""
        let $log := xdmp:log("555............... path: "||$docUri)
      :)
      
};

vh:add-value("sidebar",
  <div class="sidebar" arcsize="5 5 0 0" xmlns="http://www.w3.org/1999/xhtml">
  {
    facet:facets($response/search:facet, $q, $c:SEARCH-OPTIONS, $c:LABELS)
  }
  </div>

),

let $page := ($response/@start - 1) div $c:DEFAULT-PAGE-LENGTH + 1
let $total-pages := fn:ceiling($response/@total div $c:DEFAULT-PAGE-LENGTH)
return
  <div xmlns="http://www.w3.org/1999/xhtml" id="search">
  {
    if ($response/@total gt 0) then
    (
      <div class="pagination">
        <span class="status">Showing {fn:string($response/@start)} to {fn:string(fn:min(($response/@start + $response/@page-length - 1, $response/@total)))} of <span id="total-results">{fn:string($response/@total)}</span> Results </span>
        <span class="nav">
          <span id="first" class="button">
          {
            if ($page gt 1) then
              <a href="/?q={$q}&amp;page=1">&laquo;</a>
            else
              "&laquo;"
          }
          </span>
          <span id="previous" class="button">
          {
            if ($page gt 1) then
              <a href="?q={$q}&amp;page={$page - 1}">&lt;</a>
            else
              "&lt;"
          }
          </span>
          <span id="next" class="button">
          {
            if ($page lt $total-pages) then
              <a href="?q={$q}&amp;page={$page + 1}">&gt;</a>
            else
              "&gt;"
          }
          </span>
          <span id="last" class="button">
          {
            if ($page lt $total-pages) then
              <a href="?q={$q}&amp;page={$total-pages}">&raquo;</a>
            else
              "&raquo;"
          }
          </span>
        </span>
      </div>,
      <div class="results">
      {
        for $result at $i in $response/search:result
        let $doc := fn:doc($result/@uri)/*
        return
          <div class="result">
          {
            local:transform-snippet($result/search:snippet)
          }
          </div>
      }
      </div>
    )
    else
      <div class="results">
        <h2>No Results Found</h2>
      </div>
  }

  </div>
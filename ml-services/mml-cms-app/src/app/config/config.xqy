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

module namespace c = "http://marklogic.com/roxy/config";

import module namespace def = "http://marklogic.com/roxy/defaults" at "/roxy/config/defaults.xqy";

declare namespace rest = "http://marklogic.com/appservices/rest";

declare variable $c:RESOURCE-DB := "@ml.resource-db";

declare variable $c:SESSION  := map:map();

(: Allows unauthenticated requests if set to true :)
declare variable $c:SESSION-AUTHENTICATE := fn:true();

(:
 : ***********************************************
 : Overrides for the Default Roxy control options
 :
 : See /roxy/config/defaults.xqy for the complete list of stuff that you can override.
 : Roxy will check this file (config.xqy) first. If no overrides are provided then it will use the defaults.
 :
 : Go to https://github.com/marklogic/roxy/wiki/Overriding-Roxy-Options for more details
 :
 : ***********************************************
 :)
declare variable $c:ROXY-OPTIONS :=
  <options>
    <layouts>
      <layout format="html">two-column</layout>
    </layouts>
  </options>;

(:
 : ***********************************************
 : Overrides for the Default Roxy scheme
 :
 : See /roxy/config/defaults.xqy for the default routes
 : Roxy will check this file (config.xqy) first. If no overrides are provided then it will use the defaults.
 :
 : Go to https://github.com/marklogic/roxy/wiki/Roxy-URL-Rewriting for more details
 :
 : ***********************************************
 :)
declare variable $c:ROXY-ROUTES :=
  <routes xmlns="http://marklogic.com/appservices/rest">

    <request uri="^/(ping)/?$" endpoint="/app/restful-router.xqy">
      <uri-param name="controller" default="general">ping</uri-param>
      <uri-param name="func" default="main"></uri-param>
      <uri-param name="format" default="json"></uri-param>
      <http method="GET"/>
      <http method="HEAD"/>
    </request>

    <request uri="^/[S|s]earch\.?(\w*)/?$" endpoint="/app/restful-router.xqy">
      <uri-param name="controller" default="search"></uri-param>
      <uri-param name="func" default="main"></uri-param>
      <uri-param name="format" default="json"></uri-param>
      <uri-param name="docid">$1</uri-param>
      <http method="GET"/>
      <http method="HEAD"/>
    </request>

    <request uri="^/(login|logout)/?$" endpoint="/app/restful-router.xqy">
      <uri-param name="controller" default="general">$1</uri-param>
      <uri-param name="func" default="main"></uri-param>
      <uri-param name="format" default="json"></uri-param>
      <http method="GET"/>
      <http method="HEAD"/>
      <http method="POST"/>
    </request>

    {
      $def:ROXY-ROUTES/rest:request
    }
  </routes>;

(:
 : ***********************************************
 : A decent place to put your appservices search config
 : and various other search options.
 : The examples below are used by the appbuilder style
 : default application.
 : ***********************************************
 :)
declare variable $c:DEFAULT-PAGE-LENGTH as xs:int := 10;

declare variable $c:SEARCH-OPTIONS :=
  <options xmlns="http://marklogic.com/appservices/search">
    <search-option>unfiltered</search-option>
    <term>
      <term-option>case-insensitive</term-option>
    </term>
    <additional-query>
      <cts:not-query xmlns:cts="http://marklogic.com/cts">
        <cts:collection-query>
          <cts:uri>binary</cts:uri>
        </cts:collection-query>
      </cts:not-query>
    </additional-query>
    <constraint name="Types">
      <range type="xs:string">
        <element ns="http://macmillanlearning.com" name="objectType"/>
        <facet-option>descending</facet-option>
        <facet-option>limit=10</facet-option>
      </range>
    </constraint>
    <constraint name="Subjects">
      <range type="xs:string">
        <element ns="http://macmillanlearning.com" name="subjectHeading"/>
        <facet-option>descending</facet-option>
        <facet-option>limit=10</facet-option>
      </range>
    </constraint>
    <constraint name="Keywords">
      <range type="xs:string">
        <element ns="http://macmillanlearning.com" name="subjectKeyword"/>
        <facet-option>descending</facet-option>
        <facet-option>limit=10</facet-option>
      </range>
    </constraint>
    <sort-order type="xs:string" collation="http://marklogic.com/collation/" direction="ascending">
      <element ns="http://macmillanlearning.com" name="subjectKeyword"/>
    </sort-order>
    <sort-order direction="ascending">
      <score/>
    </sort-order>
    <return-results>true</return-results>
    <return-query>true</return-query>
  </options>;

(:
 : Labels are used by appbuilder faceting code to provide internationalization
 :)
declare variable $c:LABELS :=
  <labels xmlns="http://marklogic.com/xqutils/labels">
    <label key="facet1">
      <value xml:lang="en">Users</value>
    </label>
  </labels>;
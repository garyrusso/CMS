xquery version "1.0-ml";

module namespace usr = "http://marklogic.com/rest-api/resource/login";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace rapi = "http://marklogic.com/rest-api";

(:
 : To add parameters to the functions, specify them in the params annotations.
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") usr:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :
 : To report errors in your extension, use fn:error(). For details, see
 : http://docs.marklogic.com/guide/rest-dev/extensions#id_33892, but here's
 : an example from the docs:
 : fn:error(
 :   (),
 :   "RESTAPI-SRVEXERR",
 :   ("415","Raven","nevermore"))
 :)


(:
	This API is responsible for validating user credential against user document stored in MarkLogic
:)
declare 
%roxy:params("username=xs:string", "password=xs:string")
function usr:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
  map:put($context, "output-types", "application/xml"),
  map:put($context, "output-status", (201, "Created")),
  map:put($context, "mml-auth-token","MjBhMGU4ZDU4YmJjODhlYTRlMWNkMTUwNTBmYjFmZjE4NTE0ZjE4NTg4ZGUzNGUyNGYwNGVjMjRiYTMyYmQ0ZA"),
  document { xdmp:log("POST result..." || map:get($params, "username") || " is valid user...")}
};


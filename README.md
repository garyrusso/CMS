# CMS

CMS application is designed and developed as service based architecture and each layer will communicate with other via REST API's.  

Application layers:

1. Web application - Angular JS
2. Middle tier / Business services - .NET web API's
3. Database tier - MarkLogic


## MarkLogic Database Tier

Will provide the following RESTFul APIs.

1. Authentication API 
1. Master Data Definition API
1. Project Document API - Create, View, Edit, Delete (Change State), and Search
1. Content Upload API – binary document via XCC & create wrapper document & audit document
1. Content Wrapper API - View, Edit, Delete (Change State), and Search will also include audit information
1. Listing of contents – MarkLogic search API with facet constraints, project associations
1. Project List API - will show content associations (related content)
1. Content Download API (binary document)


### Database RESTful APIs

<table>
    <tr>
        <td colspan="4" style="font-size:x-large;color:green"><b>Request Mappings</b></td>
    </tr>
    <tr>
        <td width="100" style="background-color:green;color:white"><b>Method</b></td>
        <td width="180" style="background-color:green;color:white"><b>URL Template</b></td>
        <td width="420" style="background-color:green;color:white"><b>Parameters</b></td>
        <td width="720" style="background-color:green;color:white"><b>Description</b></td>
    </tr>
    <tr>
        <td valign="top" colspan="4"><b>Authentication APIs</b></td>
    </tr>
    <tr>
        <td valign="top">GET or POST</td>
        <td valign="top">/login</td>
        <td valign="top">
		<table>
			<tr><td valign="top">X-Auth-Token</td><td>header<hr/>uses base 64 encoded string</td></tr>
		</table>
		</td>
        <td valign="top" style ="font-family:'Courier New'">Login API looks for valid user. If user is found and validated then a session document is generated that has a token.</br>The token is then used for all subsequent REST API requests.</br>Token will expire after 24 hours.</br></td>
    </tr>
    <tr>
        <td valign="top">GET</td>
        <td valign="top">/logout</td>
        <td valign="top">
		<table>
			<tr><td valign="top">X-Auth-Token</td><td>header<hr/>uses base 64 encoded string</td></tr>
		</table>
		</td>
        <td valign="top" style ="font-family:'Courier New'">pending....</td>
    </tr>
    <tr>
        <td valign="top" colspan="4"><b>Project APIs</b></td>
    </tr>
    <tr>
        <td valign="top">GET</td>
        <td valign="top">/search</td>
        <td valign="top">
		<table>
			<tr><td valign="top">rs:q</td><td>query string<hr/>leading and trailing wildcards<hr/>constraints:<ul><li>author</li><li>name</li><li>user</li><li>book</li></ul></td></tr>
			<tr><td valign="top">rs:start</td><td>starting record</td></tr>
			<tr><td valign="top">rs:pageLength</td><td>number of records to return</td></tr>
		</table>
		</td>
        <td valign="top" style ="font-family:'Courier New'">Searches entire content repository.<hr/>Returns search results using custom snippets with highlighting.</td>
    </tr>
    <tr>
        <td valign="top">GET</td>
        <td valign="top">/project/search</td>
        <td valign="top">
		<table>
			<tr><td valign="top">rs:q</td><td>query string<hr/>leading and trailing wildcards<hr/>constraints:<ul><li>author</li><li>name</li><li>user</li><li>book</li></ul></td></tr>
			<tr><td valign="top">rs:start</td><td>starting record</td></tr>
			<tr><td valign="top">rs:pageLength</td><td>number of records to return</td></tr>
		</table>
		</td>
        <td valign="top" style ="font-family:'Courier New'">Search across all project data of all users.<hr/>Returns search results using custom snippets with highlighting.</td>
    </tr>
</table>


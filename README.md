# CMS

CMS application is designed and developed as service based architecture and each layer will communicate with other via REST API's.  

Application layers:

1. Web application - Angular JS
2. Middle tier / Business services - .NET web API's
3. Database tier - MarkLogic

## Deploy
For developers execute below commands
* $ ml local bootstrap
* $ ml local deploy modules

### for master data 
Here we load user document data & data dictionary data
* $ ml local deploy content

***

[Content Repo Demo Build](http://ec2-54-209-174-53.compute-1.amazonaws.com:8060/)

[CMS Project Wiki](../../wiki)

***

## API Specs

[Authentication API](../../wiki/Authentication-API)

[Content API](../../wiki/Content-API)

[Dictionary API](../../wiki/Dictionary-API)

[File API](../../wiki/File-API)

[Project API](../../wiki/Project-API)

[Search All API](../../wiki/Search-All-API)

[User API](../../wiki/User-API)

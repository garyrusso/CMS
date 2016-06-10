# Macmillan CMS web application
CMS web application is developed using AngularJs, HTML5, CSS3 and Bootstrap.

## Table of contents
 - [Introduction](#introduction)
 - [Dependency Libraries](#dependency-libraries)
 - [Folder Structure](#folder-structure)
 - [Configuration](#configuration)
 - [Deployment] (#deployment)
 
## Introduction
The goal of this project is to build a Content Management System for managing course content thus enable near simultaneous publishing course content in Print and Digital format.  The project is scoped to build a content repository, ensuring compliance with Macmillan Learning’s technology stack.

## Dependency Libraries
Dependency Libraries are downloaded to vendor folder and configured to application. Libraries used in this application are listed below:
* [AngularJs v1.5.5](https://angularjs.org/) 
* [Bootstrap v3.3.6](https://getbootstrap.com)
* [Angular Ui-router v0.2.18](https://github.com/angular-ui/ui-router/wiki)
* [Angular Ui-Bootstrap v1.3.2](https://angular-ui.github.io/bootstrap/)
* [Underscore.js v1.8.3](http://underscorejs.org/)
* [ng-Table v0.8.3](http://ng-table.com/)
* [ui-select v0.17.1](http://github.com/angular-ui/ui-select)
* [ng-flow v2.7.1](https://flowjs.github.io/ng-flow/)

## Folder Structure
The folder structure of application as follows:
 - images (folder with all images)
 - scripts (folder with all own/created javascript script files)
   - configs (Folder with all Angular config blocks)
   - constants (Folder with all Angular constants)
   - controllers (Folder with all Angular Controllers)
   - modules (Folder with all Angular custom modules)
   - services (Folder with all Angular Services)
   - app.js (Main Angular application code)
   - app-run.js (Angular run block)
 - styles (folder with all own/created CSS files)
 - vendor (folder with dependencies libraries/frameworks downloaded which are required in our app like angular & bootstrap)
 - index.html (base html file for our Angular app)
 - favicon.ico (tab/ bookmark icon) - yet to be added
 - Readme.md (General information about the project)
 
## Configuration 
Configure the environment in the configuration.constant.js file. Please find the property name 'environment' in the file and set the environment name. Find the environment names in next section. 

### Path of Configuration file
scripts/constants/configuration.constant.js

### Environments
List of Environments added in the application is listed below:
 - developmentLocal (For Ui development with Ui mock data)
 - development (Ui with .net service integration)
 - qa (QA purpose)
 - production (For Production)
Note: Above listed environments name are final & will be changed as per project requirement
### Configuring Environment 
Below are the properties to setup an environment:
 - useMocks (true/false whether to use ui mock data)
 - fakeDelay (true/false whether the services should be delayed with some fake time and fakeDelay can be used only with mock ie., useMocks:true)
 - fakeDelayTime (intreger, time for delaying the service and its applies only when fakeDelay & useMocks are true)
 - baseUrl (Base url of the webservices ex:'http://midlayerhost/api/v1/' and its applies only when useMocks is false)
 - debug (true/false debug mode will show all console messages if debug is true)

## Deployment
Ui Application can be deployed in any webserver which allow deploying static html sites and deploying it in IIS server. 

### Pre Deployment
 - Add the relevant environment name to 'environment' property in [configuration.constant.js](https://github.com/macmillanhighered/CMS/blob/master/webapp/scripts/constants/configuration.constant.js). See path of [configuration.constant.js](#path-of-configuration-file)
     Example:
     ```
     environment : 'qa',
     ``` 
 - Check whether the environment properties set correctly under 'API' -> 'environment name' in configuration.constant.js file. see [Configuring Environment](#configuring-environment)
 - Check whether 'baseUrl' is set correctly under 'API' -> 'environment name' -> 'baseUrl', if not using mock data.
     Example:
     ```
     API: {
        ...,
        qa : {
            useMocks : false,
            fakeDelay : false,
            fakeDelayTime: 0,
            baseUrl : 'http://midlayerhost/api/v1/',//Base url of the webservices
            debug : false
        }
     }
     ```

### Webserver
IIS

### Steps to Host CMS Ui application in IIS
Steps to Host CMS Ui application in IIS:
 - Open IIS Manager, expand out the web server and then expand the Sites folder. Right click on sites and then click on Add Web Site.
 - In the Add Web Site window we have some basic information to fill out for a static site:
   - Site Name - Name of the site, this will be either domain.com or *.domain.com (Where * would represent a sub domain name such as www or blog for example)
   - Physical Path - The location on the local server that will hold the files for the website. ie., select [webapp](https://github.com/macmillanhighered/CMS/tree/master/webapp) folder    
   - Type - choose either http or https depending on whether your site will use Secure Socket Layer (SSL) certificate or not
   - IP Address - From the dropdown you can specify what IP the website should answer on or use the default switch of All Unassigned
   - Host Name – If you would like this site to respond to other domain names you can put these here

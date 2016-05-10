using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class ManageProjectDAL: IManageProjectDAL
    {
        public object CreateProject(Project project)
        {
            //Call ML and post the project xml

            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{'systemUID': 'd41d8cd98f00b204e9800998ecf8427e',
                'uri': '/projects/project1.xml',
                'path': 'fn:doc(\'/projects/project1.xml\')',
                'href': '/v1/documents?uri=%2Fprojects%2Fproject1.xml',
                'mimetype': 'application/xml',
                'format': 'xml',
                'dateCreated': '2015-04-15 13:30',
                'dateLastModified': '2015-04-15 13:30',
                'username': 'bcross',
                'createdBy': 'Brian Cross',
                'modifiedBy': 'Brian Cross',
                'Title': 'Hockenbury 5e-1',
                'description': 'Project description',
                'projectState': 'Active',
                'subjectHeadings': [
                    {
                        'subjectHeading': 'Psychology'
                    },
                    {
                        'subjectHeading': 'Biology'
                    }
                ],
               'subjectKeywords': [
                    {
                        'subjectKeyword': 'Psychology'
                    },
                    {
                        'subjectKeyword': 'Biology'
                    }
                ],
                'content': [
                    {
                        'systemUID': 'd41d8cd98f00b204e9800998ecf8427e',
                        'uri': '/documents/content1.xml',
                        'path': 'fn:doc(\'/documents/content1.xml\')',
                        'href': '/v1/documents?uri=%2Fdocuments%2Fcontent1.xml',
                        'mimetype': 'application/xml',
                        'format': 'xml',
                        'dateCreated': '2015-04-15 13:30',
                        'dateLastModified': '2015-04-15 13:30',
                        'username': 'bcross',
                        'createdBy': 'Brian Cross',
                        'modifiedBy': 'Brian Cross',
                        'Title': 'Content-1'
                    },
                    {
                        'systemUID': 'd41d8cd98f00b204e9800998ecf8427e',
                        'uri': '/documents/content2.xml',
                        'path': 'fn:doc(\'/documents/content2.xml\')',
                        'href': '/v1/documents?uri=%2Fdocuments%2Fcontent2.xml',
                        'mimetype': 'application/xml',
                        'format': 'xml',
                        'dateCreated': '2015-04-15 13:30',
                        'dateLastModified': '2015-04-15 13:30',
                        'username': 'bcross',
                        'createdBy': 'Brian Cross',
                        'modifiedBy': 'Brian Cross',
                        'Title': 'Content-2'
                         }
                         ]}";
            return ser.DeSerialize(content);
        }

             public object UpdateProject(Project project)
        {
            //Call ML and Put the project xml
            return null;
        }

        public object DeleteProject(Project project)
        {
            //Call ML and Delete the project xml
            return null;
        }

        public object GetProjectDetails(int projectId)
        {
            return 0;
        }

        public object GetProjectMasterData(string type)
        {
            return null;
        }

        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            return null;
        }
    }
}
  


       


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
    public class ManageProjectDAL : IManageProjectDAL
    {
        public object CreateProject(Project project)
        {
            //Call ML and post the project xml

            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{'Title': 'Hockenbury 5e-1',
                                  'uri': '/mydocuments/project1.xml',
                                  'path': 'fn:doc(\'/mydocuments/project1.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'                                   
                                   }";
            return ser.DeSerialize(content);
        }

        public object UpdateProject(Project project)
        {
            //Call ML and Put the project xml
            return project;
        }

        public object DeleteProject(Project project)
        {
            //Call ML and Delete the project xml
            return true;
        }
        public object GetProjectDetails(string uri)
        {
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{
                    'systemUID': 'd41d8cd98f00b204e9800998ecf8427e',
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
                    ]
                }";
            return ser.DeSerialize(content);
        }
        public object GetProjectMasterData(List<Project> ProjectDetail)
        {
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{'Title': 'Hockenbury 5e-1',
                                  'uri': '/mydocuments/project1.xml',
                                  'path': 'fn:doc(\'/mydocuments/project1.xml\')',
                                  'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
                                  'mimetype': 'application/xml',
                                  'format': 'xml',
                                  'dateLastModified': '2015-04-15 13:30',
                                  'username': 'bcross',
                                  'fullName': 'Brian Cross'
                                   }
                                   }";
            return ser.DeSerialize(content);
        }
        public object SearchProjects(string searchText, int pageNumber, int pageSize, string orderBy)
        {
            JsonNetSerialization ser = new JsonNetSerialization();
            string content = @"{
	                    'total': 27,
	                    'start': 1,
	                    'page-length': 10,
	                    'results': [{
		                    'Title': 'Hockenbury 5e-1',
		                    'uri': '/mydocuments/project1.xml',
		                    'path': 'fn:doc(\'/mydocuments/project1.xml\')',
		                    'href': '/v1/documents?uri=%2Fmydocuments%2Fproject1.xml',
		                    'mimetype': 'application/xml',
		                    'format': 'xml',
		                    'dateLastModified': '2015-04-15 13:30',
		                    'username': 'bcross',
		                    'fullName': 'Brian Cross'

	                    }, {
		                    'Title': 'Hockenbury 5e-2',
		                    'uri': '/mydocuments/project2.xml',
		                    'path': 'fn:doc(\'/mydocuments/project2.xml\')',
		                    'href': '/v1/documents?uri=%2Fmydocuments%2Fproject2.xml',
		                    'mimetype': 'application/xml',
		                    'format': 'xml',
		                    'dateLastModified': '2015-04-15 13:30',
		                    'username': 'bcross',
		                    'fullName': 'Brian Cross'

	                    }, {
		                    'Title': 'Hockenbury 5e-3',
		                    'uri': '/mydocuments/project3.xml',
		                    'path': 'fn:doc(\'/mydocuments/project3.xml\')',
		                    'href': '/v1/documents?uri=%2Fmydocuments%2Fproject3.xml',
		                    'mimetype': 'application/xml',
		                    'format': 'xml',
		                    'dateLastModified': '2015-04-15 13:30',
		                    'username': 'bcross',
		                    'fullName': 'Brian Cross'

	                    }, {
		                    'Title': 'Hockenbury 5e-4',
		                    'uri': '/mydocuments/project4.xml',
		                    'path': 'fn:doc(\'/mydocuments/project4.xml\')',
		                    'href': '/v1/documents?uri=%2Fmydocuments%2Fproject4.xml',
		                    'mimetype': 'application/xml',
		                    'format': 'xml',
		                    'dateLastModified': '2015-04-15 13:30',
		                    'username': 'bcross',
		                    'fullName': 'Brian Cross'

	                    }],
	                    'facets': {
		                    'projectState': {
			                    'type': 'xs:string',
			                    'facetValues': [{
				                    'name': 'Active',
				                    'count': 12,
				                    'value': 'Active'
			                    }, {
				                    'name': 'InActive',
				                    'count': 1,
				                    'value': 'InActive'
			                    }]
		                    },
		                    'Title': {
			                    'type': 'xs:string',
			                    'facetValues': [{
				                    'name': 'Hockenbury 5e',
				                    'count': 4,
				                    'value': 'Hockenbury 5e'
			                    }, {
				                    'name': 'Hockenbury 5e-1',
				                    'count': 1,
				                    'value': 'Hockenbury 5e-1'
			                    }, {
				                    'name': 'Hockenbury 5e-2',
				                    'count': 1,
				                    'value': 'Hockenbury 5e-2'
			                    }, {
				                    'name': 'Hockenbury 5e-3',
				                    'count': 1,
				                    'value': 'Hockenbury 5e-3'
			                    }, {
				                    'name': 'Hockenbury 5e-4',
				                    'count': 1,
				                    'value': 'Hockenbury 5e-4'
			                    }, {
				                    'name': 'Myers 11e EPUB3',
				                    'count': 1,
				                    'value': 'Myers 11e EPUB3'
			                    }]
		                    },
		                    'Subjects': {
			                    'type': 'xs:string',
			                    'facetValues': [{
				                    'name': 'Psychology',
				                    'count': 13,
				                    'value': 'Psychology'
			                    }]
		                    },
		                    'query': {
			                    'and-query': [{
				                    'element-range-query': [{
					                    'operator': '=',
					                    'element': '_1:subjectHeading',
					                    'value': [{
						                    'type': 'xs:string',
						                    '_value': 'Psychology'
					                    }],
					                    'option': 'collation=http://marklogic.com/collation/'
				                    }],
				                    'annotation': [{
					                    'operator-ref': 'sort',
					                    'state-ref': 'relevance'
				                    }]
			                    }]
		                    }
	                    }
                    }";

            return ser.DeSerialize(content);
        }
    }
}






using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class SearchDataDAL : ISearchDataDAL
    {
        /// <summary>
        /// GetData for search data with given details
        /// </summary>
        /// <param name="orderBy"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchText"></param>
        /// <param name="searchType"></param>
        /// <param name="userName"></param>
        /// <returns>Returns object for GetData</returns>
        public object GetData(string orderBy, int pageNumber, int pageSize, string searchText, string searchType, string userName)
        {
            Logger.Debug("Entering GetData");
            JsonNetSerialization ser = new JsonNetSerialization();
            string con;
            if (searchType == "content")
            {
                con = @"{'total':24,'start':1,'page-length':20,'results':[{'Title':'Myers 11e EPUB3-1','uri':'/mydocuments/conent1.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent1.xml','mimetype':'application/xml','format':'xml','fileName':'Jouve-MyersEPCH10e_Ch03_20160217.zip','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB3-2','uri':'/mydocuments/conent2.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent2.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB3-3','uri':'/mydocuments/conent3.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent3.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-4','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-5','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-6','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-7','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-8','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-9','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'},{'Title':'Myers 11e EPUB4-10','uri':'/mydocuments/conent4.xml','href':'/v1/documents?uri=%2Fmydocuments%2Fconent4.xml','mimetype':'application/xml','format':'xml','fileName':'myers113.epub','dateLastModified':'2015-04-15 13:30','username':'bcross','fullName':'Brian Cross'}],'facets':{'Projects':{'type':'xs:string','facetValues':[{'name':'Hockenbury 6e','count':5,'value':'Hockenbury 6e'},{'name':'Myers11e','count':5,'value':'Myers11e'},{'name':'Jacobs 1e','count':4,'value':'Jacobs 1e'},{'name':'Thomposn 7e','count':4,'value':'Thomposn 7e'},{'name':'Jones 1e','count':3,'value':'Jones 1e'},{'name':'Hockenbury 5e-1','count':4,'value':'Hockenbury 5e-1'}]},'ContentState':{'type':'xs:string','facetValues':[{'name':'Vendor','count':122,'value':'Vendor'},{'name':'DLAP Ready','count':108,'value':'DLAP Ready'}]},'Publisher':{'type':'xs:string','facetValues':[{'name':'Worth Publisher','count':23,'value':'Worth Publisher'},{'name':'Bedford/St. Martins','count':18,'value':'Bedford/St. Martins'},{'name':'W.H. Freeman','count':15,'value':'W.H. Freeman'},{'name':'Hayden-McNeil','count':14,'value':'Hayden-McNeil'},{'name':'PrepU','count':5,'value':'PrepU'}]},'FileFormat':{'type':'xs:string','facetValues':[{'name':'EPUB','count':13,'value':'EPUB'},{'name':'Zip','count':1,'value':'Zip'}]},'Subjects':{'type':'xs:string','facetValues':[{'name':'English','count':21,'value':'English'},{'name':'Mathematics','count':18,'value':'Mathematics'},{'name':'Psychology','count':15,'value':'Psychology'},{'name':'History','count':13,'value':'History'}]},'Keywords':{'type':'xs:string','facetValues':[{'name':'Test File','count':7,'value':'Test File'},{'name':'Working','count':5,'value':'Working'}]},'query':{'and-query':[{'element-range-query':[{'operator':'=','element':'_1:subjectHeading','value':[{'type':'xs:string','_value':'Psychology'}],'option':'collation=http://marklogic.com/collation/'}],'annotation':[{'operator-ref':'sort','state-ref':'relevance'}]}]}}}";
            }
            else
            {
                con = @"{
	                            'total': 27,
	                            'start': 1,
	                            'page-length': 10,
	                            'results': [{
		                            'Title': 'Myers 11e EPUB3',
		                            'uri': '/mydocuments/conent1.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent1.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent1.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB3-2',
		                            'uri': '/mydocuments/conent2.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent2.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent2.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB3-3',
		                            'uri': '/mydocuments/conent3.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent3.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent3.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
		                            'dateLastModified': '2015-04-15 13:30',
		                            'username': 'bcross',
		                            'fullName': 'Brian Cross'

	                            }, {
		                            'Title': 'Myers 11e EPUB4-4',
		                            'uri': '/mydocuments/conent4.xml',
		                            'path': 'fn:doc(\'/mydocuments/conent4.xml\')',
		                            'href': '/v1/documents?uri=%2Fmydocuments%2Fconent4.xml',
		                            'mimetype': 'application/xml',
		                            'format': 'xml',
		                            'fileName': 'myers113.epub',
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
		                            'Projects': {
			                            'type': 'xs:string',
			                            'facetValues': [{
				                            'name': 'Hockenbury 5e',
				                            'count': 4,
				                            'value': 'Hockenbury 5e'
			                            }]
		                            },
		                            'Subjects': {
			                            'type': 'xs:string',
			                            'facetValues': [{
				                            'name': 'Psychology',
				                            'count': 13,
				                            'value': 'Psychology'
			                            }]
		                            }
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
                            ";
            }

            var results = ser.DeSerialize(con);
            Logger.Debug("Exiting GetData");
            return results;
        }
    }
}

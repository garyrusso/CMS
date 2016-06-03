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
            string con = @"{
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
				                            'name': '',
				                            'count': 1,
				                            'value': ''
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

            var results = ser.DeSerialize(con);
            Logger.Debug("Exiting GetData");
            return results;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Macmillan.CMS.Business;
namespace Macmillan.CMS.Service.Controllers
{
    public class DictionaryController : ApiController
    {
        IDictionaryBusiness dictionaryBusiness;
        public DictionaryController(IDictionaryBusiness business)
        {
            this.dictionaryBusiness = business;
        }

        [HttpGet]
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            return this.dictionaryBusiness.GetDictionary(dictionaryType, outputFormat);
        }

    }
}
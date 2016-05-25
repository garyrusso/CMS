using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Macmillan.CMS.Business;
using Macmillan.CMS.Common.Logging;
namespace Macmillan.CMS.Service.Controllers
{
    public class DictionaryController : ApiController
    {
        IDictionaryBusiness dictionaryBusiness;
        public DictionaryController(IDictionaryBusiness business)
        {
            this.dictionaryBusiness = business;
        }

        /// <summary>
        /// GetDictionary with given details
        /// </summary>
        /// <param name="dictionaryType"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        [HttpGet]
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            Logger.Debug("Entering GetDictionary");
            var results = this.dictionaryBusiness.GetDictionary(dictionaryType, outputFormat);
            Logger.Debug("Exiting GetDictionary");
            return results;
        }

    }
}
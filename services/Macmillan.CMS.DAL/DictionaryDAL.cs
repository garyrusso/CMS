using Macmillan.CMS.Common;
using Macmillan.CMS.Common.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    public class DictionaryDAL:IDictionaryDAL
    {
        /// <summary>
        /// GetDictionary with given details 
        /// </summary>
        /// <param name="dictionaryType"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            Logger.Info("Entering GetDictionary");
        
            string mlUrl = ConfigurationManager.AppSettings["MarkLogicResourceURL"] + "dictionary?rs:dictionaryType=" + dictionaryType + "&rs:format=" + outputFormat + "&name=dictionary";
            
            MLReader mlReader = new MLReader();
            var results = mlReader.GetHttpContent<object>(mlUrl);
            Logger.Debug("Logging results for GetDictionary with mlUrl");
            Logger.Info("Exiting GetDictionary");
            return results;
        }
    }
}

using Macmillan.CMS.Common;
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
        public object GetDictionary(string dictionaryType, string outputFormat)
        {
            string mlUrl = ConfigurationManager.AppSettings["MarkLogic_DICTIONARY_URL"] + "?rs:dictionaryType=" + dictionaryType + "&rs:output-format=" + outputFormat;
        
            MLReader mlReader = new MLReader();
            var results = mlReader.GetHttpContent<object>(mlUrl);

            return results;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.Business
{
    /// <summary>
    /// Interface for DictionaryBusiness layer
    /// </summary>
    public interface IDictionaryBusiness
    {
        object GetDictionary(string dictionaryType, string outputFormat);        
    }
}

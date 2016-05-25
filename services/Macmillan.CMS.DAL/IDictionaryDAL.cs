using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macmillan.CMS.DAL
{
    /// <summary>
    /// Interface for DictionaryDAL Layer
    /// </summary>
    public interface IDictionaryDAL
    {
        object GetDictionary(string dictionaryType, string outputFormat);        
    }
}

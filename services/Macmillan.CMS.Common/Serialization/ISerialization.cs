namespace Macmillan.CMS.Common
{
    using System;
    using System.IO;
    using System.Linq;
   
    public interface ISerialization
    {
        string Serialize<T>(object o);

        T DeSerialize<T>(string content);

        object DeSerialize(string content);

        string ConvertToJson(string xml);

        string SerializeAnonymous(object obj);
    }
}
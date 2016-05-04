namespace Macmillan.CMS.Common
{
    using System;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json;

    public class JsonNetSerialization : ISerialization
    {
        public JsonSerializerSettings settings { get; set; }
        
        public string Serialize<T>(object o)
        {
            JsonSerializerSettings serializerSettings = null;

            if (this.settings == null)
            {
                serializerSettings = new JsonSerializerSettings();
                serializerSettings.TypeNameHandling = TypeNameHandling.Objects;
                serializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            }
            else
            {
                serializerSettings = this.settings;
            }

            return JsonConvert.SerializeObject((T)o, serializerSettings);
        }

        public T DeSerialize<T>(string content)
        {
            return JsonConvert.DeserializeObject<T>(content);            
        }

        public object DeSerialize(string content)
        {
            return JsonConvert.DeserializeObject(content);
        }
    }
}

namespace Macmillan.CMS.DAL
{
    using Macmillan.CMS.Common;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;

    public class MLReader
    {
        private readonly JsonNetSerialization serializer = new JsonNetSerialization();

        public string HttpInvoke(string url, SupportedHttpMethods httpMethod, string mediaType, string content = null)
        {
            using (var httpClass = new HttpClass(url, httpMethod, mediaType, content))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                return httpClass.GetResponseContent(); ;
            }
        }

        public object GetHttpResponse(string url)
        {
            string content;
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, "text/json", url))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                content = httpClass.GetResponseContent();
            }

            JsonNetSerialization ser = new JsonNetSerialization();
            return ser.DeSerialize(content);
        }

        public string GetHttpContent(string url, string mediaType = "application/json")
        {
            string content;
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, mediaType, url))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                content = httpClass.GetResponseContent();
            }

            return content;
        }

        public T GetHttpContent<T>(string url)
        {
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, "text/json", url))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                string content = httpClass.GetResponseContent();
                return (T)this.serializer.DeSerialize<T>(content);
            }
        }

        public void ProcessErrors(HttpClass httpClass) // string errorContent, bool isCustomError)
        {
            if (httpClass.errorOccurred)
            {
                Exception cmsException = new Exception(httpClass.GetResponseContent());

                throw cmsException;
            }
        }
    }
}

﻿
namespace Macmillan.CMS.DAL
{
    using Macmillan.CMS.Common;
    using Macmillan.CMS.Common.Logging;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Configuration;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;

    public class MLReader
    {
        private readonly JsonNetSerialization serializer = new JsonNetSerialization();
                
        public string HttpInvoke(string url, SupportedHttpMethods httpMethod, 
            string mediaType, 
            string content = null,
            Dictionary<string, string> requestHeaders = null,
            Dictionary<string, string> contentHeaders = null)
        {
            using (var httpClass = new HttpClass(url, httpMethod, mediaType, content, requestHeaders, contentHeaders))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                return httpClass.GetResponseContent(); ;
            }
        }

        public object GetHttpResponse(string url,
            Dictionary<string, string> requestHeaders = null)
        {
            string content;
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, "text/json", url, requestHeaders))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                content = httpClass.GetResponseContent();
            }

            JsonNetSerialization ser = new JsonNetSerialization();
            return ser.DeSerialize(content);
        }

        public string GetHttpContent(string url, 
            string mediaType = "application/json", 
            Dictionary<string, string> requestHeaders = null)
        {
            string content;
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, mediaType, url, requestHeaders))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                content = httpClass.GetResponseContent();
            }

            return content;
        }

        public T GetHttpContent<T>(string url,
            string mediaType = "application/json", 
            Dictionary<string, string> requestHeaders = null)
        {
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.GET, mediaType, null, requestHeaders))
            {
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                string content = httpClass.GetResponseContent();
                return (T)this.serializer.DeSerialize<T>(content);
            }
        }

        public T ConverttoJson<T>(string Data)
        {
            object results = null;
            try
            {
                results = (T)this.serializer.DeSerialize<T>(Data);
            }
            catch (Exception ex)
            {
                var error = new { responseCode = "401", message = "Please contact the system administrator" };
                if (ex.Message.Contains("401"))
                {
                    error = new { responseCode = "401", message = "Error 401 - Unauthorized: Access is denied" };
                    Logger.Error("Error message for ConverttoJson in MlReader");
                }
                
                results = error;
            }

            return (T)results;
        }

        public string UploadFile(string url, 
       string mediaType,
       string file = null,
       Dictionary<string, string> requestHeaders = null,
       Dictionary<string, string> contentHeaders = null)
        {
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.POST, mediaType, null, requestHeaders, contentHeaders))
            {
                httpClass.file = file;
                httpClass.Invoke();

                this.ProcessErrors(httpClass);

                return httpClass.GetResponseContent(); ;
            }
        }

        /* download code started*/
        public HttpResponseMessage DownloadFile(string url,
       string mediaType,
       string file = null,
       Dictionary<string, string> requestHeaders = null,
       Dictionary<string, string> contentHeaders = null)
        {
            using (var httpClass = new HttpClass(url, SupportedHttpMethods.POST, mediaType, file, requestHeaders, contentHeaders))
            {
              return httpClass.GetWebFileResponse(url, file); ;
            }
        }

      

        /* download code*/

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

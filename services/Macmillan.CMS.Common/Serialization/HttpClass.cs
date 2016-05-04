namespace Macmillan.CMS.Common
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Net.Cache;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Runtime.Serialization;
    using Newtonsoft.Json.Linq;
    using Macmillan.CMS.Common.Logging;

    public enum SupportedHttpMethods
    {
        GET,
        POST,
        PUT,
        DELETE
    }

    public class HttpClass : IDisposable
    {
        private Uri uri;

        private HttpMethod httpMethod;
        
        private HttpContent content;
        
        private HttpClient httpClient = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true });
        
        private Action action;

        private HttpResponseMessage httpResponseMessage;
  
        private bool disposed = false;
        
        public string responseStatusCode = string.Empty;
        public bool errorOccurred = false;

        public HttpClass(SupportedHttpMethods httpMethod, string uri, string mediaType = "text/json", string content = null)
        {
            if (content != null)
            {
                this.content = new StringContent(content);

                this.content.Headers.ContentType = new MediaTypeHeaderValue(mediaType);
            }

            
            this.uri = new Uri(uri);
            this.httpMethod = new HttpMethod(httpMethod.ToString());
            
            if (ConfigurationManager.AppSettings["TimeOut"] != null)
            {
                this.httpClient.Timeout = new TimeSpan(0, Convert.ToInt16(ConfigurationManager.AppSettings["TimeOut"]), 0);
            }

            switch (httpMethod)
            {
            case SupportedHttpMethods.GET:
                this.action = this.Get;
                break;
            case SupportedHttpMethods.POST:
                this.action = this.Post;
                break;
            case SupportedHttpMethods.PUT:
                this.action = this.Put;
                break;
            case SupportedHttpMethods.DELETE:
                this.action = this.Delete;
                break;
            default:
                throw new InvalidHttpMethodException();
            }
        }
       
        ~HttpClass()
        {
            this.Dispose(false);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public HttpResponseMessage GetHttpResponseMessage()
        {
            return this.httpResponseMessage;
        }
         
        public string  GetResponseContent()
        {
            string result = this.httpResponseMessage.Content.ReadAsStringAsync().Result;

            Logger.Debug("///////////Response from server//////////////////////");
            Logger.Debug(result);
            Logger.Debug("////////////////////////////////////////////////////");

            return result;       
        }

        public void Invoke()
        {
            this.action.Invoke();       
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (this.content != null)
                    {
                        this.content.Dispose();
                    }

                    if (this.httpClient != null)
                    {
                        this.httpClient.Dispose();
                    }
                }

                this.disposed = true;
            }
        }

        private void Delete()
        {
            this.httpResponseMessage = this.httpClient.DeleteAsync(this.uri).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void Get()
        {
            this.httpResponseMessage = this.httpClient.GetAsync(this.uri).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void Post()
        {
            this.httpResponseMessage = this.httpClient.PostAsync(this.uri, this.content).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void Put()
        {
            this.httpResponseMessage = this.httpClient.PutAsync(this.uri, this.content).Result;
            this.IdentifyErrors(this.httpResponseMessage);
        }

        private void IdentifyErrors(HttpResponseMessage msg)
        {
            string content = msg.ToString();
            Logger.Debug(content);

            responseStatusCode = msg.StatusCode.ToString();

            if (!responseStatusCode.Contains("20"))
               this.errorOccurred = true;               
        }
 }

    [Serializable]
    public class InvalidHttpMethodContentCombinationException : Exception
    {        
         public InvalidHttpMethodContentCombinationException()
             : base("When specifying content, either a POST or PUT must be used")
         {
         }
    
         public InvalidHttpMethodContentCombinationException(string msg)
             : base(msg) 
        { 
        }
               
        public InvalidHttpMethodContentCombinationException(string msg, Exception ex)
            : base(msg, ex)
        {
        }
      
        protected InvalidHttpMethodContentCombinationException(
            SerializationInfo info,
            StreamingContext context)
            : base(info, context)
        {            
        }

        public override void GetObjectData(
            SerializationInfo info,
            StreamingContext context)
        {
            base.GetObjectData(info, context);
        }
    }

    [Serializable]
    public class InvalidHttpMethodException : Exception
    {       
        public InvalidHttpMethodException()
            : base("Only PUT, POST, GET and DELETE Methods are supported")
        {
        }
       
        public InvalidHttpMethodException(string msg)
            : base(msg) 
        { 
        }
      
        public InvalidHttpMethodException(string msg, Exception ex)
            : base(msg, ex)
        {
        }

        protected InvalidHttpMethodException(
        SerializationInfo info,
        StreamingContext context)
        : base(info, context)
        {            
        }

        public override void GetObjectData(
        SerializationInfo info,
        StreamingContext context)
        {
            base.GetObjectData(info, context);
        }
 }
}
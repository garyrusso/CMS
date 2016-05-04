namespace Macmillan.CMS.Service.Filters
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web;
    using System.Web.Http;
    using System.Web.Http.Filters;
   
    using Macmillan.CMS.Common;
    using Macmillan.CMS.Common.Logging;

    /// <summary>
    /// Handles all exceptions across controllers at one location
    /// </summary>
    public class ManageExceptionAttribute : ExceptionFilterAttribute
    {
        /// <summary>
        /// Fires on any exception in any controller
        /// </summary>
        /// <param name="context">http action context</param>
        public override void OnException(HttpActionExecutedContext context)
        {
            HttpError httpError = null;
            try
            {
                CMSException cmsException = context.Exception as CMSException;
                
                if (cmsException != null) 
                {
                    Logger.Error(cmsException.Message, cmsException);
                    httpError = new HttpError(cmsException.ErrorMessage) { { "ErrorType", cmsException.ExceptionType } };
                }
                else
                {
                    Exception ex = context.Exception as Exception;

                    //// Log the exception
                    Logger.Error(ex.Message, ex);

                    httpError = new HttpError(ex.Message) { { "ErrorType", CMSExceptionTypes.ServiceException } };
                }                
            }
            catch (Exception ex)
            { 
                //// log the exception
                Logger.Error(ex.Message, ex);
                httpError = new HttpError(ex.Message) { { "ErrorType", CMSExceptionTypes.ServiceException } };
                
            }

            throw new HttpResponseException(context.Request.CreateErrorResponse(HttpStatusCode.BadRequest, httpError));           
        }
    } 
}
namespace Macmillan.CMS.Common.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using log4net;
    using log4net.Config;
    
    /// <summary>
    /// implements the Logger functionalities defined in ILogger
    /// </summary>
    public sealed class Log4NetWrapper : ILogger
    {
        /// <summary>
        /// logger object used for logging
        /// </summary>
        private readonly log4net.ILog logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="Log4NetWrapper"/> class.
        /// </summary>
        /// <param name="type">Logger type</param>
        public Log4NetWrapper(Type type)
        {
            if (!LogManager.GetRepository().Configured)
            {
                XmlConfigurator.Configure();
            }

            if (type == null)
            {
                this.logger = LogManager.GetLogger(typeof(Logger));
            }
            else
            {
                this.logger = LogManager.GetLogger(type);
            }
        }

        public Log4NetWrapper(string loggerName)
        {
            this.logger = LogManager.GetLogger(loggerName);
        }

        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        public void Debug(object message)
        {
            if (this.logger.IsDebugEnabled)
            {
                this.logger.Debug(message);
            }
        }

        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        /// <param name="exception">exception object</param>
        public void Debug(object message, Exception exception)
        {
            if (this.logger.IsDebugEnabled)
            {
                this.logger.Debug(message, exception);
            }
        }

        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        public void Info(object message)
        {
            if (this.logger.IsInfoEnabled)
            {
                this.logger.Info(message);
            }
        }

        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        /// <param name="exception">exception object</param>
        public void Info(object message, Exception exception)
        {
            if (this.logger.IsInfoEnabled)
            {
                this.logger.Info(message, exception);
            }
        }

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        public void Warn(object message)
        {
            if (this.logger.IsWarnEnabled)
            {
                this.logger.Warn(message);
            }
        }

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        /// <param name="exception">exception object</param>
        public void Warn(object message, Exception exception)
        {
            if (this.logger.IsWarnEnabled)
            {
                this.logger.Warn(message, exception);
            }
        }

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        public void Error(object message)
        {
            if (this.logger.IsErrorEnabled)
            {
                this.logger.Error(message);
            }
        }

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        /// <param name="exception">exception object</param>
        public void Error(object message, Exception exception)
        {
            if (this.logger.IsErrorEnabled)
            {
                this.logger.Error(message, exception);
            }
        }

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        public void Fatal(object message)
        {
            if (this.logger.IsFatalEnabled)
            {
                this.logger.Fatal(message);
            }
        }

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        /// <param name="exception">exception object</param>
        public void Fatal(object message, Exception exception)
        {
            if (this.logger.IsFatalEnabled)
            {
                this.logger.Fatal(message, exception);
            }
        }
    }
}

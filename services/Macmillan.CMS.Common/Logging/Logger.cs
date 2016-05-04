[assembly: log4net.Config.XmlConfigurator(Watch = true)]
[assembly: log4net.Config.Repository]

namespace Macmillan.CMS.Common.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    /// <summary>
    /// Implements the Logging functionalities
    /// </summary>
    public static class Logger
    {
        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        public static void Debug(object message)
        {
            Log(GetLogger(), message, LoggerLevel.Debug);
        }

        public static void LogInfo(string logMsg)
        {
            ILogger logger = new Log4NetWrapper("InterctiveApplication");
            Log(logger, logMsg, LoggerLevel.Info);
        }

        /// <summary>
        /// Logs a debug message
        /// </summary>
        /// <param name="message">message to log</param>
        /// <param name="exception">exception object</param>
        public static void Debug(object message, Exception exception)
        {
            Log(GetLogger(), message, exception, LoggerLevel.Debug);
        }

        /// <summary>
        /// Logs debug message based on specified format
        /// </summary>
        /// <param name="message">debug message</param>
        /// <param name="args">message parameters</param>
        public static void DebugFormat(string message, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), LoggerLevel.Debug);
        }

        /// <summary>
        /// Logs debug message based on specified format
        /// </summary>
        /// <param name="message">debug message</param>
        /// <param name="exception">exception object</param>
        /// <param name="args">message parameters</param>
        public static void DebugFormat(string message, Exception exception, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), exception, LoggerLevel.Debug);
        }
       
        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        public static void Info(object message)
        {
            Log(GetLogger(), message, LoggerLevel.Info);
        }

        /// <summary>
        /// Logs information
        /// </summary>
        /// <param name="message">information message</param>
        /// <param name="exception">exception object</param>
        public static void Info(object message, Exception exception)
        {
            Log(GetLogger(), message, exception, LoggerLevel.Info);
        }

        /// <summary>
        /// Logs information based on specified parameter
        /// </summary>
        /// <param name="message">information message</param>
        /// <param name="args">exception object</param>
        public static void InfoFormat(string message, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), LoggerLevel.Info);
        }

        /// <summary>
        /// Logs information based on specified parameter
        /// </summary>
        /// <param name="message">information message</param>
        /// <param name="exception">exception object</param>
        /// <param name="args">message arguments</param>
        public static void InfoFormat(string message, Exception exception, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), exception, LoggerLevel.Info);
        }

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        public static void Warning(object message)
        {
            Log(GetLogger(), message, LoggerLevel.Warning);
        }

        /// <summary>
        /// Logs a warning message
        /// </summary>
        /// <param name="message">warning message</param>
        /// <param name="exception">exception object</param>
        public static void Warning(object message, Exception exception)
        {
            Log(GetLogger(), message, exception, LoggerLevel.Warning);
        }

        /// <summary>
        /// Logs a warning message in a specified format
        /// </summary>
        /// <param name="message">warning message</param>
        /// <param name="args">message arguments</param>
        public static void WarningFormat(string message, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), LoggerLevel.Warning);
        }

        /// <summary>
        /// Logs a warning message in a specified format
        /// </summary>
        /// <param name="message">warning message</param>
        /// <param name="exception">exception object</param>
        /// <param name="args">message arguments</param>
        public static void WarningFormat(string message, Exception exception, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), exception, LoggerLevel.Warning);
        }

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        public static void Error(object message)
        {
            Log(GetLogger(), message, LoggerLevel.Error);
        }

        /// <summary>
        /// Logs an error message
        /// </summary>
        /// <param name="message">error message</param>
        /// <param name="exception">exception object</param>
        public static void Error(object message, Exception exception)
        {
            Log(GetLogger(), message, exception, LoggerLevel.Error);
        }

        /// <summary>
        /// Logs an error message in a specified format
        /// </summary>
        /// <param name="message">error message</param>
        /// <param name="args">message arguments</param>
        public static void ErrorFormat(string message, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), LoggerLevel.Error);
        }

        /// <summary>
        /// Logs an error message in a specified format
        /// </summary>
        /// <param name="message">error message</param>
        /// <param name="exception">exception object</param>
        /// <param name="args">message arguments</param>
        public static void ErrorFormat(string message, Exception exception, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), exception, LoggerLevel.Error);
        }

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        public static void Fatal(object message)
        {
            Log(GetLogger(), message, LoggerLevel.Fatal);
        }

        /// <summary>
        /// Logs a fatal error message
        /// </summary>
        /// <param name="message">fatal error message</param>
        /// <param name="exception">exception object</param>
        public static void Fatal(object message, Exception exception)
        {
            Log(GetLogger(), message, exception, LoggerLevel.Fatal);
        }

        /// <summary>
        /// Logs a fatal error message in a specified format
        /// </summary>
        /// <param name="message">fatal error message</param>
        /// <param name="args">message arguments</param>
        public static void FatalFormat(string message, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), LoggerLevel.Fatal);
        }

        /// <summary>
        /// Logs a fatal error message in a specified format
        /// </summary>
        /// <param name="message">fatal error message</param>
        /// <param name="exception">exception object</param>
        /// <param name="args">message arguments</param>
        public static void FatalFormat(string message, Exception exception, params object[] args)
        {
            Log(GetLogger(), string.Format(message, args), exception, LoggerLevel.Fatal);
        }
       
        /// <summary>
        /// Logs a message
        /// </summary>
        /// <param name="message">message to be logged</param>
        /// <param name="loggerLevel">Log level of the message</param>
        public static void Log(object message, LoggerLevel loggerLevel)
        {
            Log(GetLogger(), message, loggerLevel);
        }

        /// <summary>
        /// Logs a message
        /// </summary>
        /// <param name="message">message to be logged</param>
        /// <param name="exception">exception object to be logged</param>
        /// <param name="loggerLevel">log level of the message</param>
        public static void Log(object message, Exception exception, LoggerLevel loggerLevel)
        {
            Log(GetLogger(), message, exception, loggerLevel);
        }

        /// <summary>
        /// Gets logger object
        /// </summary>
        /// <returns>logger object</returns>
        private static ILogger GetLogger()
        {
            StackTrace currentStack = new StackTrace();

            StackFrame currentFrame = currentStack.GetFrame(2);

            if (null != currentFrame)
            {
                return GetLogger(currentFrame.GetMethod().DeclaringType);
            }
            else
            {
                // If -for whatever reason- the currentFrame is null, we use the current
                // type instead to prevent a null pointer exception being thrown.
                Type currentType = typeof(Logger);

                ILogger logger = GetLogger(currentType);

                logger.Warn(string.Format(
                        "Macmillan.CMS.Logging: Failed to initialise logger for invoking type, using native type '{0}' instead",
                        currentType.FullName));

                return logger;
            }
        }

        /// <summary>
        /// Gets logger based on type
        /// </summary>
        /// <param name="type">logger type</param>
        /// <returns>logger object</returns>
        private static ILogger GetLogger(Type type)
        {
            return new Log4NetWrapper(type);
        }

        /// <summary>
        /// Logs a message
        /// </summary>
        /// <param name="logger">Logger object for logging</param>
        /// <param name="message">message to be logged</param>
        /// <param name="loggerLevel">log level of the message</param>
        private static void Log(ILogger logger, object message, LoggerLevel loggerLevel)
        {
            Log(logger, message, null, loggerLevel);
        }

        /// <summary>
        /// Logs a message
        /// </summary>
        /// <param name="logger">Logger object to log</param>
        /// <param name="message">log message to be logged</param>
        /// <param name="exception">exception object</param>
        /// <param name="loggerLevel">log level of the message</param>
        private static void Log(ILogger logger, object message, Exception exception, LoggerLevel loggerLevel)
        {
            switch (loggerLevel)
            {
                case LoggerLevel.Debug:
                    if (null == exception)
                    {
                        logger.Debug(message);
                    }
                    else
                    {
                        logger.Debug(message, exception);
                    }

                    break;
                case LoggerLevel.Info:
                    if (null == exception)
                    {
                        logger.Info(message);
                    }
                    else
                    {
                        logger.Info(message, exception);
                    }

                    break;
                case LoggerLevel.Warning:
                    if (null == exception)
                    {
                        logger.Warn(message);
                    }
                    else
                    {
                        logger.Warn(message, exception);
                    }

                    break;
                case LoggerLevel.Error:
                    if (null == exception)
                    {
                        logger.Error(message);
                    }
                    else
                    {
                        logger.Error(message, exception);
                    }

                    break;
                case LoggerLevel.Fatal:
                    if (null == exception)
                    {
                        logger.Fatal(message);
                    }
                    else
                    {
                        logger.Fatal(message, exception);
                    }

                    break;
                default:
                    throw new NotImplementedException(
                        string.Format("LoggerLevel '{0}' not implemented", loggerLevel));
            }
        }       
    }
}

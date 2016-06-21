namespace Macmillan.CMS.Common
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Caching;

    /// <summary>
    /// Cache layer for the application. It abstracts away the actual cache store and access implementations
    /// </summary>
    public sealed class CustomCache
    {
        /// <summary>
        /// Retrieves the specified item from the Cache object.
        /// </summary>
        /// <param name="key">key to retrieve value</param>
        /// <returns>cache item</returns>
        public static object Get(string key)
        {
            return System.Web.HttpRuntime.Cache.Get(key);
        }

        /// <summary>
        /// Adds the specified item to the Cache object with dependencies, expiration and priority policies, 
        /// and a delegate you can use to notify your application when the inserted item is removed from the Cache.
        /// </summary>
        /// <param name="key">Cache object key</param>
        /// <param name="value">Cache object value</param>
        /// <param name="dependencies">cache dependency</param>
        /// <param name="absoluteExpiration">cache expiration time</param>
        /// <param name="slidingExpiration">sliding expiration time</param>
        /// <param name="priority">cache priority. Has impact during scavenging</param>
        /// <param name="onRemoveCallback">callback method on item removal</param>
        /// <returns>cache item</returns>
        public static object Add(
            string key,
            object value,
            CacheDependency dependencies = null,
            DateTime? absoluteExpiration = null,
            TimeSpan? slidingExpiration = null,
            CacheItemPriority priority = CacheItemPriority.Normal,
            CacheItemRemovedCallback onRemoveCallback = null)
        {
            return
                System.Web.HttpRuntime.Cache.Add(
                key,
                value,
                dependencies,
                absoluteExpiration == null ? System.Web.Caching.Cache.NoAbsoluteExpiration : (DateTime)absoluteExpiration,
                slidingExpiration == null ? System.Web.Caching.Cache.NoSlidingExpiration : (TimeSpan)slidingExpiration,
                priority,
                onRemoveCallback);
        }

        /// <summary>
        /// Check if the item is exit or not from the Cache object.
        /// </summary>
        /// <param name="value">value to compare</param>
        /// <returns>true or false</returns>
        public static new bool Equals(object value)
        {
            return System.Web.HttpRuntime.Cache.Equals(value);
        }

        /// <summary>
        /// Retrieves a dictionary enumerator used to iterate through the key settings
        /// and their values contained in the cache.
        /// </summary>
        /// <returns>IDictionary Enumerator</returns>
        public static IDictionaryEnumerator GetEnumerator()
        {
            return System.Web.HttpRuntime.Cache.GetEnumerator();
        }

        /// <summary>
        /// Gets the Type of the current instance.
        /// </summary>
        /// <returns>Type object</returns>
        public static new Type GetType()
        {
            return System.Web.HttpRuntime.Cache.GetType();
        }

        /// <summary>
        /// Removes the specified item from the application's Cache object.
        /// </summary>
        /// <param name="key">cache item key</param>
        /// <returns>Removed object</returns>
        public static object Remove(string key)
        {
            return System.Web.HttpRuntime.Cache.Remove(key);
        }

        /// <summary>
        /// Inserts an item into the Cache object with a cache key to reference 
        /// its location, using default values provided by the CacheItemPriority enumeration.
        /// </summary>
        /// <param name="key">Cache object key</param>
        /// <param name="value">Cache object value</param>
        public static void Insert(string key, object value)
        {
            System.Web.HttpRuntime.Cache.Insert(key, value);
        }

        /// <summary>
        /// Used to identify whether the current cache hold repective key or not
        /// </summary>
        /// <param name="key">Cache object key</param>
        /// <returns>returns boolean value</returns>
        public static bool HasKey(string key)
        {
            var hasKey = System.Web.HttpRuntime.Cache.Get(key);
            return hasKey != null ? true : false;
        }

        /// <summary>
        /// Enables parallelization of a query. 
        /// </summary>
        /// <param name="source">enumerable source</param>
        /// <returns>parallel query</returns>
        public static ParallelQuery AsParallel(System.Collections.IEnumerable source = null)
        {
            return System.Web.HttpRuntime.Cache.AsParallel();
        }

        /// <summary>
        /// Converts an IEnumerable to a query object. 
        /// </summary>
        /// <param name="source">source enumerable</param>
        /// <returns>A Query object</returns>
        public static IQueryable AsQueryable(System.Collections.IEnumerable source = null)
        {
            return System.Web.HttpRuntime.Cache.AsQueryable();
        }

        /// <summary>
        /// Casts the elements of an IEnumerable to the specified type. 
        /// </summary>
        /// <typeparam name="TResult">TResult type</typeparam>
        /// <param name="source">Source enumerable</param>
        /// <returns>TResult enumerable</returns>
        public static IEnumerable<TResult> Cast<TResult>(System.Collections.IEnumerable source)
        {
            return System.Web.HttpRuntime.Cache.Cast<TResult>();
        }

        /// <summary>
        /// Filters the elements of an IEnumerable based on a specified type. 
        /// </summary>
        /// <typeparam name="TResult">TResult type</typeparam>
        /// <param name="source">source enumerable</param>
        /// <returns>TResult enumerable</returns>
        public static IEnumerable<TResult> OfType<TResult>(System.Collections.IEnumerable source)
        {
            return System.Web.HttpRuntime.Cache.OfType<TResult>();
        }

        /// <summary>
        /// Returns a string that represents the current object. 
        /// </summary>
        /// <returns>string representation</returns>
        public static new string ToString()
        {
            return System.Web.HttpRuntime.Cache.ToString();
        }

        /// <summary>
        /// Serves as the default hash function. 
        /// </summary>
        /// <returns>hash code for cache</returns>
        public static new int GetHashCode()
        {
            return System.Web.HttpRuntime.Cache.GetHashCode();
        }

        /// <summary>
        /// Gets the number of bytes available for the cache.
        /// </summary>
        /// <returns>available byes for the cache</returns>
        public static long EffectivePrivateBytesLimit()
        {
            return System.Web.HttpRuntime.Cache.EffectivePrivateBytesLimit;
        }

        /// <summary>
        /// Gets the number of items stored in the cache.
        /// </summary>
        /// <returns>cache items count</returns>
        public static int Count()
        {
            return System.Web.HttpRuntime.Cache.Count;
        }
    }
}
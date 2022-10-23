namespace Stickers.Utils
{
    public static class ResourceFilePathHelper
    {
        /// <summary>
        /// The resource files would always be copied to output folder("/bin"),
        /// use AppDomain.CurrentDomain.BaseDirectory to make it work
        /// for both VS debug scenario and SF cluster deployment scenario.
        /// </summary>
        private static readonly string BasePath = Path.Combine(
            AppDomain.CurrentDomain.BaseDirectory,
            AppDomain.CurrentDomain.RelativeSearchPath ?? string.Empty
        );

        /// <summary>
        /// Get the resource file path by relative path to Resource folder.
        /// </summary>
        /// <param name="relativePathToResource">relative file path.</param>
        /// <returns>file path.</returns>
        public static string GetFilePath(string relativePathToResource)
        {
            return Path.Combine(BasePath, relativePathToResource);
        }
    }
}

using Microsoft.AspNetCore.Http;

namespace DatingSite.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // when there is an error, add a new header
            response.Headers.Add("Application-Error", message);

            // enable display of new header
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
}
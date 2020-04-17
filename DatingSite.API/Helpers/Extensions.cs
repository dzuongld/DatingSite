using System;
using Microsoft.AspNetCore.Http;

namespace DatingSite.API.Helpers
{
    public static class Extensions
    {
        // extend on http response
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // when there is an error, add a new header
            response.Headers.Add("Application-Error", message);

            // enable display of new header
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        // extend on datetime
        public static int CalculateAge(this DateTime dateTime)
        {
            var age = DateTime.Today.Year - dateTime.Year;

            // not birthday yet
            if (dateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}
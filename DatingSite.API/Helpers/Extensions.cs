using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

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

        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            // convert to string format in camel case
            var camelCase = new JsonSerializerSettings();
            camelCase.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCase));

            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
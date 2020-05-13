using System.Net;
using System.Text;
using AutoMapper;
using DatingSite.API.Data;
using DatingSite.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace DatingSite.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // databases config depending on environment
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            // * inform the app about data path - appsettings.json
            services.AddDbContext<DataContext>(x =>
            {
                // *lazy loading
                x.UseLazyLoadingProxies();
                x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));

            });


            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
            {
                x.UseLazyLoadingProxies();
                x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            ConfigureServices(services);
        }

        // * Dependencies injection
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers().AddNewtonsoftJson(option =>
            {
                //* fix self referencing loop error
                option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // * fix 'no access control allow origin'
            services.AddCors();

            // * map Cloudinary settings from appsettings to helper class
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            // * automapper as a service
            services.AddAutoMapper(typeof(DatingRepository).Assembly);

            // * an instance is created once per request
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IDatingRepository, DatingRepository>();

            // * authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false, // localhost
                    ValidateAudience = false
                };
            });

            // * to update user's last active
            services.AddScoped<LogUserActivity>();
        }

        // * Middlewares
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // * global exception handler
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();

                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });

                // app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            // for development purposes
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().
            AllowAnyHeader());

            // *authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // * serve static files
            // will find wwwroot/index.html
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "FallBack");
            });
        }
    }
}

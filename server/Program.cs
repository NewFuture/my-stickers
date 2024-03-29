using System.IO.Compression;
using Azure.Storage.Blobs;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.ApplicationInsights;
using Microsoft.Bot.Builder.Integration.ApplicationInsights.Core;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.OpenApi.Models;
using Stickers.Bot;
using Stickers.Middleware;
using Stickers.Service;
using Stickers.Utils;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.local.json", true);

builder.Configuration.AddEnvironmentVariables();

var configuration = builder.Configuration;

// Application Insights
builder.Services
    .AddApplicationInsightsTelemetry()
    // Create the telemetry client.
    .AddSingleton<IBotTelemetryClient, BotTelemetryClient>()
    // Add telemetry initializer that will set the correlation context for all telemetry items.
    .AddSingleton<ITelemetryInitializer, OperationCorrelationTelemetryInitializer>()
    // Add telemetry initializer that sets the user ID and session ID (in addition to other bot-specific properties such as activity ID)
    .AddSingleton<ITelemetryInitializer, StickersTelemetryInitializer>()
    // Create the telemetry middleware to initialize telemetry gathering
    .AddSingleton<TelemetryInitializerMiddleware>()
    // Create the telemetry middleware (used by the telemetry initializer) to track conversation events
    .AddSingleton<TelemetryLoggerMiddleware>();

if (builder.Configuration.GetValue<bool>(ConfigKeys.APPINSIGHTS_PROFILER_ENABLE, false))
{
    // Enable Profiler
    builder.Services.AddServiceProfiler();
}
builder.Services.AddControllers();

// Health check
builder.Services.AddHealthChecks();

// response compress
// https://learn.microsoft.com/en-us/aspnet/core/performance/response-compression?view=aspnetcore-6.0#brotli-and-gzip-compression-providers
builder.Services
    .AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.Providers.Add<BrotliCompressionProvider>();
        options.Providers.Add<GzipCompressionProvider>();
    })
    .Configure<BrotliCompressionProviderOptions>(options =>
    {
        options.Level = CompressionLevel.Fastest;
    })
    .Configure<GzipCompressionProviderOptions>(options =>
    {
        options.Level = CompressionLevel.Fastest;
    });

// App Dependencies
builder.Services
    .AddSingleton<DapperContext>()
    .AddSingleton<OfficialStickersService>()
    .AddSingleton<BlobServiceClient>(
        (o) =>
        {
            return new BlobServiceClient(
                configuration.GetConnectionString(ConfigKeys.BLOB_CONNECTION_STRING)
            );
        }
    )
    .AddSingleton<BlobService>()
    .AddSingleton<StickerDatabase>()
    .AddSingleton<SessionService>()
    .AddSingleton<StickerService>()
    .AddSingleton<SearchService>();

// Create the Bot Adapter with error handling enabled.
builder.Services
    .AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>()
    // Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
    .AddTransient<IBot, TeamsMessagingExtensionsBot>()
    // Create the Bot Framework Authentication to be used with the Bot Adapter.
    .AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

// http context for Admin
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Adding Admin Authentication
builder.Services
    .AddAuthorization(options =>
    {
        // admin
        options.AddPolicy(
            "Admin",
            policy =>
            {
                // https://learn.microsoft.com/en-us/azure/active-directory/roles/permissions-reference#role-template-ids
                policy.RequireClaim(
                    "wids",
                    new string[]
                    {
                        "62e90394-69f5-4237-9190-012177145e10", // Global Administrator
                        "69091246-20e8-4a56-aa4d-066075b2a7a8", // Teams Administrator
                        "29232cdf-9323-42fd-ade2-1d097af3e4de", // Exchange Administrator
                        "2b745bdf-0803-4d80-aa65-822c4493daac", // Office Apps Administrator
                    }
                );
                policy.AddAuthenticationSchemes(ENV.ID_TOKEN_DEFINITION);
                policy.AddRequirements(
                    new AuthorizationRequirement("Admin", JwtBearerDefaults.AuthenticationScheme)
                );
            }
        );
    })
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(
        ENV.ID_TOKEN_DEFINITION,
        options =>
        {
            var clientId = configuration[ConfigKeys.AAD_CLINET_ID];
            var webURL = configuration[ConfigKeys.WEB_URL];
            options.Authority = "https://login.microsoftonline.com/common/v2.0";
            options.TokenValidationParameters.ValidAudiences = new string[]
            {
                $"{webURL.Replace("https:", "api:")}/{clientId}", // teams sso
                clientId,
                $"{webURL}/{clientId}",
            };
            options.TokenValidationParameters.IssuerValidator =
                IssuerValidatorHelper.ValidateIssuerWithPlaceholder;
            options.TokenValidationParameters.ValidateIssuerSigningKey = true;
        }
    );

// .AddMicrosoftIdentityWebApi(builder.Configuration, ConfigKeys.AAD_SECTION);
builder.Services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();
builder.Services.AddMemoryCache();

// Add http services to the container.
builder.Services.AddHttpClient();

// Dev mode
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services
        .AddEndpointsApiExplorer()
        .AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition(
                ENV.ID_TOKEN_DEFINITION,
                new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme
                }
            );
            c.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = ENV.ID_TOKEN_DEFINITION
                            }
                        },
                        new List<string>()
                    }
                }
            );
        });
}

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    // configure CORS for local dev
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    // swagger UI
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.
// Eror Handler
app.UseMiddleware(typeof(GlobalErrorHandling));

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Response compression, Kestrel server does not provide built-in compress
app.UseResponseCompression();

// Home page to website
app.MapGet("/", () => Results.Redirect(configuration[ConfigKeys.WEB_URL], true));

// health check
app.MapHealthChecks("/healthz");

// Bot API
app.MapPost(
    "/bot/messages",
    (HttpRequest req, HttpResponse res, IBotFrameworkHttpAdapter adapter, IBot bot) =>
        adapter.ProcessAsync(req, res, bot)
);

// Controllers
app.MapControllers();

app.Run();

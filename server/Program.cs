using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Stickers.Bot;
using Stickers.Utils;
using Stickers.Search;
using Stickers.Service;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.OpenApi.Models;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.local.json", true);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddApplicationInsightsTelemetry(); // AI
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
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

builder.Services
    .AddSingleton<DapperContext>()
    .AddSingleton<OfficialStickersSearchHandler>()
    .AddSingleton<BlobServiceClient>(
        (o) =>
        {
            return new BlobServiceClient(
                builder.Configuration.GetConnectionString(ConfigKeys.BLOB_CONNECTION_STRING)
            );
        }
    )
    .AddSingleton<BlobService>()
    .AddSingleton<StickerDatabase>()
    .AddSingleton<SessionService>()
    .AddSingleton<StickerService>()
    .AddSingleton<SearchService>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Create the Bot Adapter with error handling enabled.
builder.Services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

// Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
builder.Services.AddTransient<IBot, TeamsMessagingExtensionsBot>();

// Create the Bot Framework Authentication to be used with the Bot Adapter.
builder.Services.AddSingleton<
    BotFrameworkAuthentication,
    ConfigurationBotFrameworkAuthentication
>();

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
            var clientId = builder.Configuration[ConfigKeys.AAD_CLINET_ID];
            var webURL = builder.Configuration[ConfigKeys.WEB_URL];
            options.Authority = $"https://login.microsoftonline.com/common/v2.0";
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

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors();
}

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); // configure CORS
}

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

// Eror Handler
app.UseMiddleware(typeof(GlobalErrorHandling));

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

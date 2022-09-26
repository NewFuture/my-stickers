using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Stickers.Bot;
using Stickers.Utils;
using Stickers.Search;
using Stickers.Service;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.local.json", true);

builder.Configuration.AddEnvironmentVariables();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddSingleton<DapperContext>()
    .AddSingleton<OfficialStickersSearchHandler>()
    .AddSingleton<BlobService>()
    .AddSingleton<StickerDatabase>()
    .AddSingleton<SessionService>()
    .AddSingleton<StickerService>()
    .AddSingleton<SearchService>();
// Create the Bot Framework Authentication to be used with the Bot Adapter.
//builder.Services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Create the Bot Adapter with error handling enabled.
builder.Services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();
// Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
builder.Services.AddTransient<IBot, TeamsMessagingExtensionsBot>();
// Adding Authentication  
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("EmployeeOnly", policy =>
    {
        policy.RequireClaim("oid");
        policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
        policy.AddRequirements(new AuthorizationRequirement("EmployeeOnly", JwtBearerDefaults.AuthenticationScheme));
    });
});
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration, ConfigKeys.AAD_SECTION);
// .AddJwtBearer(o =>builder.Configuration
// {
//     o.TokenValidationParameters = new TokenValidationParameters()
//     {

//         // IssuerValidator = (string issuer, SecurityToken securityToken, TokenValidationParameters validationParameters) => "true",
//         ValidAudiences = builder.Configuration[ConfigKeys.AAD_APP_ID].Split(","),
//         ValidateAudience = true,
//         ValidateIssuerSigningKey = true,
//         ValidateIssuer = true,
//     };
// });
builder.Services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();
builder.Services.AddMemoryCache();

// Add http services to the container.
builder.Services.AddHttpClient();

var app = builder.Build();


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

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.IdentityModel.Tokens;
using Stickers.Bot;
using Stickers.Search;
using Stickers.Service;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json");
builder.Configuration.AddEnvironmentVariables();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<StickerStorage>();
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<OfficialStickersSearchHandler>();
builder.Services.AddSingleton<BlobService>();

// Create the Bot Framework Authentication to be used with the Bot Adapter.
//builder.Services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

// Create the Bot Adapter with error handling enabled.
builder.Services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

// Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
builder.Services.AddTransient<IBot, TeamsMessagingExtensionsBot>();

builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<BlobService>();
builder.Services.AddSingleton<StickerStorage>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
// Adding Authentication  
//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);
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
    .AddJwtBearer(o =>
    {
        o.Audience = "9df8d009-4540-47e2-8711-36adb219fedb";
        o.Authority = "https://login.microsoftonline.com/a0783b62-a438-4df4-b01a-1922ce21ddbe/v2.0";
    });
builder.Services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();

var app = builder.Build();


// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

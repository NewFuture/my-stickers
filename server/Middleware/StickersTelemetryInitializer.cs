namespace Stickers.Middleware;
using System.Security.Claims;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.ApplicationInsights.Core;
using Newtonsoft.Json.Linq;
using Stickers.Service;
using Stickers.Utils;

/// <summary>
/// Initializer that sets the user ID and session ID (in addition to other stickers-api-specific properties such as activity ID).
/// include bot framework.
/// </summary>
public class StickersTelemetryInitializer : ITelemetryInitializer
{
    /// <summary>
    /// Constant key used for storing activity information in turn state.
    /// </summary>
    public static readonly string BotActivityKey = "BotBuilderActivity";

    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly SessionService sessionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="TelemetryBotIdInitializer"/> class.
    /// </summary>
    /// <param name="httpContextAccessor">The HttpContextAccessor used to access the current HttpContext.</param>
    public StickersTelemetryInitializer(
        IHttpContextAccessor httpContextAccessor,
        SessionService sessionService
    )
    {
        this.httpContextAccessor =
            httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        this.sessionService = sessionService;
    }

    /// <inheritdoc/>
    public void Initialize(ITelemetry telemetry)
    {
        if (telemetry == null)
        {
            return;
        }

        var httpContext = this.httpContextAccessor.HttpContext;
        var items = httpContext?.Items;

        if (items != null)
        {
            if (
                (
                    telemetry is RequestTelemetry
                    || telemetry is EventTelemetry
                    || telemetry is TraceTelemetry
                    || telemetry is DependencyTelemetry
                    || telemetry is PageViewTelemetry
                )
            )
            {
                if (items.TryGetValue(BotActivityKey, out var activity) && activity is JObject body)
                {
                    // bot message
                    initializeBot(telemetry, body);
                }
                else
                {
                    this.initializeApi(telemetry, httpContext!);
                }
            }
        }
    }

    private void initializeApi(ITelemetry telemetry, HttpContext httpContext)
    {
        var headers = httpContext.Request.Headers;
        telemetry.Context.User.UserAgent = headers.UserAgent;

        if (headers.TryGetValue(ENV.SESSION_HEADER_KEY, out var sessionKey))
        {
            telemetry.Context.Session.Id = sessionKey;
        }
        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            telemetry.Context.User.Id = httpContext.User.FindFirstValue("oid");
            var tenantId = httpContext.User.FindFirstValue("tid");
            var telemetryProperties = ((ISupportProperties)telemetry).Properties;
            telemetryProperties.TryAdd("tenantId", tenantId);
        }
        else if (Guid.TryParse(sessionKey, out var sessionId))
        {
            telemetry.Context.User.Id = this.sessionService.GetSessionInfo(sessionId).ToString();
        }
    }

    /// <summary>
    /// copy form https://github.com/microsoft/botbuilder-dotnet/blob/main/libraries/integration/Microsoft.Bot.Builder.Integration.ApplicationInsights.Core/TelemetryBotIdInitializer.cs.
    /// But change the userid (remove the channelId) and add tenantId.
    /// </summary>
    private static void initializeBot(ITelemetry telemetry, JObject body)
    {
        var fromid = string.Empty;
        var aadObjectId = string.Empty;
        var from = body["from"];
        if (from?.HasValues == true)
        {
            fromid = (string?)from["id"];
            aadObjectId = (string?)from["aadObjectId"];
        }

        var conversationId = string.Empty;
        var sessionId = string.Empty;
        var tenantId = string.Empty;
        var conversation = body["conversation"];
        if (conversation?.HasValues == true)
        {
            conversationId = (string?)conversation["id"];
            tenantId = (string?)conversation["tenantId"];
            sessionId = StringUtils.Hash(conversationId);
        }

        // Set the user id on the Application Insights telemetry item.
        telemetry.Context.User.Id = aadObjectId;
        telemetry.Context.User.AccountId = fromid;

        // Set the session id on the Application Insights telemetry item.
        // Hashed ID is used due to max session ID length for App Insights session Id
        telemetry.Context.Session.Id = sessionId;

        var telemetryProperties = ((ISupportProperties)telemetry).Properties;

        telemetryProperties.TryAdd("tenantId", tenantId);
        // Set the conversation id
        telemetryProperties.TryAdd("conversationId", conversationId);
        // Set the activity id https://github.com/Microsoft/botframework-obi/blob/master/botframework-activity/botframework-activity.md#id
        telemetryProperties.TryAdd("activityId", (string?)body["id"]);
        // Set the channel id https://github.com/Microsoft/botframework-obi/blob/master/botframework-activity/botframework-activity.md#channel-id
        telemetryProperties.TryAdd("channelId", (string?)body["channelId"]);
        // Set the activity type https://github.com/Microsoft/botframework-obi/blob/master/botframework-activity/botframework-activity.md#type
        telemetryProperties.TryAdd("activityType", (string?)body["type"]);
    }
}

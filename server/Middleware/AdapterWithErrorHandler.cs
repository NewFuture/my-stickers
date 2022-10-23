using Microsoft.Bot.Builder.Integration.ApplicationInsights.Core;
using Microsoft.Bot.Builder.Integration.AspNet.Core;

namespace Stickers.Middleware;

public class AdapterWithErrorHandler : CloudAdapter
{
    public AdapterWithErrorHandler(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<AdapterWithErrorHandler> logger,
        TelemetryInitializerMiddleware telemetryInitializerMiddleware
    ) : base(configuration, httpClientFactory, logger)
    {
        this.Use(telemetryInitializerMiddleware);
    }
}

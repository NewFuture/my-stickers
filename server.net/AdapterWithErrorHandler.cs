using Microsoft.Bot.Builder.Integration.AspNet.Core;

public class AdapterWithErrorHandler : CloudAdapter
{
    public AdapterWithErrorHandler(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AdapterWithErrorHandler>? logger = null) : base(configuration, httpClientFactory, logger)
    {
    }
}
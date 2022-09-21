using Microsoft.Bot.Builder.Integration.AspNet.Core;

public class AdapterWithErrorHandler : BotFrameworkHttpAdapter
{
    public AdapterWithErrorHandler(IConfiguration configuration, ILogger<BotFrameworkHttpAdapter> logger = null) : base(configuration, logger)
    {
    }
}
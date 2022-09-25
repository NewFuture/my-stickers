using Microsoft.AspNetCore.Mvc;
using Stickers.Service;
using Stickers.Utils;


namespace Stickers.Controllers;

public class ControllerSession<T> : ControllerBase
{
    private readonly SessionService sessionService;
    protected readonly ILogger<T> logger;


    public ControllerSession(SessionService sessionService, ILogger<T> logger)
    {
        this.logger = logger;
        this.sessionService = sessionService;
    }

    protected Guid GetUserId()
    {
        Request.Headers.TryGetValue(ENV.SESSION_HEADER_KEY, out var headerValue);
        if (!string.IsNullOrEmpty(headerValue))
        {
            Guid.TryParse(headerValue, out var sessionKey);
            var sessionInfo = this.sessionService.GetSessionInfo(sessionKey);
            if (sessionInfo == Guid.Empty)
            {
                logger.LogWarning("Invalid SessionKey" + headerValue);
                throw new UnauthorizedAccessException("invalidate session");
            }
            return sessionInfo;
        }
        logger.LogWarning("Empty Session Key");
        throw new UnauthorizedAccessException("SessionKey required");
    }
}
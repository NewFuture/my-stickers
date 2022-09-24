using Microsoft.AspNetCore.Mvc;
using Stickers.Service;
using System.Web.Http;

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
        var haveValue = Request.Headers.TryGetValue(ENV.SESSION_HEADER_KEY, out var headerValue);
        if (!string.IsNullOrEmpty(headerValue))
        {
            var sessionInfo = this.sessionService.GetSessionInfo(Guid.Parse(headerValue));
            return sessionInfo;
        }
        logger.LogWarning("Empty Session Key");
        throw new HttpResponseException(System.Net.HttpStatusCode.Unauthorized);
    }
}
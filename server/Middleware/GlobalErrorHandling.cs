using System.Net;
using System.Text.Json;

namespace Stickers.Middleware;

public class GlobalErrorHandling
{
    private readonly RequestDelegate next;

    private readonly ILogger<GlobalErrorHandling> logger;

    public GlobalErrorHandling(RequestDelegate next, ILogger<GlobalErrorHandling> logger)
    {
        this.next = next;
        this.logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, logger);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger<GlobalErrorHandling> logger)
    {
        HttpStatusCode status;
        var stackTrace = String.Empty;
        string message;
        var exceptionType = exception.GetType();
        if (exceptionType == typeof(BadHttpRequestException))
        {
            message = exception.Message;
            status = HttpStatusCode.BadRequest;
            stackTrace = exception.StackTrace;
            logger.LogWarning($"BadRequest {exception}");
        }
        if (exceptionType == typeof(NotImplementedException))
        {
            status = HttpStatusCode.NotImplemented;
            message = exception.Message;
            stackTrace = exception.StackTrace;
        }
        else if (exceptionType == typeof(UnauthorizedAccessException))
        {
            status = HttpStatusCode.Unauthorized;
            message = exception.Message;
            stackTrace = exception.StackTrace;
        }
        else if (exceptionType == typeof(KeyNotFoundException))
        {
            status = HttpStatusCode.Unauthorized;
            message = exception.Message;
            stackTrace = exception.StackTrace;
        }
        else
        {
            status = HttpStatusCode.InternalServerError;
            message = exception.Message;
            stackTrace = exception.StackTrace;
            logger.LogError(exception.ToString());
        }
        var exceptionResult = JsonSerializer.Serialize(
            new
            {
                error = message,
#if DEBUG
                stackTrace
#endif
            }
        );
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;
        return context.Response.WriteAsync(exceptionResult);
    }
}

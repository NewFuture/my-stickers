using Microsoft.AspNetCore.Authorization;

namespace Stickers.Middleware;

public class AuthorizationHandler : AuthorizationHandler<AuthorizationRequirement>
{
    /// <summary>
    /// just for testing.
    /// </summary>
    /// <param name="context">AuthorizationHandlerContext instance.</param>
    /// <param name="requirement">AuthorizationRequirement instance.</param>
    /// <returns>Async Task.</returns>
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AuthorizationRequirement requirement
    )
    {
        // Check if the current user token was authenticated. If true then authorize the user.
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}

using Microsoft.AspNetCore.Authorization;

namespace Stickers.Middleware;

/// <summary>
/// Validates the auth requirement.
/// </summary>
public class AuthorizationRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AuthorizationRequirement"/> class.
    /// </summary>
    /// <param name="policyName">The policy name of the requirement.</param>
    /// <param name="authType">The authType for the requirement.</param>
    public AuthorizationRequirement(string policyName, string authType)
    {
        this.PolicyName = policyName;
        this.AuthType = authType;
    }

    /// <summary>
    /// Gets or sets a value PolicyName.
    /// </summary>
    public string PolicyName { get; set; }

    /// <summary>
    /// Gets or sets a value AuthType.
    /// </summary>
    public string AuthType { get; set; }
}
